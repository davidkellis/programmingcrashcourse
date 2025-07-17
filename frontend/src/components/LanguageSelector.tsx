import React from 'react';
import type { LanguageSelectorProps } from '../types';
import './LanguageSelector.css';

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onLanguageChange,
  disabled = false
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const languageId = event.target.value;
    const language = languages.find(lang => lang.id === languageId);
    if (language) {
      onLanguageChange(language);
    }
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select" className="language-label">
        Programming Language:
      </label>
      <select
        id="language-select"
        value={selectedLanguage?.id || ''}
        onChange={handleChange}
        disabled={disabled}
        className="language-select"
      >
        {!selectedLanguage && (
          <option value="" disabled>
            Select a language...
          </option>
        )}
        {languages.map((language) => (
          <option key={language.id} value={language.id}>
            {language.name}
          </option>
        ))}
      </select>


    </div>
  );
};
