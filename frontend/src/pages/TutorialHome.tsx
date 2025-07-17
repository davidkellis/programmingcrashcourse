import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { TutorialSection } from '../types';
import { localContentService } from '../services/localContentService';
import './TutorialHome.css';

export const TutorialHome: React.FC = () => {
  const [sections, setSections] = useState<TutorialSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const sections = await localContentService.getAllSections('python'); // Default to Python for structure
      setSections(sections);

    } catch (error) {
      console.error('Failed to load sections:', error);
      setError('Failed to load tutorial content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="tutorial-home">
        <div className="loading-message">Loading tutorial content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tutorial-home">
        <div className="error-message">
          <h2>Error Loading Content</h2>
          <p>{error}</p>
          <button onClick={loadSections} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tutorial-home">
      <div className="welcome-section">
        <h1>Welcome to Interactive Programming</h1>
        <p className="welcome-description">
          Learn programming concepts through hands-on examples and interactive code execution.
          This tutorial is designed for learners aged 10 and older, using clear explanations
          and practical examples.
        </p>

        <div className="getting-started">
          <h2>Getting Started</h2>
          <ol>
            <li>Choose your preferred programming language from the dropdown above</li>
            <li>Click on any section below to start learning</li>
            <li>Use the REPL (code execution area) at the bottom to try out examples</li>
            <li>Hover over code snippets in lessons to send them directly to the REPL</li>
          </ol>
        </div>
      </div>

      <div className="sections-overview">
        <h2>Tutorial Sections</h2>
        <div className="sections-grid">
          {sections.map((section, index) => (
            <Link
              key={section.id}
              to={`/section/${section.id}`}
              className="section-card"
            >
              <div className="section-number">{index + 1}</div>
              <div className="section-content">
                <h3 className="section-title">{section.title}</h3>
                <p className="section-preview">
                  {section.content.substring(0, 150)}...
                </p>
                <div className="section-meta">
                  {section.codeSnippets.length > 0 && (
                    <span className="code-count">
                      {section.codeSnippets.length} code example{section.codeSnippets.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="tutorial-features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🌍 Multi-Language Support</h3>
            <p>Learn the same concepts in Python, JavaScript, TypeScript, or Ruby</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Interactive Execution</h3>
            <p>Run code examples instantly and see results in real-time</p>
          </div>
          <div className="feature-card">
            <h3>📚 Clear Explanations</h3>
            <p>Concepts explained with analogies and examples suitable for all ages</p>
          </div>
          <div className="feature-card">
            <h3>🔒 Safe Environment</h3>
            <p>Code runs in secure, isolated containers for safe experimentation</p>
          </div>
        </div>
      </div>


    </div>
  );
};
