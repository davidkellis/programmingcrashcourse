/**
 * Frontend type definitions - mirrors backend types
 */

export interface Language {
  id: string;
  name: string;
  fileExtension: string;
  replCommand: string;
  syntaxHighlighting: string;
  dockerImage: string;
}

export interface CodeSnippet {
  id: string;
  code: string;
  language: string;
  isExecutable: boolean;
  context: string;
  explanation?: string;
  lineStart?: number;
  lineEnd?: number;
}

export interface TutorialSection {
  id: string;
  title: string;
  content: string;
  codeSnippets: CodeSnippet[];
  nextSection?: string;
  previousSection?: string;
  order: number;
}

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

// API request/response types
export interface REPLExecutionRequest {
  sessionId: string;
  code: string;
  language: string;
}

export interface REPLSessionRequest {
  language: string;
  userId?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// UI-specific types
export interface UIState {
  selectedLanguage: Language | null;
  currentSection: TutorialSection | null;
  isREPLVisible: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface REPLState {
  sessionId: string | null;
  isExecuting: boolean;
  history: ExecutionRecord[];
  currentInput: string;
  variables: Record<string, any>;
}

// Component prop types
export interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language | null;
  onLanguageChange: (language: Language) => void;
  disabled?: boolean;
}

export interface CodeSnippetProps {
  snippet: CodeSnippet;
  language: Language;
  onExecute: (code: string) => void;
  isExecuting?: boolean;
}

export interface REPLProps {
  sessionId: string | null;
  language: Language | null;
  onExecute: (code: string) => Promise<any>;
  history: ExecutionRecord[];
  isExecuting?: boolean;
}

export interface TutorialContentProps {
  section: TutorialSection;
  language: Language;
  onCodeExecute: (code: string) => Promise<void>;
  onNavigate: (sectionId: string) => void;
}
