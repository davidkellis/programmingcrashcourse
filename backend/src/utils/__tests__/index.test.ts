/**
 * Unit tests for utility functions
 */

import {
  generateId,
  generateSessionId,
  isValidId,
  sanitizeCode,
  truncateOutput,
  formatExecutionTime,
  isExpired
} from '../index';

describe('Utility Functions', () => {
  describe('generateId', () => {
    it('should generate a valid UUID', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBe(36);
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateSessionId', () => {
    it('should generate a session ID with correct format', () => {
      const sessionId = generateSessionId();
      expect(typeof sessionId).toBe('string');
      expect(sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
    });

    it('should generate unique session IDs', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('isValidId', () => {
    it('should return true for valid IDs', () => {
      expect(isValidId('valid-id')).toBe(true);
      expect(isValidId('123')).toBe(true);
      expect(isValidId('session_123_abc')).toBe(true);
    });

    it('should return false for invalid IDs', () => {
      expect(isValidId('')).toBe(false);
      expect(isValidId(null as any)).toBe(false);
      expect(isValidId(undefined as any)).toBe(false);
      expect(isValidId(123 as any)).toBe(false);
    });
  });

  describe('sanitizeCode', () => {
    it('should block dangerous imports', () => {
      const code = 'import os\nprint("hello")';
      const sanitized = sanitizeCode(code);
      expect(sanitized).toContain('# import os blocked');
      expect(sanitized).toContain('print("hello")');
    });

    it('should block exec and eval calls', () => {
      const code = 'exec("print(1)")\neval("2+2")';
      const sanitized = sanitizeCode(code);
      expect(sanitized).toContain('# exec() blocked');
      expect(sanitized).toContain('# eval() blocked');
    });

    it('should trim whitespace', () => {
      const code = '  print("hello")  \n  ';
      const sanitized = sanitizeCode(code);
      expect(sanitized).toBe('print("hello")');
    });
  });

  describe('truncateOutput', () => {
    it('should not truncate short output', () => {
      const output = 'Hello, World!';
      const truncated = truncateOutput(output, 100);
      expect(truncated).toBe(output);
    });

    it('should truncate long output', () => {
      const output = 'A'.repeat(1000);
      const truncated = truncateOutput(output, 100);
      expect(truncated.length).toBeLessThan(output.length);
      expect(truncated).toContain('... [output truncated]');
    });
  });

  describe('formatExecutionTime', () => {
    it('should format milliseconds correctly', () => {
      expect(formatExecutionTime(500)).toBe('500ms');
      expect(formatExecutionTime(999)).toBe('999ms');
    });

    it('should format seconds correctly', () => {
      expect(formatExecutionTime(1000)).toBe('1.00s');
      expect(formatExecutionTime(1500)).toBe('1.50s');
      expect(formatExecutionTime(2345)).toBe('2.35s');
    });
  });

  describe('isExpired', () => {
    it('should return false for recent timestamps', () => {
      const recent = new Date();
      expect(isExpired(recent, 60000)).toBe(false);
    });

    it('should return true for old timestamps', () => {
      const old = new Date(Date.now() - 120000); // 2 minutes ago
      expect(isExpired(old, 60000)).toBe(true); // 1 minute timeout
    });
  });
});
