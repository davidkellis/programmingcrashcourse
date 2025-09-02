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

// Group of code snippets that can be run sequentially
export interface CodeSnippetGroup {
  id: string;
  title: string;
  description?: string;
  // If true, keep group collapsed initially
  collapsedByDefault?: boolean;
  // If true, keep running snippets even if one fails (default: false)
  continueOnError?: boolean;
  snippets: CodeSnippet[];
}

export interface TutorialSection {
  id: string;
  title: string;
  content: string;
  // Legacy field - will be removed once inline snippet parsing is implemented
  codeSnippets: CodeSnippet[];
  // Optional mixed items: individual snippets and/or groups. If present, UI should prefer this over codeSnippets.
  codeItems?: Array<CodeSnippet | CodeSnippetGroup>;
  nextSection?: string;
  previousSection?: string;
  order: number;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  variables: Record<string, unknown>;
  executionTime: number;
  timestamp: Date;
}

export interface ExecutionRecord {
  id: string;
  timestamp: Date;
  input: string;
  inputLines?: Array<{ prompt: string; text: string }>;
  output: string;
  error?: string;
  executionTime: number;
}

export interface SessionState {
  variables: Record<string, unknown>;
  functions: Record<string, unknown>;
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
  variables: Record<string, unknown>;
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
  onExecute: (code: string) => Promise<unknown>;
  history: ExecutionRecord[];
  isExecuting?: boolean;
}

export interface TutorialContentProps {
  section: TutorialSection;
  language: Language;
  onCodeExecute: (code: string) => Promise<void>;
  onNavigate: (sectionId: string) => void;
}
