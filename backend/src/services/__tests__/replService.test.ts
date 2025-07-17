/**
 * Unit tests for REPL service
 */

import { REPLService } from '../replService';
import { DockerExecutor } from '../dockerExecutor';
import { REPLError, SessionError } from '../../types/services';
import { ExecutionResult } from '../../types/repl';

// Mock the DockerExecutor
jest.mock('../dockerExecutor');
const MockedDockerExecutor = DockerExecutor as jest.MockedClass<typeof DockerExecutor>;

describe('REPLService', () => {
  let replService: REPLService;
  let mockDockerExecutor: jest.Mocked<DockerExecutor>;

  const mockExecutionResult: ExecutionResult = {
    output: 'Hello, World!',
    variables: { x: 42 },
    executionTime: 150,
    timestamp: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockDockerExecutor = {
      executeInContainer: jest.fn(),
      createContainer: jest.fn(),
      destroyContainer: jest.fn(),
      listContainers: jest.fn(),
      cleanupContainers: jest.fn(),
    } as any;

    MockedDockerExecutor.mockImplementation(() => mockDockerExecutor);
    replService = new REPLService();
  });

  describe('createSession', () => {
    it('should create a new session for supported language', async () => {
      mockDockerExecutor.createContainer.mockResolvedValue('container-123');

      const sessionId = await replService.createSession('python');

      expect(sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(mockDockerExecutor.createContainer).toHaveBeenCalledWith('python', sessionId);
    });

    it('should throw error for unsupported language', async () => {
      await expect(replService.createSession('unsupported'))
        .rejects.toThrow(REPLError);

      expect(mockDockerExecutor.createContainer).not.toHaveBeenCalled();
    });

    it('should cleanup session if container creation fails', async () => {
      mockDockerExecutor.createContainer.mockRejectedValue(new Error('Container failed'));

      await expect(replService.createSession('python'))
        .rejects.toThrow(REPLError);
    });
  });

  describe('executeCode', () => {
    let sessionId: string;

    beforeEach(async () => {
      mockDockerExecutor.createContainer.mockResolvedValue('container-123');
      sessionId = await replService.createSession('python');
    });

    it('should execute code successfully', async () => {
      mockDockerExecutor.executeInContainer.mockResolvedValue(mockExecutionResult);

      const result = await replService.executeCode(sessionId, 'print("Hello")', 'python');

      expect(result).toEqual(mockExecutionResult);
      expect(mockDockerExecutor.executeInContainer).toHaveBeenCalledWith(
        'python',
        'print("Hello")',
        sessionId,
        30000 // default timeout
      );
    });

    it('should update session state after execution', async () => {
      mockDockerExecutor.executeInContainer.mockResolvedValue(mockExecutionResult);

      await replService.executeCode(sessionId, 'x = 42', 'python');
      const sessionState = await replService.getSessionState(sessionId);

      expect(sessionState.executionHistory).toHaveLength(1);
      expect(sessionState.executionHistory[0].input).toBe('x = 42');
      expect(sessionState.variables).toEqual({ x: 42 });
    });

    it('should throw error for invalid session ID', async () => {
      await expect(replService.executeCode('invalid', 'print("test")', 'python'))
        .rejects.toThrow(SessionError);
    });

    it('should throw error for non-existent session', async () => {
      await expect(replService.executeCode('session_123_nonexistent', 'print("test")', 'python'))
        .rejects.toThrow(SessionError);
    });

    it('should throw error for unsupported language', async () => {
      await expect(replService.executeCode(sessionId, 'print("test")', 'unsupported'))
        .rejects.toThrow(REPLError);
    });

    it('should handle execution errors gracefully', async () => {
      mockDockerExecutor.executeInContainer.mockRejectedValue(new Error('Execution failed'));

      await expect(replService.executeCode(sessionId, 'invalid code', 'python'))
        .rejects.toThrow(REPLError);
    });

    it('should limit execution history size', async () => {
      mockDockerExecutor.executeInContainer.mockResolvedValue(mockExecutionResult);

      // Execute more than MAX_HISTORY_SIZE (100) commands
      for (let i = 0; i < 105; i++) {
        await replService.executeCode(sessionId, `print(${i})`, 'python');
      }

      const sessionState = await replService.getSessionState(sessionId);
      expect(sessionState.executionHistory.length).toBe(100);
    });
  });

  describe('getSessionState', () => {
    let sessionId: string;

    beforeEach(async () => {
      mockDockerExecutor.createContainer.mockResolvedValue('container-123');
      sessionId = await replService.createSession('python');
    });

    it('should return session state', async () => {
      const sessionState = await replService.getSessionState(sessionId);

      expect(sessionState.language).toBe('python');
      expect(sessionState.variables).toEqual({});
      expect(sessionState.executionHistory).toEqual([]);
      expect(sessionState.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error for invalid session ID', async () => {
      await expect(replService.getSessionState('invalid'))
        .rejects.toThrow(SessionError);
    });

    it('should throw error for non-existent session', async () => {
      await expect(replService.getSessionState('session_123_nonexistent'))
        .rejects.toThrow(SessionError);
    });

    it('should update last activity when accessed', async () => {
      const initialState = await replService.getSessionState(sessionId);

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 10));

      const updatedState = await replService.getSessionState(sessionId);
      expect(updatedState.lastActivity.getTime()).toBeGreaterThan(initialState.lastActivity.getTime());
    });
  });

  describe('resetSession', () => {
    let sessionId: string;

    beforeEach(async () => {
      mockDockerExecutor.createContainer.mockResolvedValue('container-123');
      mockDockerExecutor.executeInContainer.mockResolvedValue(mockExecutionResult);
      sessionId = await replService.createSession('python');

      // Add some state to reset
      await replService.executeCode(sessionId, 'x = 42', 'python');
    });

    it('should reset session state', async () => {
      mockDockerExecutor.listContainers.mockResolvedValue(['container-123']);
      mockDockerExecutor.destroyContainer.mockResolvedValue();
      mockDockerExecutor.createContainer.mockResolvedValue('container-456');

      await replService.resetSession(sessionId);
      const sessionState = await replService.getSessionState(sessionId);

      expect(sessionState.variables).toEqual({});
      expect(sessionState.executionHistory).toEqual([]);
      expect(sessionState.language).toBe('python');
    });

    it('should throw error for invalid session ID', async () => {
      await expect(replService.resetSession('invalid'))
        .rejects.toThrow(SessionError);
    });

    it('should throw error for non-existent session', async () => {
      await expect(replService.resetSession('session_123_nonexistent'))
        .rejects.toThrow(SessionError);
    });
  });

  describe('deleteSession', () => {
    let sessionId: string;

    beforeEach(async () => {
      mockDockerExecutor.createContainer.mockResolvedValue('container-123');
      sessionId = await replService.createSession('python');
    });

    it('should delete session and cleanup container', async () => {
      mockDockerExecutor.listContainers.mockResolvedValue(['container-123']);
      mockDockerExecutor.destroyContainer.mockResolvedValue();

      await replService.deleteSession(sessionId);

      await expect(replService.getSessionState(sessionId))
        .rejects.toThrow(SessionError);
    });

    it('should handle invalid session ID gracefully', async () => {
      // Should not throw error for invalid session ID
      await expect(replService.deleteSession('invalid')).resolves.toBeUndefined();
    });

    it('should handle container cleanup errors gracefully', async () => {
      mockDockerExecutor.listContainers.mockResolvedValue(['container-123']);
      mockDockerExecutor.destroyContainer.mockRejectedValue(new Error('Cleanup failed'));

      // Should not throw error even if container cleanup fails
      await replService.deleteSession(sessionId);
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should clean up expired sessions', async () => {
      mockDockerExecutor.createContainer.mockResolvedValue('container-123');
      mockDockerExecutor.listContainers.mockResolvedValue(['container-123']);
      mockDockerExecutor.destroyContainer.mockResolvedValue();
      mockDockerExecutor.cleanupContainers.mockResolvedValue();

      // Create a session
      const sessionId = await replService.createSession('python');

      // Manually expire the session by accessing the private sessions map
      const sessions = (replService as any).sessions;
      const session = sessions.get(sessionId);
      if (session) {
        session.lastActivity = new Date(Date.now() - 7200000); // 2 hours ago
        sessions.set(sessionId, session);
      }

      await replService.cleanupExpiredSessions();

      // Session should be cleaned up
      await expect(replService.getSessionState(sessionId))
        .rejects.toThrow(SessionError);
    });
  });

  describe('getSessionStats', () => {
    it('should return session statistics', async () => {
      mockDockerExecutor.createContainer.mockResolvedValue('container-123');

      // Create a few sessions
      await replService.createSession('python');
      await replService.createSession('javascript');

      const stats = replService.getSessionStats();

      expect(stats.totalSessions).toBe(2);
      expect(stats.activeSessions).toBe(2);
      expect(stats.languageBreakdown).toEqual({
        python: 1,
        javascript: 1
      });
      expect(stats.totalExecutions).toBe(0);
    });

    it('should return zero stats when no sessions exist', () => {
      const stats = replService.getSessionStats();

      expect(stats.totalSessions).toBe(0);
      expect(stats.activeSessions).toBe(0);
      expect(stats.languageBreakdown).toEqual({});
      expect(stats.averageAge).toBe(0);
      expect(stats.totalExecutions).toBe(0);
    });
  });
});
