/**
 * Language Runtime Service - handles code execution using WebAssembly-based interpreters
 */

import type { Language, ExecutionResult } from '@/types'
import { mathJSREPL } from './mathJSREPL'

// Extend Window interface for Pyodide and Opal
declare global {
  interface Window {
    // Pyodide attaches a function to window for bootstrapping the runtime
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideLike>
    // Opal is no longer used, keep for forward-compat if needed
    Opal?: unknown
    // Ruby (WASM) stdout/stderr bridges, set when Ruby VM is initialized
    __rubyReplStdoutWrite?: (s: string) => void
    __rubyReplStderrWrite?: (s: string) => void
  }
}

interface PyodideLike {
  runPythonAsync: (code: string) => Promise<unknown>
  globals: Record<string, unknown> & { print?: (...args: unknown[]) => void }
}

// Runtime state for each language
interface RuntimeState {
  variables: Record<string, unknown>
  functions: Record<string, unknown>
  imports: string[]
  executionHistory: string[]
}

class LanguageRuntimeService {
  private runtimes: Map<string, RuntimeState> = new Map()
  private pyodide: PyodideLike | null = null
  private isInitialized = false
  private rubyWasmVM: { eval: (code: string) => unknown } | null = null;
  private rubyWasmLoaded = false;
  private rubyWasmCapture: string[] | null = null;
  private rubyWasmStdoutBridged = false;
  private tsCompilerLoaded = false;
  private tsToJsSession: Map<string, string> = new Map()

