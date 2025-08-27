/**
 * MathJS-based JavaScript REPL Service
 * Provides a comprehensive JavaScript REPL with access to mathematical functions
 */

import type { ExecutionResult, Language } from '../types'
import * as acorn from 'acorn'

// Import mathjs for mathematical operations
import * as math from 'mathjs'

interface MathJSRuntimeState {
  variables: Record<string, unknown>
  functions: Record<string, unknown>
  imports: string[]
  executionHistory: string[]
  globalScope: Record<string, unknown>
}

class MathJSREPLService {
  private runtimes: Map<string, MathJSRuntimeState> = new Map()
  private isInitialized = false

  /**
   * Parse code and synthesize an expression representing the value of the last statement.
   * Falls back to null if unsupported or parse fails.
   */
  private extractLastExpressionWithParser(code: string): { expr: string; isSafeToReevaluate: boolean; stmtStart: number; stmtEnd: number; mode: 'replace' | 'append' } | null {
    try {
      const program = acorn.parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'script'
      }) as unknown as { body: Array<Pick<acorn.Node, 'type'> & { start: number; end: number }> }

      const src = code

      const stmtToExpr = (s: (Pick<acorn.Node, 'type'> & { start: number; end: number }) | null | undefined): { expr: string; isSafeToReevaluate: boolean; stmtStart: number; stmtEnd: number; mode: 'replace' | 'append' } | null => {
        if (!s) return null
        const type = (s as acorn.Node).type as string
        switch (type) {
          case 'EmptyStatement':
            return null
          case 'ExpressionStatement': {
            const node = s as unknown as { start: number; end: number; expression: { start: number; end: number; type?: string } }
            const exprStr = src.slice(node.expression.start, node.expression.end)
            const exprType = (node.expression as unknown as { type?: string }).type || ''
            const sideEffecting = exprType === 'CallExpression' || exprType === 'UpdateExpression' || exprType === 'AssignmentExpression' || exprType === 'AwaitExpression' || exprType === 'YieldExpression'
            // If not side-effecting, we can REPLACE the statement with an assignment once
            return { expr: exprStr, isSafeToReevaluate: !sideEffecting, stmtStart: node.start, stmtEnd: node.end, mode: 'replace' }
          }
          case 'VariableDeclaration': {
            const node = s as unknown as { start: number; end: number; declarations: Array<{ id: { name?: string }, init?: unknown }> }
            const last = node.declarations[node.declarations.length - 1]
            return last?.id && 'name' in last.id && (last.id as { name?: string }).name ? { expr: (last.id as { name: string }).name, isSafeToReevaluate: true, stmtStart: node.start, stmtEnd: node.end, mode: 'append' } : null
          }
          case 'FunctionDeclaration':
          case 'ClassDeclaration': {
            const node = s as unknown as { start: number; end: number; id?: { name?: string } }
            return node.id && node.id.name ? { expr: node.id.name, isSafeToReevaluate: true, stmtStart: node.start, stmtEnd: node.end, mode: 'append' } : null
          }
          case 'BlockStatement': {
            const node = s as unknown as { body: Array<Pick<acorn.Node, 'type'> & { start: number; end: number }> }
            const body = node.body
            return body && body.length ? stmtToExpr(body[body.length - 1] as (Pick<acorn.Node, 'type'> & { start: number; end: number })) : null
          }
          case 'IfStatement': {
            const node = s as unknown as { test: { start: number; end: number }, consequent: unknown, alternate: unknown }
            const test = src.slice(node.test.start, node.test.end)
            const c1 = stmtToExpr(node.consequent as (Pick<acorn.Node, 'type'> & { start: number; end: number }))
            const c2 = stmtToExpr(node.alternate as (Pick<acorn.Node, 'type'> & { start: number; end: number }))
            if (c1 && c2) {
              return { expr: `((${test}) ? (${c1.expr}) : (${c2.expr}))`, isSafeToReevaluate: c1.isSafeToReevaluate && c2.isSafeToReevaluate, stmtStart: s.start, stmtEnd: s.end, mode: 'replace' }
            }
            return null
          }
          // Add more structured cases here if needed (e.g., TryStatement)
          default:
            return null
        }
      }

