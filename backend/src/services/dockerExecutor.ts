/**
 * Docker executor service for running code in isolated containers
 */

import Docker from 'dockerode';
import { ExecutionResult } from '../types/repl';
import { DockerExecutor as IDockerExecutor, REPLError } from '../types/services';
import { DOCKER_CONFIG, REPL_CONFIG } from '../config/constants';
import { generateId, truncateOutput, sanitizeCode } from '../utils';

export class DockerExecutor implements IDockerExecutor {
  private docker: Docker;
  private containers: Map<string, Docker.Container> = new Map();

  constructor() {
    this.docker = new Docker({
      socketPath: process.env.DOCKER_HOST || '/var/run/docker.sock'
    });
  }

  /**
   * Execute code in a language-specific container
   */
  async executeInContainer(
    language: string,
    code: string,
    sessionId: string,
    timeout: number = REPL_CONFIG.DEFAULT_TIMEOUT
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      // Sanitize the input code
      const sanitizedCode = sanitizeCode(code);

      // Get or create container for this session
      const container = await this.getOrCreateContainer(language, sessionId);

      // Execute the code
      const result = await this.runCodeInContainer(container, sanitizedCode, language, timeout);

      const executionTime = Date.now() - startTime;

      return {
        output: truncateOutput(result.output),
        error: result.error,
        variables: result.variables || {},
        executionTime,
        timestamp: new Date()
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;

      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown execution error',
        variables: {},
        executionTime,
        timestamp: new Date()
      };
    }
  }

  /**
   * Create a new container for a language and session
   */
  async createContainer(language: string, sessionId: string): Promise<string> {
    const containerConfig = this.getContainerConfig(language, sessionId);

    try {
      const container = await this.docker.createContainer(containerConfig);
      await container.start();

      const containerId = container.id;
      this.containers.set(sessionId, container);

      return containerId;
    } catch (error) {
      throw new REPLError(`Failed to create container for ${language}`, sessionId);
    }
  }

  /**
   * Destroy a container
   */
  async destroyContainer(containerId: string): Promise<void> {
    try {
      const container = this.docker.getContainer(containerId);
      await container.kill();
      await container.remove();

      // Remove from our tracking
      for (const [sessionId, cont] of this.containers.entries()) {
        if (cont.id === containerId) {
          this.containers.delete(sessionId);
          break;
        }
      }
    } catch (error) {
      console.warn(`Failed to destroy container ${containerId}:`, error);
    }
  }

  /**
   * List all active containers
   */
  async listContainers(): Promise<string[]> {
    try {
      const containers = await this.docker.listContainers();
      return containers
        .filter((container: any) => container.Labels?.['tutorial-session'])
        .map((container: any) => container.Id);
    } catch (error) {
      console.error('Failed to list containers:', error);
      return [];
    }
  }

  /**
   * Clean up expired containers
   */
  async cleanupContainers(): Promise<void> {
    try {
      const containers = await this.docker.listContainers();
      const tutorialContainers = containers.filter((container: any) =>
        container.Labels?.['tutorial-session']
      );

      for (const containerInfo of tutorialContainers) {
        const createdTime = new Date(containerInfo.Created * 1000);
        const age = Date.now() - createdTime.getTime();

        if (age > REPL_CONFIG.SESSION_TIMEOUT) {
          await this.destroyContainer(containerInfo.Id);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup containers:', error);
    }
  }

  /**
   * Get or create container for session
   */
  private async getOrCreateContainer(language: string, sessionId: string): Promise<Docker.Container> {
    let container = this.containers.get(sessionId);

    if (!container) {
      await this.createContainer(language, sessionId);
      container = this.containers.get(sessionId);
    }

    if (!container) {
      throw new REPLError('Failed to create or retrieve container', sessionId);
    }

    return container;
  }

  /**
   * Run code in container and capture output
   */
  private async runCodeInContainer(
    container: Docker.Container,
    code: string,
    language: string,
    timeout: number
  ): Promise<{ output: string; error?: string; variables?: Record<string, any> }> {

    const command = this.getExecutionCommand(language, code);

    try {
      const exec = await container.exec({
        Cmd: command,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false
      });

      const stream = await exec.start({ hijack: true, stdin: false });

      return new Promise((resolve, reject) => {
        let output = '';
        let error = '';

        const timeoutId = setTimeout(() => {
          reject(new Error('Execution timeout'));
        }, timeout);

        stream.on('data', (chunk: Buffer) => {
          const data = chunk.toString();
          // Docker multiplexes stdout/stderr, first byte indicates stream type
          if (chunk[0] === 1) {
            output += data.slice(8); // stdout
          } else if (chunk[0] === 2) {
            error += data.slice(8); // stderr
          }
        });

        stream.on('end', () => {
          clearTimeout(timeoutId);
          resolve({
            output: output.trim(),
            error: error.trim() || undefined,
            variables: {} // TODO: Extract variables from output
          });
        });

        stream.on('error', (err) => {
          clearTimeout(timeoutId);
          reject(err);
        });
      });

    } catch (error) {
      throw new REPLError(`Execution failed: ${error}`, '');
    }
  }

  /**
   * Get container configuration for language
   */
  private getContainerConfig(language: string, sessionId: string): Docker.ContainerCreateOptions {
    const baseConfig = {
      Image: this.getDockerImage(language),
      Labels: {
        'tutorial-session': sessionId,
        'tutorial-language': language
      },
      HostConfig: {
        Memory: this.parseMemoryLimit(REPL_CONFIG.MAX_MEMORY),
        CpuQuota: Math.floor(REPL_CONFIG.MAX_CPU * 100000),
        CpuPeriod: 100000,
        NetworkMode: DOCKER_CONFIG.NETWORK_MODE,
        ReadonlyRootfs: DOCKER_CONFIG.READ_ONLY,
        SecurityOpt: ['no-new-privileges:true'],
        Tmpfs: { '/tmp': 'rw,noexec,nosuid,size=100m' }
      },
      WorkingDir: DOCKER_CONFIG.WORKING_DIR,
      Cmd: ['tail', '-f', '/dev/null'], // Keep container running
      AttachStdin: false,
      AttachStdout: false,
      AttachStderr: false,
      Tty: false
    };

    return baseConfig;
  }

  /**
   * Get execution command for language
   */
  private getExecutionCommand(language: string, code: string): string[] {
    switch (language) {
      case 'python':
        return ['python3', '-c', code];

      case 'javascript':
        return ['node', '-e', code];

      case 'typescript':
        // Use tsx for TypeScript execution
        return ['npx', 'tsx', '-e', code];

      case 'ruby':
        return ['ruby', '-e', code];

      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  /**
   * Get Docker image for language
   */
  private getDockerImage(language: string): string {
    switch (language) {
      case 'python':
        return 'python:3.11-slim';

      case 'javascript':
      case 'typescript':
        return 'node:18-slim';

      case 'ruby':
        return 'ruby:3.2-slim';

      default:
        throw new Error(`No Docker image configured for language: ${language}`);
    }
  }

  /**
   * Parse memory limit string to bytes
   */
  private parseMemoryLimit(limit: string): number {
    const match = limit.match(/^(\d+)([kmg]?)$/i);
    if (!match) return 128 * 1024 * 1024; // Default 128MB

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 'k': return value * 1024;
      case 'm': return value * 1024 * 1024;
      case 'g': return value * 1024 * 1024 * 1024;
      default: return value;
    }
  }
}