  /**
   * Initialize the language runtime service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Defer heavy runtime loads to per-language initializers
      // Keep this method lightweight so non-Python languages are not blocked

      this.isInitialized = true
    } catch (error) {
      // Do not block non-Python languages if Pyodide (or any init) fails here
      console.error('Initialization warning (non-fatal):', error)
      this.isInitialized = true
    }
  }

  /**
   * Load Pyodide script from CDN
   */
  private async loadPyodideScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.loadPyodide) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.28.0/full/pyodide.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Pyodide script'))
      document.head.appendChild(script)
    })
  }

  // Opal loader removed in favor of CRuby WASM for reliability.

  /**
   * Load ruby.wasm (CRuby on WebAssembly) once per page
   */
  private async loadRubyWasm(): Promise<void> {
    if (this.rubyWasmLoaded && this.rubyWasmVM) return

    // Dynamic import to keep initial bundle small (use browser build for WASI polyfill)
    const wasmModule = await import('@ruby/wasm-wasi/dist/browser')
    // Import wasm asset URL via Vite '?url' loader from versioned package
    const wasmUrl = (await import('@ruby/3.2-wasm-wasi/dist/ruby+stdlib.wasm?url')).default as string

    const response = await fetch(wasmUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch ruby.wasm: ${response.status}`)
    }
    const buffer = await response.arrayBuffer()
    const module = await WebAssembly.compile(buffer)

    interface RubyWasmVM {
      eval: (code: string) => unknown
    }
    type DefaultRubyVMFn = (m: WebAssembly.Module, opts: { print: (s: string) => void; printErr: (s: string) => void }) => Promise<{ vm: RubyWasmVM }>
    const { DefaultRubyVM } = wasmModule as unknown as { DefaultRubyVM: DefaultRubyVMFn }
    const { vm } = await DefaultRubyVM(module, {
      // Fallbacks used until we install $stdout/$stderr bridges.
      // After bridges are active, avoid capturing here to prevent duplicates.
      print: (s: string) => {
        if (!this.rubyWasmStdoutBridged && this.rubyWasmCapture) {
          this.rubyWasmCapture.push(String(s))
        }
        console.log(String(s))
      },
      printErr: (s: string) => {
        if (!this.rubyWasmStdoutBridged && this.rubyWasmCapture) {
          this.rubyWasmCapture.push(`ERR: ${String(s)}`)
        }
        console.error(String(s))
      }
    })

    this.rubyWasmVM = vm
    this.rubyWasmLoaded = true

    // Install JS bridges for Ruby's $stdout/$stderr so that `puts` and friends
    // are captured in the REPL and also logged to the browser console.
    // This mirrors the pattern described in ruby.wasm's FAQ where $stdout is
    // set to an object implementing a `write` method.
    window.__rubyReplStdoutWrite = (s: string) => {
      if (this.rubyWasmCapture) {
        this.rubyWasmCapture.push(String(s))
      }
      // Always log to console for developer visibility
      console.log(String(s))
    }
    window.__rubyReplStderrWrite = (s: string) => {
      if (this.rubyWasmCapture) {
        this.rubyWasmCapture.push(`ERR: ${String(s)}`)
      }
      console.error(String(s))
    }

    // Configure $stdout and $stderr inside the Ruby VM to call our JS bridges.
    // If the JS bridges are missing for any reason, Ruby will still fallback to
    // the VM-level print/printErr handlers above.
    try {
      vm.eval(`
        require "js"
        $stdout = Object.new.tap do |obj|
          def obj.write(str)
            JS.global.call(:__rubyReplStdoutWrite, str.to_s)
          end
        end

        $stderr = Object.new.tap do |obj|
          def obj.write(str)
            JS.global.call(:__rubyReplStderrWrite, str.to_s)
          end
        end
      `)
      // Mark that our JS bridges are now active; avoid VM-level capture to prevent duplicates
      this.rubyWasmStdoutBridged = true
    } catch (e) {
      // Non-fatal: continue with default print hooks if customization fails
      console.warn('Failed to configure Ruby $stdout/$stderr bridges:', e)
    }
  }

  /**
   * Load the TypeScript compiler in the browser (window.ts)
   * Uses the official TypeScript bundle as suggested in
   * https://stackoverflow.com/a/59874612
   */
  private async loadTypeScriptCompiler(): Promise<void> {
    if (this.tsCompilerLoaded) return
    await new Promise<void>((resolve, reject) => {
      if ((window as unknown as { ts?: unknown }).ts) {
        this.tsCompilerLoaded = true
        resolve()
        return
      }
      const script = document.createElement('script')
      // Use jsDelivr to comply with production CSP (allows cdn.jsdelivr.net)
      script.src = 'https://cdn.jsdelivr.net/npm/typescript@latest/lib/typescript.js'
      script.onload = () => { this.tsCompilerLoaded = true; resolve() }
      script.onerror = () => reject(new Error('Failed to load TypeScript compiler'))
      document.head.appendChild(script)
    })
  }

  /**
   * Create a new runtime session for a language
   */
  async createSession(language: Language): Promise<string> {
    await this.initialize()

    // Use MathJS REPL for JavaScript sessions
    if (language.id === 'javascript') {
      return await mathJSREPL.createSession(language)
    }

    // Use a synthetic session for Ruby WASM (and treat 'ruby' as an alias)
    if (language.id === 'ruby-wasm' || language.id === 'ruby') {
      const sessionId = `rubywasm_${Date.now()}_${Math.random().toString(36).slice(2)}`
      this.runtimes.set(sessionId, {
        variables: {},
        functions: {},
        imports: [],
        executionHistory: [],
      })
      await this.initializeLanguageRuntime(language, sessionId)
      return sessionId
    }

    const sessionId = `${language.id}_${Date.now()}`
    this.runtimes.set(sessionId, {
      variables: {},
      functions: {},
      imports: [],
      executionHistory: [],
    })

    // Initialize language-specific runtime
    await this.initializeLanguageRuntime(language, sessionId)

    return sessionId
  }

  /**
   * Initialize language-specific runtime
   */
  private async initializeLanguageRuntime(language: Language, sessionId: string): Promise<void> {
    const runtime = this.runtimes.get(sessionId)
    if (!runtime) return

    switch (language.id) {
      case 'python':
        // Lazy-load Pyodide only when Python is first used
        if (!this.pyodide) {
          if (typeof window !== 'undefined') {
            await this.loadPyodideScript()
            if (window.loadPyodide) {
              this.pyodide = await window.loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.28.0/full/',
              })
            }
          }
        }
        if (this.pyodide) {
          // Initialize Python runtime with some basic imports
          await this.pyodide.runPythonAsync(`
import sys
import math
import random
import json
import datetime
          `)
        }
        break
      case 'javascript':
        // JavaScript runs natively in the browser
        runtime.variables = {
          console: console,
          Math: Math,
          Date: Date,
          JSON: JSON,
        }
        break
      case 'typescript':
        // TypeScript also runs as JavaScript in the browser; ensure compiler is available
        await this.loadTypeScriptCompiler()
        // Create a backing MathJS session to execute transpiled JS for this TS session
        try {
          const jsSessionId = await mathJSREPL.createSession({ id: 'javascript', name: 'JavaScript' } as Language)
          this.tsToJsSession.set(sessionId, jsSessionId)
        } catch (e) {
          console.warn('Failed to create backing JS session for TS:', e)
        }
        break
      case 'ruby':
        // Treat classic 'ruby' as CRuby WASM as well to avoid fragile CDNs
        await this.loadRubyWasm()
        break;
      case 'ruby-wasm':
        // Load CRuby (ruby.wasm) runtime
        await this.loadRubyWasm()
        break;
    }
  }

  /**
   * Execute code in the specified language
   */
  async executeCode(code: string, language: Language, sessionId: string): Promise<ExecutionResult> {
    await this.initialize()

    const startTime = Date.now()

    try {
      let output = ''
      let error: string | undefined
      let variables: Record<string, unknown> = {}

      // Handle MathJS sessions separately
      if (sessionId.startsWith('mathjs_')) {
        const result = await mathJSREPL.executeCode(code, language, sessionId)
        return {
          output: result.output,
          error: result.error,
          variables: result.variables,
          executionTime: Date.now() - startTime,
          timestamp: new Date()
        }
      }

      // Handle other language sessions
      const runtime = this.runtimes.get(sessionId)
      if (!runtime) {
        throw new Error('Invalid session')
      }

      switch (language.id) {
        case 'python':
          if (this.pyodide) {
            try {
              // Capture print output by overriding the print function
              const capturedOutput: string[] = []

              // Create a custom print function that captures output
              this.pyodide.globals.print = (...args: unknown[]) => {
                const outputStr = args.map((arg) => String(arg)).join(' ')
                capturedOutput.push(outputStr)
                // Also log to console for debugging
                console.log('Python print:', ...args)
              }

              const result = await this.pyodide.runPythonAsync(code)

              // Combine captured print output with return value
              if (capturedOutput.length > 0) {
                output = capturedOutput.join('\n')
                if (result !== undefined && result !== null) {
                  output += '\n' + String(result)
                }
              } else {
                output = (result !== undefined && result !== null) ? String(result) : ''
              }

              // If the last non-empty line is a simple assignment (e.g., x = <expr>),
              // evaluate the assigned variable once and append its value to the output.
              // This avoids re-running the entire user code (and any side effects).
              try {
                const trimmed = code.trim()
                const lines = trimmed.split('\n').filter(l => l.trim() !== '')
                const lastLine = lines[lines.length - 1] || ''
                // Match a simple single-name assignment: name = <expr>
                // - Require only whitespace between name and '=' (so 'x +=' won't match)
                // - Ensure it's not '==' by requiring next char after '=' is not '='
                const m = lastLine.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^=].*)$/)
                if (m && m[1]) {
                  const varName = m[1]
                  const assignedVal = await this.pyodide.runPythonAsync(varName)
                  const assignedStr = String(assignedVal)
                  if (assignedStr !== undefined) {
                    if (output) {
                      output += (output.endsWith('\n') ? '' : '\n') + assignedStr
                    } else {
                      output = assignedStr
                    }
                  }
                }
              } catch {
                // Non-fatal: if we fail to detect/evaluate the assignment, ignore
              }

              // Don't try to restore the original print - just leave our custom one
              // This is simpler and avoids the restoration issues

              // Capture variables from the global scope
              const globals = this.pyodide.globals
              for (const [key, value] of Object.entries(globals)) {
                if (!key.startsWith('_') && typeof value !== 'function') {
                  variables[key] = value
                }
              }
            } catch (pyError: unknown) {
              error = pyError instanceof Error ? pyError.message : 'Python execution error'
            }
          } else {
            error = 'Python runtime not available'
          }
          break



        case 'typescript':
          try {
            await this.loadTypeScriptCompiler()
            const tsGlobal = (window as unknown as { ts?: { transpileModule: (code: string, opts: unknown) => { outputText: string; diagnostics?: Array<{ messageText: unknown }> }; ScriptTarget: Record<string, number>; ModuleKind: Record<string, number>; JsxEmit: Record<string, number>; flattenDiagnosticMessageText?: (msg: unknown, newline: string) => string } }).ts
            if (!tsGlobal) throw new Error('TypeScript compiler not available')

            // Transpile raw TS to JS; let the JavaScript REPL handle result capture and persistence
            const transpileResult = tsGlobal.transpileModule(code, {
              compilerOptions: {
                target: tsGlobal.ScriptTarget.ES2020,
                module: tsGlobal.ModuleKind.None,
                jsx: tsGlobal.JsxEmit.Preserve,
              },
              reportDiagnostics: true,
            })

            if (transpileResult.diagnostics && transpileResult.diagnostics.length > 0) {
              const msgs = transpileResult.diagnostics.map((d: { messageText: unknown }) => tsGlobal.flattenDiagnosticMessageText ? tsGlobal.flattenDiagnosticMessageText(d.messageText, '\n') : String(d.messageText))
              error = msgs.join('\n')
              // continue if output is available
            }

            const jsCode: string = transpileResult.outputText || ''

            // Ensure a backing JS session exists
            let jsSessionId = this.tsToJsSession.get(sessionId)
            if (!jsSessionId) {
              jsSessionId = await mathJSREPL.createSession({ id: 'javascript', name: 'JavaScript' } as Language)
              this.tsToJsSession.set(sessionId, jsSessionId)
            }

            const jsLang = { id: 'javascript', name: 'JavaScript' } as Language
            const jsResult = await mathJSREPL.executeCode(jsCode, jsLang, jsSessionId)
            output = jsResult.output
            error = jsResult.error
            variables = jsResult.variables
          } catch (tsError: unknown) {
            error = tsError instanceof Error ? tsError.message : 'TypeScript execution error'
          }
          break

        case 'ruby':
        case 'ruby-wasm':
          try {
            await this.loadRubyWasm()
            if (!this.rubyWasmVM) {
              throw new Error('Ruby (WASM) runtime not available')
            }
            // Capture output printed by Ruby VM
            this.rubyWasmCapture = []
            let evalResult: unknown
            try {
              evalResult = this.rubyWasmVM.eval(code)
            } finally {
              // no special teardown required
            }
            const captured = this.rubyWasmCapture
            this.rubyWasmCapture = null
            if (captured && captured.length > 0) {
              // Ruby's puts/write typically include their own newlines; avoid adding extra ones
              output = captured.join('')
            }
            if (evalResult !== undefined && evalResult !== null) {
              const resultStr = String(evalResult)
              // Ensure exactly one newline between printed output and the result value
              if (output && !output.endsWith('\n')) {
                output += '\n'
              }
              output = output ? output + resultStr : resultStr
            }
          } catch (rbwErr: unknown) {
            error = rbwErr instanceof Error ? rbwErr.message : 'Ruby (WASM) execution error'
          }
          break;

        default:
          error = `Unsupported language: ${language.name}`
      }

      const executionTime = Date.now() - startTime

      return {
        output,
        error,
        variables,
        executionTime,
        timestamp: new Date(),
      }
    } catch (error: unknown) {
      const executionTime = Date.now() - startTime
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
        variables: {},
        executionTime,
        timestamp: new Date(),
      }
    }
  }

  /**
   * Get runtime state for a session
   */
  getRuntimeState(sessionId: string): RuntimeState | null {
    // Check if it's a MathJS session
    if (sessionId.startsWith('mathjs_')) {
      const mathJSState = mathJSREPL.getRuntimeState(sessionId)
      if (mathJSState) {
        return {
          variables: mathJSState.variables,
          functions: mathJSState.functions,
          imports: mathJSState.imports,
          executionHistory: mathJSState.executionHistory,
        }
      }
      return null
    }

    // If this is a TypeScript session backed by a MathJS session, proxy state
    const jsBacker = this.tsToJsSession.get(sessionId)
    if (jsBacker) {
      const mathJSState = mathJSREPL.getRuntimeState(jsBacker)
      if (mathJSState) {
        return {
          variables: mathJSState.variables,
          functions: mathJSState.functions,
          imports: mathJSState.imports,
          executionHistory: mathJSState.executionHistory,
        }
      }
      return null
    }

    return this.runtimes.get(sessionId) || null
  }

  /**
   * Clear a runtime session
   */
  clearSession(sessionId: string): void {
    // Check if it's a MathJS session
    if (sessionId.startsWith('mathjs_')) {
      mathJSREPL.clearSession(sessionId)
      return
    }

    // If this is a TypeScript session with a backing JS session, clear both
    const jsBacker = this.tsToJsSession.get(sessionId)
    if (jsBacker) {
      mathJSREPL.clearSession(jsBacker)
      this.tsToJsSession.delete(sessionId)
    }
    this.runtimes.delete(sessionId)
  }

  /**
   * Extract variable declarations from JavaScript code
   */
  private extractVariableDeclarations(code: string): string[] {
    const declarations: string[] = []

    // Simple regex to match let, const, and var declarations
    const patterns = [
      /(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g,
      /(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*;/g,
      /(?:export\s+)?class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\{/g,
      /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
    ]

    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(code)) !== null) {
        const name = match[1]
        if (typeof name === 'string' && name.length > 0) {
          declarations.push(name)
        }
      }
    }

    return declarations
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(language: Language): boolean {
    return ['python', 'javascript', 'typescript', 'ruby', 'ruby-wasm'].includes(language.id);
  }
}

// Export singleton instance
export const languageRuntime = new LanguageRuntimeService()
