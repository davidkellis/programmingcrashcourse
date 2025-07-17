/**
 * Application constants and configuration
 */

export const REPL_CONFIG = {
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  MAX_MEMORY: '128m',
  MAX_CPU: 0.5,
  SESSION_TIMEOUT: 3600000, // 1 hour
  MAX_HISTORY_SIZE: 100,
  MAX_OUTPUT_SIZE: 10000, // 10KB
} as const;

export const CONTENT_CONFIG = {
  BOOK_PATH: './Book',
  CACHE_TTL: 300000, // 5 minutes
  MAX_SECTION_SIZE: 100000, // 100KB
} as const;

export const DOCKER_CONFIG = {
  NETWORK_MODE: 'none',
  READ_ONLY: true,
  NO_NEW_PRIVILEGES: true,
  TMPFS: ['/tmp'],
  WORKING_DIR: '/workspace',
} as const;

export const API_CONFIG = {
  RATE_LIMIT: {
    WINDOW_MS: 60000, // 1 minute
    MAX_REQUESTS: 100,
  },
  CORS: {
    ORIGIN: process.env.NODE_ENV === 'production'
      ? ['https://your-domain.com']
      : ['http://localhost:5173'],
    CREDENTIALS: true,
  },
} as const;

export const ERROR_MESSAGES = {
  INVALID_SESSION: 'Invalid or expired session',
  LANGUAGE_NOT_SUPPORTED: 'Programming language not supported',
  CODE_EXECUTION_FAILED: 'Code execution failed',
  CONTENT_NOT_FOUND: 'Tutorial content not found',
  TRANSLATION_FAILED: 'Code translation failed',
  SESSION_TIMEOUT: 'Session has timed out',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
} as const;
