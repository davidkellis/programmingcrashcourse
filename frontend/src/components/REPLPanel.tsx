import React, { useState, useRef, useEffect } from 'react';
import type { REPLProps } from '../types';
import './REPLPanel.css';

export const REPLPanel: React.FC<REPLProps> = ({
  sessionId,
  language,
  onExecute,
  history,
  isExecuting = false
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isExecuting || !sessionId) return;

    const code = input.trim();
    setInput('');

    try {
      await onExecute(code);
    } catch (error) {
      console.error('Execution failed:', error);
    } finally {
      // Return focus to the input after execution
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };



  const formatExecutionTime = (timeMs: number): string => {
    if (timeMs < 1000) {
      return `${timeMs}ms`;
    }
    return `${(timeMs / 1000).toFixed(2)}s`;
  };

  return (
    <div className="repl-panel">
      <div className="repl-output" ref={outputRef}>
        {history.length === 0 ? (
          <div className="welcome-message">
            <p>Welcome to the interactive REPL!</p>
            <p>Type your code below and press <kbd>Ctrl+Enter</kbd> or click Run to execute.</p>
            {language && (
              <p>Ready to execute <strong>{language.name}</strong> code.</p>
            )}
          </div>
        ) : (
          history.map((record) => (
            <div key={record.id} className="execution-record">
              <div className="input-line">
                <span className="prompt">&gt;</span>
                <code className="input-code">{record.input}</code>
              </div>
              {record.output && (
                <div className="output-line">
                  <pre className="output-text">{record.output}</pre>
                </div>
              )}
              {record.error && (
                <div className="error-line">
                  <pre className="error-text">{record.error}</pre>
                </div>
              )}
              <div className="execution-meta">
                <span className="execution-time">
                  {formatExecutionTime(record.executionTime)}
                </span>
                <span className="execution-timestamp">
                  {record.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="repl-input-form">
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              sessionId
                ? `Type ${language?.name || 'code'} here... (Ctrl+Enter to run)`
                : 'Waiting for session...'
            }
            disabled={!sessionId || isExecuting}
            className="code-input"
            rows={3}
          />
          <button
            type="submit"
            disabled={!input.trim() || isExecuting || !sessionId}
            className="run-button"
          >
            {isExecuting ? 'Running...' : 'Run'}
          </button>
        </div>
      </form>


    </div>
  );
};
