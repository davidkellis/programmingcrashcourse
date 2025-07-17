/**
 * Service interface definitions
 */

import { Language, TutorialSection, CodeSnippet } from './content';
import { ExecutionResult, SessionState, UserSession } from './repl';

export interface ContentService {
  getSection(sectionId: string, language: string): Promise<TutorialSection>;
  getAllSections(language: string): Promise<TutorialSection[]>;
  getCodeSnippets(sectionId: string, language: string): Promise<CodeSnippet[]>;
  getSupportedLanguages(): Promise<Language[]>;
  refreshContent(): Promise<void>;
}

export interface TranslationService {
  translateCode(code: string, fromLang: string, toLang: string): Promise<string>;
  translateSnippet(snippet: CodeSnippet, toLang: string): Promise<CodeSnippet>;
  getSupportedLanguages(): Language[];
  isTranslationSupported(fromLang: string, toLang: string): boolean;
}

export interface REPLService {
  executeCode(sessionId: string, code: string, language: string): Promise<ExecutionResult>;
  createSession(language: string, userId?: string): Promise<string>;
  getSessionState(sessionId: string): Promise<SessionState>;
  resetSession(sessionId: string): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
  cleanupExpiredSessions(): Promise<void>;
}

export interface SessionManager {
  createUserSession(language: string, userId?: string): Promise<UserSession>;
  getUserSession(sessionId: string): Promise<UserSession | null>;
  updateUserSession(sessionId: string, updates: Partial<UserSession>): Promise<UserSession>;
  deleteUserSession(sessionId: string): Promise<void>;
  updateProgress(sessionId: string, sectionId: string): Promise<void>;
}

export interface DockerExecutor {
  executeInContainer(
    language: string,
    code: string,
    sessionId: string,
    timeout?: number
  ): Promise<ExecutionResult>;
  createContainer(language: string, sessionId: string): Promise<string>;
  destroyContainer(containerId: string): Promise<void>;
  listContainers(): Promise<string[]>;
  cleanupContainers(): Promise<void>;
}

// Error types
export class ContentError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ContentError';
  }
}

export class TranslationError extends Error {
  constructor(message: string, public fromLang: string, public toLang: string) {
    super(message);
    this.name = 'TranslationError';
  }
}

export class REPLError extends Error {
  constructor(message: string, public sessionId: string, public code?: string) {
    super(message);
    this.name = 'REPLError';
  }
}

export class SessionError extends Error {
  constructor(message: string, public sessionId: string) {
    super(message);
    this.name = 'SessionError';
  }
}
