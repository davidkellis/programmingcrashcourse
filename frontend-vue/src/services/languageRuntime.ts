/**
 * Language Runtime Service - handles code execution using WebAssembly-based interpreters
 */

import type { Language, ExecutionResult } from '@/types'

// Extend Window interface for Pyodide
declare global {
  interface Window {
    loadPyodide: any
  }
}

// Runtime state for each language
interface RuntimeState {
  variables: Record<string, any>
  functions: Record<string, any>
  imports: string[]
  executionHistory: string[]
}

class LanguageRuntimeService {
  private runtimes: Map<string, RuntimeState> = new Map()
  private pyodide: any = null
  private isInitialized = false

  /**
   * Initialize the language runtime service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Load Pyodide for Python execution from CDN
      if (typeof window !== 'undefined') {
        // Load Pyodide script dynamically
        await this.loadPyodideScript()

        // @ts-ignore - Pyodide is loaded globally
        if (window.loadPyodide) {
          this.pyodide = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.28.0/full/'
          })
        } else {
          throw new Error('Pyodide failed to load')
        }
      }

      this.isInitialized = true
      console.log('Language runtime service initialized')
    } catch (error) {
      console.error('Failed to initialize language runtime:', error)
      throw new Error('Failed to initialize code execution environment')
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

  /**
   * Create a new runtime session for a language
   */
  async createSession(language: Language): Promise<string> {
    await this.initialize()

    const sessionId = `${language.id}_${Date.now()}`
    this.runtimes.set(sessionId, {
      variables: {},
      functions: {},
      imports: [],
      executionHistory: []
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
          JSON: JSON
        }
        break
      case 'typescript':
        // TypeScript also runs as JavaScript in the browser
        runtime.variables = {
          console: console,
          Math: Math,
          Date: Date,
          JSON: JSON
        }
        break
      case 'ruby':
        // For Ruby, we'd need to load ruby.wasm
        // For now, we'll simulate it
        console.log('Ruby runtime not yet implemented')
        break
    }
  }

    /**
   * Execute code in the specified language
   */
  async executeCode(code: string, language: Language, sessionId: string): Promise<ExecutionResult> {
    await this.initialize()

    const runtime = this.runtimes.get(sessionId)
    if (!runtime) {
      throw new Error('Invalid session')
    }

    const startTime = Date.now()

    try {
      let output = ''
      let error: string | undefined
      let variables: Record<string, any> = {}

      switch (language.id) {
        case 'python':
          if (this.pyodide) {
                                    try {
              // Capture print output by overriding the print function
              const capturedOutput: string[] = []

              // Create a custom print function that captures output
              this.pyodide.globals.print = (...args: any[]) => {
                const outputStr = args.map(arg => String(arg)).join(' ')
                capturedOutput.push(outputStr)
                // Also log to console for debugging
                console.log('Python print:', ...args)
              }

              const result = await this.pyodide.runPythonAsync(code)

              // Combine captured print output with return value
              if (capturedOutput.length > 0) {
                output = capturedOutput.join('\n')
                if (result) {
                  output += '\n' + String(result)
                }
              } else {
                output = result ? String(result) : ''
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
            } catch (pyError: any) {
              error = pyError.message || 'Python execution error'
            }
          } else {
            error = 'Python runtime not available'
          }
          break

                case 'javascript':
          try {
            // Capture console.log output
            const capturedOutput: string[] = []
            const customConsole = {
              ...console,
              log: (...args: any[]) => {
                const outputStr = args.map(arg => String(arg)).join(' ')
                capturedOutput.push(outputStr)
                // Also call the original console.log
                console.log(...args)
              }
            }

            // Create a safe execution context
            const safeEval = new Function('console', 'Math', 'Date', 'JSON', code)
            const result = safeEval(customConsole, Math, Date, JSON)

            // Combine captured console output with return value
            if (capturedOutput.length > 0) {
              output = capturedOutput.join('\n')
              if (result !== undefined) {
                output += '\n' + String(result)
              }
            } else {
              output = result !== undefined ? String(result) : ''
            }

            // Note: Capturing variables in JavaScript is more complex
            // For now, we'll just return the output
          } catch (jsError: any) {
            error = jsError.message || 'JavaScript execution error'
          }
          break

        case 'typescript':
          try {
            // TypeScript code runs as JavaScript
            const capturedOutput: string[] = []
            const customConsole = {
              ...console,
              log: (...args: any[]) => {
                const outputStr = args.map(arg => String(arg)).join(' ')
                capturedOutput.push(outputStr)
                // Also call the original console.log
                console.log(...args)
              }
            }

            const safeEval = new Function('console', 'Math', 'Date', 'JSON', code)
            const result = safeEval(customConsole, Math, Date, JSON)

            // Combine captured console output with return value
            if (capturedOutput.length > 0) {
              output = capturedOutput.join('\n')
              if (result !== undefined) {
                output += '\n' + String(result)
              }
            } else {
              output = result !== undefined ? String(result) : ''
            }
          } catch (tsError: any) {
            error = tsError.message || 'TypeScript execution error'
          }
          break

        case 'ruby':
          // For now, simulate Ruby execution
          output = `Ruby execution: ${code}`
          break

        default:
          error = `Unsupported language: ${language.name}`
      }

      const executionTime = Date.now() - startTime

      return {
        output,
        error,
        variables,
        executionTime,
        timestamp: new Date()
      }

    } catch (error: any) {
      const executionTime = Date.now() - startTime
      return {
        output: '',
        error: error.message || 'Execution failed',
        variables: {},
        executionTime,
        timestamp: new Date()
      }
    }
  }

  /**
   * Get runtime state for a session
   */
  getRuntimeState(sessionId: string): RuntimeState | null {
    return this.runtimes.get(sessionId) || null
  }

  /**
   * Clear a runtime session
   */
  clearSession(sessionId: string): void {
    this.runtimes.delete(sessionId)
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(language: Language): boolean {
    return ['python', 'javascript', 'typescript'].includes(language.id)
  }
}

// Export singleton instance
export const languageRuntime = new LanguageRuntimeService()
