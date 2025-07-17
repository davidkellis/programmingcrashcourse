/**
 * REPL service for managing code execution sessions
 */

import { DockerExecutor } from './dockerExecutor';
import { ExecutionResult, SessionState, ExecutionRecord } from '../types/repl';
import { REPLService as IREPLService, REPLError, SessionError } from '../types/services';
import { generateSessionId, isValidId, isExpired } from '../utils';
import { REPL_CONFIG } from '../config/constants';
import { isLanguageSupported } from '../config/languages';

export class REPLService implements IREPLService {
  private dockerExecutor: DockerExecutor;
  private sessions: Map<string, SessionState> = new Map();

  constructor() {
    this.dockerExecutor = new DockerExecutor();

    // Start cleanup interval
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 60000); // Check every minute
  }

  /**
   * Execute code in a session
   */
  async executeCode(sessionId: string, code: string, language: string): Promise<ExecutionResult> {
    if (!isValidId(sessionId)) {
      throw new REPLError('Invalid session ID', sessionId);
    }

    if (!isLanguageSupported(language)) {
      throw new REPLError(`Language ${language} is not supported`, sessionId);
    }

    // Get or create session
    let session = this.sessions.get(sessionId);
    if (!session) {
      throw new SessionError('Session not found or expired', sessionId);
    }

    // Check if session is expired
    if (isExpired(session.lastActivity, REPL_CONFIG.SESSION_TIMEOUT)) {
      this.sessions.delete(sessionId);
      throw new SessionError('Session has expired', sessionId);
    }

    try {
      // Execute code in Docker container
      const result = await this.dockerExecutor.executeInContainer(
        language,
        code,
        sessionId,
        REPL_CONFIG.DEFAULT_TIMEOUT
      );

      // Update session state
      session.lastActivity = new Date();

      // Add to execution history
      const executionRecord: ExecutionRecord = {
        id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: result.timestamp,
        input: code,
        output: result.output,
        error: result.error,
        executionTime: result.executionTime
      };

      session.executionHistory.push(executionRecord);

      // Keep history size manageable
      if (session.executionHistory.length > REPL_CONFIG.MAX_HISTORY_SIZE) {
        session.executionHistory = session.executionHistory.slice(-REPL_CONFIG.MAX_HISTORY_SIZE);
      }

      // Update variables (basic implementation)
      if (result.variables) {
        session.variables = { ...session.variables, ...result.variables };
      }

      this.sessions.set(sessionId, session);

      return result;

    } catch (error) {
      // Update session activity even on error
      session.lastActivity = new Date();
      this.sessions.set(sessionId, session);

      if (error instanceof REPLError) {
        throw error;
      }

      throw new REPLError(
        error instanceof Error ? error.message : 'Code execution failed',
        sessionId,
        code
      );
    }
  }

  /**
   * Create a new REPL session
   */
  async createSession(language: string, userId?: string): Promise<string> {
    if (!isLanguageSupported(language)) {
      throw new REPLError(`Language ${language} is not supported`, '');
    }

    const sessionId = generateSessionId();
    const now = new Date();

    const sessionState: SessionState = {
      variables: {},
      functions: {},
      imports: [],
      executionHistory: [],
      language,
      createdAt: now,
      lastActivity: now
    };

    this.sessions.set(sessionId, sessionState);

    try {
      // Create Docker container for this session
      await this.dockerExecutor.createContainer(language, sessionId);

      return sessionId;
    } catch (error) {
      // Clean up session if container creation fails
      this.sessions.delete(sessionId);
      throw new REPLError(`Failed to create session: ${error}`, sessionId);
    }
  }

  /**
   * Get session state
   */
  async getSessionState(sessionId: string): Promise<SessionState> {
    if (!isValidId(sessionId)) {
      throw new SessionError('Invalid session ID', sessionId);
    }

    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new SessionError('Session not found', sessionId);
    }

    if (isExpired(session.lastActivity, REPL_CONFIG.SESSION_TIMEOUT)) {
      this.sessions.delete(sessionId);
      throw new SessionError('Session has expired', sessionId);
    }

    // Update last activity
    session.lastActivity = new Date();
    this.sessions.set(sessionId, session);

    return { ...session }; // Return copy to prevent external modification
  }

  /**
   * Reset session state
   */
  async resetSession(sessionId: string): Promise<void> {
    if (!isValidId(sessionId)) {
      throw new SessionError('Invalid session ID', sessionId);
    }

    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new SessionError('Session not found', sessionId);
    }

    // Reset session state but keep language and timestamps
    const resetState: SessionState = {
      variables: {},
      functions: {},
      imports: [],
      executionHistory: [],
      language: session.language,
      createdAt: session.createdAt,
      lastActivity: new Date()
    };

    this.sessions.set(sessionId, resetState);

    // Recreate Docker container
    try {
      // Find and destroy old container
      const containers = await this.dockerExecutor.listContainers();
      for (const containerId of containers) {
        // This is a simplified approach - in practice you'd need better container tracking
        await this.dockerExecutor.destroyContainer(containerId);
      }

      // Create new container
      await this.dockerExecutor.createContainer(session.language, sessionId);
    } catch (error) {
      console.warn(`Failed to reset container for session ${sessionId}:`, error);
    }
  }

  /**
   * Delete session
   */
  async deleteSession(sessionId: string): Promise<void> {
    if (!isValidId(sessionId)) {
      return; // Handle gracefully, don't throw for invalid IDs
    }

    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.delete(sessionId);

      // Clean up Docker container
      try {
        const containers = await this.dockerExecutor.listContainers();
        for (const containerId of containers) {
          await this.dockerExecutor.destroyContainer(containerId);
        }
      } catch (error) {
        console.warn(`Failed to cleanup container for session ${sessionId}:`, error);
      }
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.sessions.entries()) {
      if (isExpired(session.lastActivity, REPL_CONFIG.SESSION_TIMEOUT)) {
        expiredSessions.push(sessionId);
      }
    }

    // Clean up expired sessions
    for (const sessionId of expiredSessions) {
      try {
        await this.deleteSession(sessionId);
      } catch (error) {
        console.warn(`Failed to cleanup expired session ${sessionId}:`, error);
      }
    }

    // Also cleanup Docker containers
    try {
      await this.dockerExecutor.cleanupContainers();
    } catch (error) {
      console.warn('Failed to cleanup Docker containers:', error);
    }

    if (expiredSessions.length > 0) {
      console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
    }
  }

  /**
   * Get session statistics
   */
  getSessionStats() {
    const sessions = Array.from(this.sessions.values());
    const now = Date.now();

    return {
      totalSessions: sessions.length,
      activeSessions: sessions.filter(s =>
        !isExpired(s.lastActivity, REPL_CONFIG.SESSION_TIMEOUT)
      ).length,
      languageBreakdown: sessions.reduce((acc, session) => {
        acc[session.language] = (acc[session.language] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageAge: sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (now - s.createdAt.getTime()), 0) / sessions.length
        : 0,
      totalExecutions: sessions.reduce((sum, s) => sum + s.executionHistory.length, 0)
    };
  }
}
