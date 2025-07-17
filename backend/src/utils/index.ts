/**
 * Common utility functions
 */

import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => {
  return uuidv4();
};

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isValidId = (id: string): boolean => {
  return typeof id === 'string' && id.length > 0;
};

export const sanitizeCode = (code: string): string => {
  // Basic sanitization - remove potentially dangerous patterns
  return code
    .replace(/import\s+os/gi, '# import os blocked')
    .replace(/import\s+subprocess/gi, '# import subprocess blocked')
    .replace(/exec\s*\(/gi, '# exec() blocked')
    .replace(/eval\s*\(/gi, '# eval() blocked')
    .trim();
};

export const truncateOutput = (output: string, maxLength: number = 10000): string => {
  if (output.length <= maxLength) {
    return output;
  }
  return output.substring(0, maxLength) + '\n... [output truncated]';
};

export const formatExecutionTime = (timeMs: number): string => {
  if (timeMs < 1000) {
    return `${timeMs}ms`;
  }
  return `${(timeMs / 1000).toFixed(2)}s`;
};

export const isExpired = (timestamp: Date, timeoutMs: number): boolean => {
  return Date.now() - timestamp.getTime() > timeoutMs;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
