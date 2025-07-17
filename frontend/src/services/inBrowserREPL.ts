/**
 * In-Browser REPL Service
 * Provides client-side code execution for multiple programming languages
 */

import type { ExecutionResult, Language } from '../types';

// Language runtime interfaces
interface PyodideRuntime {
  runPython: (code: string) => any;
  globals: any;
  loadPackage?: (packages: string[]) => Promise<void>;
}

interface RubyRuntime {
  eval: (code: string) => any;
  vm: any;
}

// Runtime state management
interface RuntimeState {
  variables: Record<string, any>;
  functions: Record<string, any>;
  imports: string[];
  initialized: boolean;
  sessionId: string;
  createdAt: Date;
  lastActivity: Date;
  executionCount: number;
}

class InBrowserREPLService {
  private pyodideRuntime: PyodideRuntime | null = null;
  private rubyRuntime: RubyRuntime | null = null;
  private runtimeStates: Map<string, RuntimeState> = new Map();
  private initializationPromises: Map<string, Promise<void>> = new Map();

  /**
   * Initialize runtime for a specific language
   */
  async initializeRuntime(language: Language): Promise<void> {
    const langId = language.id;

    // Return existing initialization promise if already in progress
    if (this.initializationPromises.has(langId)) {
      return this.initializationPromises.get(langId)!;
    }

    const initPromise = this._initializeRuntimeInternal(language);
    this.initializationPromises.set(langId, initPromise);

    try {
      await initPromise;
    } finally {
      this.initializationPromises.delete(langId);
    }
  }

  private async _initializeRuntimeInternal(language: Language): Promise<void> {
    const langId = language.id;

    // Initialize runtime state
    if (!this.runtimeStates.has(langId)) {
      this.runtimeStates.set(langId, {
        variables: {},
        functions: {},
        imports: [],
        initialized: false,
        sessionId: `${langId}_${Date.now()}`,
        createdAt: new Date(),
        lastActivity: new Date(),
        executionCount: 0
      });
    }

    const state = this.runtimeStates.get(langId)!;
    if (state.initialized) {
      return;
    }

    try {
      switch (langId) {
        case 'python':
          await this.initializePython();
          break;
        case 'javascript':
          await this.initializeJavaScript();
          break;
        case 'typescript':
          await this.initializeTypeScript();
          break;
        case 'ruby':
          await this.initializeRuby();
          break;
        default:
          throw new Error(`Unsupported language: ${langId}`);
      }

      state.initialized = true;
    } catch (error) {
      console.error(`Failed to initialize ${langId} runtime:`, error);
      throw error;
    }
  }

  private async initializePython(): Promise<void> {
    if (this.pyodideRuntime) return;

    try {
      // Check if Pyodide is available
      if (typeof (window as any).loadPyodide !== 'function') {
        throw new Error('Pyodide is not loaded. Make sure the Pyodide script is included in your HTML.');
      }

      // Load Pyodide
      const pyodide = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.28.0/full/'
      });

      this.pyodideRuntime = pyodide;

