/**
 * Core data models for tutorial content management
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
  originalCode: string;
  translatedCode: Record<string, string>; // language id -> translated code
  isExecutable: boolean;
  context: string;
  explanation?: string;
  lineStart?: number;
  lineEnd?: number;
}

export interface TutorialSection {
  id: string;
  title: string;
  content: string;
  codeSnippets: CodeSnippet[];
  nextSection?: string;
  previousSection?: string;
  order: number;
}

export interface ContentMetadata {
  totalSections: number;
  supportedLanguages: Language[];
  lastUpdated: Date;
  version: string;
}

// Validation schemas
export const validateLanguage = (lang: any): lang is Language => {
  return (
    typeof lang === 'object' &&
    lang !== null &&
    typeof lang.id === 'string' &&
    typeof lang.name === 'string' &&
    typeof lang.fileExtension === 'string' &&
    typeof lang.replCommand === 'string' &&
    typeof lang.syntaxHighlighting === 'string' &&
    typeof lang.dockerImage === 'string'
  );
};

export const validateCodeSnippet = (snippet: any): snippet is CodeSnippet => {
  return (
    typeof snippet === 'object' &&
    snippet !== null &&
    typeof snippet.id === 'string' &&
    typeof snippet.originalCode === 'string' &&
    typeof snippet.translatedCode === 'object' &&
    typeof snippet.isExecutable === 'boolean' &&
    typeof snippet.context === 'string'
  );
};

export const validateTutorialSection = (section: any): section is TutorialSection => {
  return (
    typeof section === 'object' &&
    section !== null &&
    typeof section.id === 'string' &&
    typeof section.title === 'string' &&
    typeof section.content === 'string' &&
    Array.isArray(section.codeSnippets) &&
    typeof section.order === 'number'
  );
};
