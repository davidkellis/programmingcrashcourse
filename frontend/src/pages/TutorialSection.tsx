import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import type { TutorialSection as ITutorialSection } from '../types';
import { TutorialContent } from '../components/TutorialContent';
import { localContentService } from '../services/localContentService';
import './TutorialSection.css';

interface OutletContext {
  uiState: any;
  replState: any;
  onCodeExecute: (code: string) => Promise<void>;
}

export const TutorialSection: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const { uiState, onCodeExecute } = useOutletContext<OutletContext>();

  const [section, setSection] = useState<ITutorialSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sectionId && uiState.selectedLanguage) {
      loadSection(sectionId, uiState.selectedLanguage.id);
    }
  }, [sectionId, uiState.selectedLanguage]);

  const loadSection = async (id: string, language: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const section = await localContentService.getSection(id, language);
      setSection(section);

    } catch (error) {
      console.error('Failed to load section:', error);
      setError('Failed to load tutorial section. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (targetSectionId: string) => {
    navigate(`/section/${targetSectionId}`);
  };

  if (isLoading) {
    return (
      <div className="tutorial-section">
        <div className="loading-message">Loading section...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tutorial-section">
        <div className="error-message">
          <h2>Error Loading Section</h2>
          <p>{error}</p>
          <button
            onClick={() => sectionId && uiState.selectedLanguage && loadSection(sectionId, uiState.selectedLanguage.id)}
            className="retry-button"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="home-button"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="tutorial-section">
        <div className="error-message">
          <h2>Section Not Found</h2>
          <p>The requested tutorial section could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="home-button"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tutorial-section">
      <div className="section-header">
        <nav className="section-nav">
          <button
            onClick={() => navigate('/')}
            className="nav-button home-nav"
          >
            ← Home
          </button>
          {section.previousSection && (
            <button
              onClick={() => handleNavigation(section.previousSection!)}
              className="nav-button prev-nav"
            >
              ← Previous
            </button>
          )}
          {section.nextSection && (
            <button
              onClick={() => handleNavigation(section.nextSection!)}
              className="nav-button next-nav"
            >
              Next →
            </button>
          )}
        </nav>

        <div className="section-info">
          <h1 className="section-title">{section.title}</h1>
          {uiState.selectedLanguage && (
            <div className="language-badge">
              {uiState.selectedLanguage.name}
            </div>
          )}
        </div>
      </div>

      <div className="section-content">
        <TutorialContent
          section={section}
          language={uiState.selectedLanguage}
          onCodeExecute={onCodeExecute}
          onNavigate={handleNavigation}
        />
      </div>

      <div className="section-footer">
        <nav className="section-nav">
          {section.previousSection && (
            <button
              onClick={() => handleNavigation(section.previousSection!)}
              className="nav-button prev-nav large"
            >
              ← Previous Section
            </button>
          )}
          {section.nextSection && (
            <button
              onClick={() => handleNavigation(section.nextSection!)}
              className="nav-button next-nav large"
            >
              Next Section →
            </button>
          )}
        </nav>
      </div>


    </div>
  );
};