      // Install common packages (optional - skip if fails)
      try {
        await pyodide.loadPackage(['numpy']);
        console.log('Python runtime initialized with numpy');
      } catch (packageError) {
        console.warn('Failed to load Python packages, but runtime is available:', packageError);
        console.log('Python runtime initialized (basic)');
      }
    } catch (error) {
      console.error('Failed to initialize Python runtime:', error);
      throw error;
    }
  }

  private async initializeJavaScript(): Promise<void> {
    // JavaScript is natively supported - no initialization needed
    console.log('JavaScript runtime initialized');
  }

  private async initializeTypeScript(): Promise<void> {
    // For now, we'll compile TypeScript to JavaScript and execute
    // In the future, we could add TypeScript compiler support
    console.log('TypeScript runtime initialized (using JavaScript execution)');
  }

  private async initializeRuby(): Promise<void> {
    if (this.rubyRuntime) return;

    try {
      // For now, let's skip Ruby initialization to avoid blocking other languages
      // Ruby WASM can be complex to set up and might cause issues
      console.warn('Ruby runtime initialization skipped - not yet fully supported');

      // Create a mock runtime that shows a helpful message
      this.rubyRuntime = {
        eval: (_code: string) => {
          throw new Error('Ruby execution is not yet fully supported. Please try Python or JavaScript instead.');
        },
        vm: null
      };

      console.log('Ruby runtime initialized (mock)');
    } catch (error) {
      console.error('Failed to initialize Ruby runtime:', error);
      throw error;
    }
  }

  /**
   * Execute code in the specified language with timeout and safety limits
   */
  async executeCode(code: string, language: Language, timeoutMs: number = 10000): Promise<ExecutionResult> {
    const startTime = performance.now();

    try {
      // Ensure runtime is initialized
      await this.initializeRuntime(language);

      // Create execution promise with timeout
      const executionPromise = this.executeCodeInternal(code, language);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Code execution timed out')), timeoutMs);
      });

      let result: any;
      let output = '';
      let error: string | undefined;

      // Race between execution and timeout
      result = await Promise.race([executionPromise, timeoutPromise]);

      // Handle result formatting
      if (result !== undefined && result !== null) {
        output = this.formatOutput(result, language.id);
      }

      const executionTime = performance.now() - startTime;
      const state = this.runtimeStates.get(language.id)!;

      // Update session activity tracking
      state.lastActivity = new Date();
      state.executionCount++;

      return {
        output,
        error,
        variables: { ...state.variables },
        executionTime,
        timestamp: new Date()
      };

    } catch (err) {
      const executionTime = performance.now() - startTime;
      const errorMessage = this.formatError(err, language.id);

      return {
        output: '',
        error: errorMessage,
        variables: {},
        executionTime,
        timestamp: new Date()
      };
    }
  }

  private async executeCodeInternal(code: string, language: Language): Promise<any> {
    switch (language.id) {
      case 'python':
        return await this.executePython(code);
      case 'javascript':
        return await this.executeJavaScript(code);
      case 'typescript':
        return await this.executeTypeScript(code);
      case 'ruby':
        return await this.executeRuby(code);
      default:
        throw new Error(`Execution not supported for language: ${language.id}`);
    }
  }

  private async executePython(code: string): Promise<any> {
    if (!this.pyodideRuntime) {
      throw new Error('Python runtime not initialized');
    }

    try {
      // Capture stdout
      this.pyodideRuntime.runPython(`
import sys
from io import StringIO
_stdout = sys.stdout
sys.stdout = StringIO()
      `);

      // Execute the code
      const result = this.pyodideRuntime.runPython(code);

      // Get captured output
      const output = this.pyodideRuntime.runPython(`
_captured = sys.stdout.getvalue()
sys.stdout = _stdout
_captured
      `);

      // Update variables state
      const state = this.runtimeStates.get('python')!;
      const globals = this.pyodideRuntime.globals.toJs();
      state.variables = Object.fromEntries(
        Object.entries(globals).filter(([key]) =>
          !key.startsWith('_') && !['sys', 'builtins'].includes(key)
        )
      );

      return output || result;
    } catch (error) {
      throw error;
    }
  }

  private async executeJavaScript(code: string): Promise<any> {
    try {
      // Create a safe execution context
      const state = this.runtimeStates.get('javascript')!;

      // Create function with access to previous variables
      const func = new Function(...Object.keys(state.variables), `
        ${code}
      `);

      const result = func(...Object.values(state.variables));

      // For now, we can't easily capture variable changes in JavaScript
      // This would require more sophisticated parsing

      return result;
    } catch (error) {
      throw error;
    }
  }

  private async executeTypeScript(code: string): Promise<any> {
    // For now, execute as JavaScript
    // TODO: Add TypeScript compilation
    return this.executeJavaScript(code);
  }

  private async executeRuby(code: string): Promise<any> {
    if (!this.rubyRuntime) {
      throw new Error('Ruby runtime not initialized');
    }

    try {
      const result = this.rubyRuntime.eval(code);

      // Update variables state (simplified)
      // Ruby variable extraction would need more sophisticated implementation

      return result;
    } catch (error) {
      throw error;
    }
  }

  private formatOutput(result: any, language: string): string {
    if (result === undefined) return '';
    if (result === null) return 'null';

    switch (language) {
      case 'python':
        return String(result);
      case 'javascript':
      case 'typescript':
        return typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
      case 'ruby':
        return String(result);
      default:
        return String(result);
    }
  }

  private formatError(error: unknown, _language: string): string {
    const errorMessage = (error as Error)?.message || String(error);

    // Transform technical errors into educational feedback
    const educationalErrors: Record<string, string> = {
      'NameError': "This variable hasn't been defined yet. Make sure to create it first!",
      'SyntaxError': "There's a syntax error in your code. Check for missing punctuation or typos.",
      'TypeError': "There's a type mismatch. Make sure you're using the right data types.",
      'ReferenceError': "This variable or function hasn't been defined yet.",
      'undefined': "Something went wrong with your code. Try checking for typos or syntax errors."
    };

    // Check for common error patterns
    for (const [pattern, explanation] of Object.entries(educationalErrors)) {
      if (errorMessage.includes(pattern)) {
        return `${explanation}\n\nOriginal error: ${errorMessage}`;
      }
    }

    return errorMessage;
  }

  /**
   * Get current session state for a language
   */
  getSessionState(language: Language): RuntimeState | null {
    return this.runtimeStates.get(language.id) || null;
  }

  /**
   * Save session state to localStorage for persistence
   */
  saveSessionState(language: Language): void {
    const state = this.runtimeStates.get(language.id);
    if (state) {
      try {
        const serializedState = {
          variables: state.variables,
          functions: {}, // Functions can't be serialized, so we skip them
          imports: state.imports,
          initialized: state.initialized
        };
        localStorage.setItem(`repl_session_${language.id}`, JSON.stringify(serializedState));
      } catch (error) {
        console.warn('Failed to save session state:', error);
      }
    }
  }

  /**
   * Load session state from localStorage
   */
  loadSessionState(language: Language): void {
    try {
      const saved = localStorage.getItem(`repl_session_${language.id}`);
      if (saved) {
        const serializedState = JSON.parse(saved);
        const state = this.runtimeStates.get(language.id);
        if (state) {
          state.variables = serializedState.variables || {};
          state.imports = serializedState.imports || [];
          // Note: We don't restore functions as they can't be serialized
        }
      }
    } catch (error) {
      console.warn('Failed to load session state:', error);
    }
  }

  /**
   * Clear session state from localStorage
   */
  clearSessionState(language: Language): void {
    try {
      localStorage.removeItem(`repl_session_${language.id}`);
    } catch (error) {
      console.warn('Failed to clear session state:', error);
    }
  }



  /**
   * Reset session for a language
   */
  resetSession(language: Language): void {
    const langId = language.id;

    if (this.runtimeStates.has(langId)) {
      const state = this.runtimeStates.get(langId)!;
      state.variables = {};
      state.functions = {};
      state.imports = [];
    }

    // For Python, we might want to reset the global namespace
    if (langId === 'python' && this.pyodideRuntime) {
      try {
        this.pyodideRuntime.runPython(`
# Clear user-defined variables
for name in list(globals().keys()):
    if not name.startswith('_') and name not in ['sys', 'builtins']:
        del globals()[name]
        `);
      } catch (error) {
        console.warn('Failed to reset Python session:', error);
      }
    }
  }
}

// Export singleton instance
export const inBrowserREPL = new InBrowserREPLService();
