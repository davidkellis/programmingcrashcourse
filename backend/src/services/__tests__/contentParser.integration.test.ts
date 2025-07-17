/**
 * Integration tests for content parser with real book content
 */

import { ContentParser } from '../contentParser';
import { existsSync } from 'fs';

describe('ContentParser Integration', () => {
  let parser: ContentParser;

  beforeEach(() => {
    parser = new ContentParser('./Book');
  });

  // Only run if Book directory exists
  const bookExists = existsSync('./Book');

  (bookExists ? describe : describe.skip)('with real book content', () => {
    it('should parse the Python Programming Introduction', async () => {
      const sections = await parser.parseMarkdownFile('./Book/Python Programming Introduction.md');

      expect(sections.length).toBeGreaterThan(0);

      // Should find sections like Comments, Values, Variables, etc.
      const sectionTitles = sections.map(s => s.title);
      expect(sectionTitles).toContain('Comments');
      expect(sectionTitles).toContain('Values');
      expect(sectionTitles).toContain('Variables and Assignment');

      // Should extract code snippets
      const totalSnippets = sections.reduce((sum, section) => sum + section.codeSnippets.length, 0);
      expect(totalSnippets).toBeGreaterThan(0);

      // Should have some executable snippets
      const executableSnippets = sections.flatMap(s => s.codeSnippets).filter(s => s.isExecutable);
      expect(executableSnippets.length).toBeGreaterThan(0);
    });

    it('should parse all content and create navigation', async () => {
      const result = await parser.parseAllContent();

      expect(result.sections.length).toBeGreaterThan(0);
      expect(result.totalSections).toBe(result.sections.length);

      // Check navigation links
      if (result.sections.length > 1) {
        expect(result.sections[0].nextSection).toBeDefined();
        expect(result.sections[result.sections.length - 1].previousSection).toBeDefined();
      }
    });

    it('should extract meaningful code snippets from book content', async () => {
      const result = await parser.parseAllContent();
      const allSnippets = result.sections.flatMap(s => s.codeSnippets);

      // Should find variable assignment examples
      const assignmentSnippets = allSnippets.filter(s =>
        s.originalCode.includes('=') && s.isExecutable
      );
      expect(assignmentSnippets.length).toBeGreaterThan(0);

      // Should find print statements
      const printSnippets = allSnippets.filter(s =>
        s.originalCode.includes('print(') && s.isExecutable
      );
      expect(printSnippets.length).toBeGreaterThan(0);

      // Should have context for snippets
      allSnippets.forEach(snippet => {
        expect(snippet.context).toBeDefined();
        expect(typeof snippet.context).toBe('string');
      });
    });
  });

  describe('without book content', () => {
    it('should handle missing book directory gracefully', async () => {
      const parserWithMissingDir = new ContentParser('./NonExistentBook');
      const result = await parserWithMissingDir.parseAllContent();

      expect(result.sections).toHaveLength(0);
      expect(result.totalSections).toBe(0);
    });
  });
});