      const body = program.body
      if (!body || body.length === 0) return null
      return stmtToExpr(body[body.length - 1])
    } catch {
      return null
    }
  }

  /**
   * Initialize the MathJS REPL service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Initialize mathjs if needed
      if (typeof math !== 'undefined') {
        this.isInitialized = true
      } else {
        throw new Error('MathJS not available')
      }
    } catch (error) {
      console.error('Failed to initialize MathJS REPL service:', error)
      throw new Error('Failed to initialize MathJS REPL environment')
    }
  }

  /**
   * Create a new REPL session
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createSession(_language: Language): Promise<string> {
    await this.initialize()

    const sessionId = `mathjs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const runtime: MathJSRuntimeState = {
      variables: {},
      functions: {},
      imports: [],
      executionHistory: [],
      globalScope: {}
    }

    // Initialize the global scope with MathJS modules
    await this.initializeMathJSScope(runtime)

    this.runtimes.set(sessionId, runtime)
    return sessionId
  }

  /**
   * Initialize the global scope with MathJS modules
   */
  private async initializeMathJSScope(runtime: MathJSRuntimeState): Promise<void> {
    // Create a global scope object with MathJS modules
    const globalScope: Record<string, unknown> = {
      // Core JavaScript objects
      console: console,
      Math: Math,
      Date: Date,
      JSON: JSON,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean,
      Function: Function,
      RegExp: RegExp,
      Error: Error,
      Promise: Promise,
      Map: Map,
      Set: Set,
      WeakMap: WeakMap,
      WeakSet: WeakSet,
      Symbol: Symbol,
      Proxy: Proxy,
      Reflect: Reflect,

      // MathJS library
      math: math,

      // Common MathJS functions for easy access
      // Mathematical functions
      sin: math.sin,
      cos: math.cos,
      tan: math.tan,
      asin: math.asin,
      acos: math.acos,
      atan: math.atan,
      sqrt: math.sqrt,
      pow: math.pow,
      exp: math.exp,
      log: math.log,
      log10: math.log10,
      abs: math.abs,
      floor: math.floor,
      ceil: math.ceil,
      round: math.round,
      max: math.max,
      min: math.min,
      sum: math.sum,
      mean: math.mean,
      median: math.median,
      std: math.std,
      variance: math.variance,

      // Array and matrix functions
      matrix: math.matrix,
      zeros: math.zeros,
      ones: math.ones,
      range: math.range,
      reshape: math.reshape,
      transpose: math.transpose,
      det: math.det,
      inv: math.inv,
      multiply: math.multiply,
      add: math.add,
      subtract: math.subtract,
      divide: math.divide,

      // Utility functions
      format: math.format,
      evaluate: math.evaluate,
      parse: math.parse,

      // Constants
      PI: math.pi,
      E: math.e,
      LN2: math.LN2,
      LN10: math.LN10,
      LOG2E: math.LOG2E,
      LOG10E: math.LOG10E,
      SQRT1_2: math.SQRT1_2,
      SQRT2: math.SQRT2,
      PHI: math.phi,
      INFINITY: Infinity,
      NEGATIVE_INFINITY: -Infinity,
      NAN: NaN
    }

    runtime.globalScope = globalScope
    runtime.variables = globalScope
  }

  /**
   * Execute code in the stdlib JavaScript environment
   */
  async executeCode(code: string, _language: Language, sessionId: string): Promise<ExecutionResult> {
    await this.initialize()

    const runtime = this.runtimes.get(sessionId)
    if (!runtime) {
      throw new Error('Invalid session')
    }

    const startTime = Date.now()

    try {
      let output = ''
      let error: string | undefined
      let variables: Record<string, unknown> = {}

      // Capture console output
      const capturedOutput: string[] = []
      const originalConsoleLog = console.log
      const originalConsoleError = console.error
      const originalConsoleWarn = console.warn
      const originalConsoleInfo = console.info

      // Override console methods to capture output
      console.log = (...args: unknown[]) => {
        const outputStr = args.map(arg => String(arg)).join(' ')
        capturedOutput.push(outputStr)
        originalConsoleLog(...args)
      }

      console.error = (...args: unknown[]) => {
        const outputStr = args.map(arg => String(arg)).join(' ')
        capturedOutput.push(`ERROR: ${outputStr}`)
        originalConsoleError(...args)
      }

      console.warn = (...args: unknown[]) => {
        const outputStr = args.map(arg => String(arg)).join(' ')
        capturedOutput.push(`WARN: ${outputStr}`)
        originalConsoleWarn(...args)
      }

      console.info = (...args: unknown[]) => {
        const outputStr = args.map(arg => String(arg)).join(' ')
        capturedOutput.push(`INFO: ${outputStr}`)
        originalConsoleInfo(...args)
      }

      try {
        // Extract variable declarations from the code
        const varDeclarations = this.extractVariableDeclarations(code)

        // Prefer AST-based extraction; fall back to heuristic if parsing fails
        const parsed = this.extractLastExpressionWithParser(code)
        let bodyCode: string
        if (parsed && parsed.expr && parsed.isSafeToReevaluate) {
          if (parsed.mode === 'replace') {
            const before = code.slice(0, parsed.stmtStart)
            const after = code.slice(parsed.stmtEnd)
            bodyCode = `${before}__result__ = (${parsed.expr});${after}`
          } else {
            bodyCode = `${code}\n__result__ = (${parsed.expr});`
          }
        } else {
          // Safer fallback: run code as-is without result capture
          bodyCode = code
        }

        // Bind the runtime variable store into the eval scope so we can reference
        // original objects (like Set/Map) without JSON-serializing them
        // Use a local alias and reference it inside the template by name.
        // const SCOPE = runtime.variables

        // Build execution context via string concatenation to avoid template collisions
        const restoreLines = Object.keys(runtime.variables)
          .filter((key) => !['console', 'Math', 'Date', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Function', 'RegExp', 'Error', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'math', '__result__'].includes(key))
          .map((key) => `let ${key} = runtime.variables['${key}'];`)
          .join('\n')

        const returnMappingsExisting = Object.keys(runtime.variables)
          .filter((key) => !['console', 'Math', 'Date', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Function', 'RegExp', 'Error', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'math', '__result__'].includes(key))
          .map((key) => `${key}: ${key}`)
          .join(',\n')

        const returnMappingsDeclared = varDeclarations.map((varName: string) => `${varName}: ${varName}`).join(',\n')

        const parts: string[] = []
        parts.push('(function() {\n')
        parts.push('// Restore existing variables from the runtime\n')
        if (restoreLines) parts.push(restoreLines + '\n')
        parts.push('\n// Execute the user code (with optional __result__ capture)\n')
        parts.push('let __result__ = undefined;\n')
        parts.push(bodyCode + '\n')
        parts.push('\n// Return all variables and the optional result\n')
        parts.push('return {\n')
        parts.push('  __result__: __result__')
        if (returnMappingsExisting) parts.push(',\n' + returnMappingsExisting)
        if (returnMappingsDeclared) parts.push((returnMappingsExisting ? ',\n' : ',\n') + returnMappingsDeclared)
        parts.push('\n};\n')
        parts.push('})()')

        const executionContext = parts.join('')

        // Execute the code in the context
        const result = eval(executionContext)

        // Update the runtime variables with any new/modified variables (excluding __result__)
        if (result && typeof result === 'object') {
          const temp = result as Record<string, unknown>
          // Access to indicate usage
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          temp.__result__
          const vars: Record<string, unknown> = { ...temp }
          delete (vars as Record<string, unknown> as Record<string, unknown> & { __result__?: unknown }).__result__
          Object.assign(runtime.variables, vars)
        }

        // Capture any output
        if (capturedOutput.length > 0) {
          output = capturedOutput.join('\n')
        }

        // Always display the expression result when available
        if (result && typeof result === 'object' && Object.prototype.hasOwnProperty.call(result, '__result__')) {
           const value = (result as Record<string, unknown>).__result__
          if (value !== undefined) {
            const format = (v: unknown): string => {
              try {
                if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v)
                if (v === null || v === undefined) return String(v)
                if (typeof Set !== 'undefined' && v instanceof Set) {
                  const arr = Array.from(v as Set<unknown>)
                  return `Set(${(v as Set<unknown>).size}) { ${arr.map((x) => String(x)).join(', ')} }`
                }
                const json = JSON.stringify(v)
                return json ?? String(v)
              } catch {
                return String(v)
              }
            }
            const resultStr = format(value)
            output = output ? `${output}\n${resultStr}` : resultStr
          }
        }

        // Update variables for the return value
        variables = { ...runtime.variables }

      } catch (execError: unknown) {
        error = execError instanceof Error ? execError.message : 'JavaScript execution error'
      } finally {
        // Restore original console methods
        console.log = originalConsoleLog
        console.error = originalConsoleError
        console.warn = originalConsoleWarn
        console.info = originalConsoleInfo
      }

      const executionTime = Date.now() - startTime

      return {
        output,
        error,
        variables,
        executionTime,
        timestamp: new Date()
      }

    } catch (error: unknown) {
      const executionTime = Date.now() - startTime
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
        variables: {},
        executionTime,
        timestamp: new Date()
      }
    }
  }

  /**
   * Get runtime state for a session
   */
  getRuntimeState(sessionId: string): MathJSRuntimeState | null {
    return this.runtimes.get(sessionId) || null
  }

  /**
   * Clear a runtime session
   */
  clearSession(sessionId: string): void {
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
      /(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*;/g
    ]

    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(code)) !== null) {
        if (match[1]) {
          declarations.push(match[1])
        }
      }
    }

    return declarations
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(language: Language): boolean {
    return language.id === 'javascript'
  }
}

// Export singleton instance
export const mathJSREPL = new MathJSREPLService()
