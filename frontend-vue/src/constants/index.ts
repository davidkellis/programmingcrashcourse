/**
 * Frontend constants and configuration
 */

import type { Language } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: 'python',
    name: 'Python',
    fileExtension: '.py',
    replCommand: 'python3',
    syntaxHighlighting: 'python',
    dockerImage: 'python:3.11-slim'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    fileExtension: '.js',
    replCommand: 'node',
    syntaxHighlighting: 'javascript',
    dockerImage: 'node:18-slim'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    fileExtension: '.ts',
    replCommand: 'tsx',
    syntaxHighlighting: 'typescript',
    dockerImage: 'node:18-slim'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    fileExtension: '.rb',
    replCommand: 'ruby',
    syntaxHighlighting: 'ruby',
    dockerImage: 'ruby:3.2-slim'
  }
];

export const DEFAULT_LANGUAGE_ID = 'python' as const
const _DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.find(l => l.id === DEFAULT_LANGUAGE_ID) ?? SUPPORTED_LANGUAGES[0]!
export const DEFAULT_LANGUAGE: Language = _DEFAULT_LANGUAGE

export const UI_CONFIG = {
  REPL_HEIGHT_PERCENTAGE: 25, // Bottom quarter of screen
  MAX_EXECUTION_TIME_DISPLAY: 30000, // 30 seconds
  DEBOUNCE_DELAY: 300, // For search/input debouncing
  TOAST_DURATION: 5000, // Error/success message duration
} as const;

export const STORAGE_KEYS = {
  SELECTED_LANGUAGE: 'tutorial_selected_language',
  CURRENT_SECTION: 'tutorial_current_section',
  USER_PROGRESS: 'tutorial_user_progress',
  SESSION_ID: 'tutorial_session_id',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SESSION_EXPIRED: 'Your session has expired. Please refresh the page.',
  CODE_EXECUTION_FAILED: 'Failed to execute code. Please try again.',
  CONTENT_LOAD_FAILED: 'Failed to load tutorial content.',
  LANGUAGE_NOT_SUPPORTED: 'Selected programming language is not supported.',
} as const;

export const getLanguageById = (id: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.id === id);
};

export const isLanguageSupported = (id: string): boolean => {
  return SUPPORTED_LANGUAGES.some(lang => lang.id === id);
};
