import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LanguageSelector } from './LanguageSelector';
import { DockableREPL } from './DockableREPL';
import type { Language, UIState, REPLState } from '../types';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, STORAGE_KEYS } from '../constants';
import { inBrowserREPL } from '../services/inBrowserREPL';
import './TutorialLayout.css';

export const TutorialLayout: React.FC = () => {
  const [uiState, setUIState] = useState<UIState>({
    selectedLanguage: null,
    currentSection: null,
    isREPLVisible: true,
    isLoading: false,
    error: null
  });

  const [replLayout, setReplLayout] = useState({
    position: 'bottom' as 'bottom' | 'right',
    size: { width: 400, height: 300 }
  });



  const [replState, setREPLState] = useState<REPLState>({
    sessionId: null,
    isExecuting: false,
    history: [],
    currentInput: '',
    variables: {}
  });

  // Initialize language selection
  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE);
    const language = savedLanguage
      ? SUPPORTED_LANGUAGES.find(lang => lang.id === savedLanguage) || DEFAULT_LANGUAGE
      : DEFAULT_LANGUAGE;

    setUIState(prev => ({ ...prev, selectedLanguage: language }));
  }, []);

  // Create REPL session when language changes
  useEffect(() => {
    if (uiState.selectedLanguage && !replState.sessionId) {
      createREPLSession(uiState.selectedLanguage);
    }
  }, [uiState.selectedLanguage]);

  const createREPLSession = async (language: Language) => {
    try {
      setUIState(prev => ({ ...prev, isLoading: true, error: null }));

      // Initialize the in-browser runtime
      await inBrowserREPL.initializeRuntime(language);

      // Create a session ID for tracking
      const sessionId = `${language.id}_${Date.now()}`;

      setREPLState(prev => ({
        ...prev,
        sessionId,
        history: [],
        variables: {}
      }));

      // Save session ID
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);

    } catch (error) {
      console.error('Failed to create REPL session:', error);
      setUIState(prev => ({
        ...prev,
        error: 'Failed to initialize code execution environment'
      }));
    } finally {
      setUIState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleLanguageChange = async (language: Language) => {
    // Save language preference
    localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, language.id);

    // Update UI state
    setUIState(prev => ({ ...prev, selectedLanguage: language }));

    // Reset REPL state and create new session
    setREPLState(prev => ({ ...prev, sessionId: null }));

    // Create new session for the selected language
    await createREPLSession(language);
  };

  const handleCodeExecution = async (code: string) => {
    if (!replState.sessionId || !uiState.selectedLanguage) {
      setUIState(prev => ({ ...prev, error: 'No active session' }));
      throw new Error('No active session');
    }

    try {
      setREPLState(prev => ({ ...prev, isExecuting: true }));
      setUIState(prev => ({ ...prev, error: null }));

      const result = await inBrowserREPL.executeCode(code, uiState.selectedLanguage);

      // Add to history
      const executionRecord = {
        id: `exec_${Date.now()}`,
        timestamp: new Date(),
        input: code,
        output: result.output || '',
        error: result.error,
        executionTime: result.executionTime || 0
      };

      setREPLState(prev => ({
        ...prev,
        history: [...prev.history, executionRecord],
        variables: { ...prev.variables, ...result.variables },
        currentInput: ''
      }));

      return result;

    } catch (error) {
      console.error('Code execution failed:', error);
      setUIState(prev => ({
        ...prev,
        error: 'Code execution failed. Please try again.'
      }));
      throw error;
    } finally {
      setREPLState(prev => ({ ...prev, isExecuting: false }));
    }
  };

  const toggleREPLVisibility = () => {
    setUIState(prev => ({ ...prev, isREPLVisible: !prev.isREPLVisible }));
  };

  const handleREPLPositionChange = (position: 'bottom' | 'right', size: { width: number; height: number }) => {
    setReplLayout({ position, size });
  };

  return (
    <div className="tutorial-layout">
      <header className="tutorial-header">
        <div className="header-content">
          <h1 className="tutorial-title">Interactive Programming Tutorial</h1>
          <div className="header-controls">
            <LanguageSelector
              languages={SUPPORTED_LANGUAGES}
              selectedLanguage={uiState.selectedLanguage}
              onLanguageChange={handleLanguageChange}
              disabled={uiState.isLoading}
            />
            <button
              className="repl-toggle"
              onClick={toggleREPLVisibility}
              aria-label={uiState.isREPLVisible ? 'Hide REPL' : 'Show REPL'}
            >
              {uiState.isREPLVisible ? '🔽' : '🔼'} REPL
            </button>
          </div>
        </div>
        {uiState.error && (
          <div className="error-banner">
            {uiState.error}
            <button
              className="error-dismiss"
              onClick={() => setUIState(prev => ({ ...prev, error: null }))}
            >
              ✕
            </button>
          </div>
        )}
      </header>

      <main className="tutorial-main">
        <div
          className="content-area"
          style={{
            paddingBottom: uiState.isREPLVisible && replLayout.position === 'bottom'
              ? `${replLayout.size.height + 20}px`
              : '1rem',
            paddingRight: uiState.isREPLVisible && replLayout.position === 'right'
              ? `${replLayout.size.width + 20}px`
              : '1rem'
          }}
        >
          <Outlet context={{
            uiState,
            replState,
            onCodeExecute: handleCodeExecution
          }} />
        </div>
      </main>

      <DockableREPL
        sessionId={replState.sessionId}
        language={uiState.selectedLanguage}
        onExecute={handleCodeExecution}
        history={replState.history}
        variables={replState.variables}
        isExecuting={replState.isExecuting}
        isVisible={uiState.isREPLVisible}
        onToggleVisibility={toggleREPLVisibility}
        onPositionChange={handleREPLPositionChange}
      />

      {uiState.isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
};
