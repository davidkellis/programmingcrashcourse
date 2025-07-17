/**
 * Unit tests for REPL data models and validation
 */

import {
  ExecutionResult,
  SessionState,
  UserSession,
  validateExecutionResult,
  validateSessionState,
  validateUserSession
} from '../repl';

describe('REPL Data Models', () => {
  describe('validateExecutionResult', () => {
    it('should validate a correct ExecutionResult object', () => {
      const validResult: ExecutionResult = {
        output: 'Hello, World!',
        variables: { x: 42 },
        executionTime: 150,
        timestamp: new Date()
      };

      expect(validateExecutionResult(validResult)).toBe(true);
    });

    it('should validate ExecutionResult with error', () => {
      const resultWithError: ExecutionResult = {
        output: '',
        error: 'NameError: name "x" is not defined',
        variables: {},
        executionTime: 50,
        timestamp: new Date()
      };

      expect(validateExecutionResult(resultWithError)).toBe(true);
    });

    it('should reject invalid ExecutionResult objects', () => {
      const invalidResult = {
        output: 'Hello',
        // missing required fields
      };

      expect(validateExecutionResult(invalidResult)).toBe(false);
    });

    it('should reject ExecutionResult with invalid timestamp', () => {
      const invalidResult = {
        output: 'Hello',
        variables: {},
        executionTime: 100,
        timestamp: 'not a date'
      };

      expect(validateExecutionResult(invalidResult)).toBe(false);
    });
  });

  describe('validateSessionState', () => {
    it('should validate a correct SessionState object', () => {
      const validState: SessionState = {
        variables: { x: 42, name: 'Alice' },
        functions: { greet: 'function definition' },
        imports: ['math', 'random'],
        executionHistory: [],
        language: 'python',
        createdAt: new Date(),
        lastActivity: new Date()
      };

      expect(validateSessionState(validState)).toBe(true);
    });

    it('should reject invalid SessionState objects', () => {
      const invalidState = {
        variables: {},
        functions: {},
        // missing required fields
      };

      expect(validateSessionState(invalidState)).toBe(false);
    });

    it('should reject SessionState with invalid arrays', () => {
      const invalidState = {
        variables: {},
        functions: {},
        imports: 'not an array',
        executionHistory: [],
        language: 'python',
        createdAt: new Date(),
        lastActivity: new Date()
      };

      expect(validateSessionState(invalidState)).toBe(false);
    });
  });

  describe('validateUserSession', () => {
    it('should validate a correct UserSession object', () => {
      const validSession: UserSession = {
        id: 'session-123',
        selectedLanguage: 'python',
        currentSection: 'section-1',
        replState: {
          variables: {},
          functions: {},
          imports: [],
          executionHistory: [],
          language: 'python',
          createdAt: new Date(),
          lastActivity: new Date()
        },
        progress: {
          completedSections: [],
          currentSection: 'section-1',
          totalSections: 10,
          startedAt: new Date(),
          lastUpdated: new Date()
        },
        createdAt: new Date(),
        lastActivity: new Date()
      };

      expect(validateUserSession(validSession)).toBe(true);
    });

    it('should reject invalid UserSession objects', () => {
      const invalidSession = {
        id: 'session-123',
        selectedLanguage: 'python',
        // missing required fields
      };

      expect(validateUserSession(invalidSession)).toBe(false);
    });

    it('should reject UserSession with invalid replState', () => {
      const invalidSession = {
        id: 'session-123',
        selectedLanguage: 'python',
        currentSection: 'section-1',
        replState: 'not a valid state',
        progress: {
          completedSections: [],
          currentSection: 'section-1',
          totalSections: 10,
          startedAt: new Date(),
          lastUpdated: new Date()
        },
        createdAt: new Date(),
        lastActivity: new Date()
      };

      expect(validateUserSession(invalidSession)).toBe(false);
    });
  });
});
