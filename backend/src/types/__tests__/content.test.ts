/**
 * Unit tests for content data models and validation
 */

import {
  Language,
  CodeSnippet,
  TutorialSection,
  validateLanguage,
  validateCodeSnippet,
  validateTutorialSection
} from '../content';

describe('Content Data Models', () => {
  describe('validateLanguage', () => {
    it('should validate a correct Language object', () => {
      const validLanguage: Language = {
        id: 'python',
        name: 'Python',
        fileExtension: '.py',
        replCommand: 'python3',
        syntaxHighlighting: 'python',
        dockerImage: 'python:3.11-slim'
      };

      expect(validateLanguage(validLanguage)).toBe(true);
    });

    it('should reject invalid Language objects', () => {
      const invalidLanguage = {
        id: 'python',
        name: 'Python',
        // missing required fields
      };

      expect(validateLanguage(invalidLanguage)).toBe(false);
    });

    it('should reject non-object values', () => {
      expect(validateLanguage('not an object')).toBe(false);
      expect(validateLanguage(null)).toBe(false);
      expect(validateLanguage(undefined)).toBe(false);
    });
  });

  describe('validateCodeSnippet', () => {
    it('should validate a correct CodeSnippet object', () => {
      const validSnippet: CodeSnippet = {
        id: 'snippet-1',
        originalCode: 'print("Hello, World!")',
        translatedCode: {
          python: 'print("Hello, World!")',
          javascript: 'console.log("Hello, World!");'
        },
        isExecutable: true,
        context: 'Basic output example'
      };

      expect(validateCodeSnippet(validSnippet)).toBe(true);
    });

    it('should validate CodeSnippet with optional fields', () => {
      const snippetWithOptionals: CodeSnippet = {
        id: 'snippet-2',
        originalCode: 'x = 42',
        translatedCode: { python: 'x = 42' },
        isExecutable: true,
        context: 'Variable assignment',
        explanation: 'This assigns the value 42 to variable x',
        lineStart: 1,
        lineEnd: 1
      };

      expect(validateCodeSnippet(snippetWithOptionals)).toBe(true);
    });

    it('should reject invalid CodeSnippet objects', () => {
      const invalidSnippet = {
        id: 'snippet-1',
        originalCode: 'print("Hello")',
        // missing required fields
      };

      expect(validateCodeSnippet(invalidSnippet)).toBe(false);
    });
  });

  describe('validateTutorialSection', () => {
    it('should validate a correct TutorialSection object', () => {
      const validSection: TutorialSection = {
        id: 'section-1',
        title: 'Introduction to Variables',
        content: '# Variables\n\nA variable is a name that points to a value.',
        codeSnippets: [],
        order: 1
      };

      expect(validateTutorialSection(validSection)).toBe(true);
    });

    it('should validate TutorialSection with optional navigation', () => {
      const sectionWithNav: TutorialSection = {
        id: 'section-2',
        title: 'Functions',
        content: '# Functions\n\nFunctions are like recipes.',
        codeSnippets: [],
        nextSection: 'section-3',
        previousSection: 'section-1',
        order: 2
      };

      expect(validateTutorialSection(sectionWithNav)).toBe(true);
    });

    it('should reject invalid TutorialSection objects', () => {
      const invalidSection = {
        id: 'section-1',
        title: 'Introduction',
        // missing required fields
      };

      expect(validateTutorialSection(invalidSection)).toBe(false);
    });

    it('should reject sections with invalid codeSnippets array', () => {
      const invalidSection = {
        id: 'section-1',
        title: 'Introduction',
        content: 'Some content',
        codeSnippets: 'not an array',
        order: 1
      };

      expect(validateTutorialSection(invalidSection)).toBe(false);
    });
  });
});
