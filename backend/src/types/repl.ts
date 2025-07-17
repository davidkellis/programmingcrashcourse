/**
 * Core data models for REPL execution and session management
 */

export interface ExecutionResult {
  output: string;
  error?: string;
  variables: Record<string, any>;
  executionTime: number;
  timestamp: Date;
}

export interface ExecutionRecord {
  id: string;
  timestamp: Date;
  input: string;
  output: string;
  error?: string;
  executionTime: number;
}

export interface SessionState {
  variables: Record<string, any>;
  functions: Record<string, any>;
  imports: string[];
  executionHistory: ExecutionRecord[];
  language: string;
  createdAt: Date;
  lastActivity: Date;
}

export interface UserSession {
  id: string;
  selectedLanguage: string;
  currentSection: string;
  replState: SessionState;
  progress: ProgressTracker;
  createdAt: Date;
  lastActivity: Date;
}

export interface ProgressTracker {
  completedSections: string[];
  currentSection: string;
  totalSections: number;
  startedAt: Date;
  lastUpdated: Date;
}

export interface REPLExecutionRequest {
  sessionId: string;
  code: string;
  language: string;
}

export interface REPLSessionRequest {
  language: string;
  userId?: string;
}

// Validation functions
export const validateExecutionResult = (result: any): result is ExecutionResult => {
  return (
    typeof result === 'object' &&
    typeof result.output === 'string' &&
    typeof result.variables === 'object' &&
    typeof result.executionTime === 'number' &&
    result.timestamp instanceof Date
  );
};

export const validateSessionState = (state: any): state is SessionState => {
  return (
    typeof state === 'object' &&
    typeof state.variables === 'object' &&
    typeof state.functions === 'object' &&
    Array.isArray(state.imports) &&
    Array.isArray(state.executionHistory) &&
    typeof state.language === 'string' &&
    state.createdAt instanceof Date &&
    state.lastActivity instanceof Date
  );
};

export const validateUserSession = (session: any): session is UserSession => {
  return (
    typeof session === 'object' &&
    typeof session.id === 'string' &&
    typeof session.selectedLanguage === 'string' &&
    typeof session.currentSection === 'string' &&
    validateSessionState(session.replState) &&
    session.createdAt instanceof Date &&
    session.lastActivity instanceof Date
  );
};
