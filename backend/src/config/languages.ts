/**
 * Supported programming languages configuration
 */

import { Language } from '../types/content';

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

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0]; // Python

export const getLanguageById = (id: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.id === id);
};

export const isLanguageSupported = (id: string): boolean => {
  return SUPPORTED_LANGUAGES.some(lang => lang.id === id);
};
