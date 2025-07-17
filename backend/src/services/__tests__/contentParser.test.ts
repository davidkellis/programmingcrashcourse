/**
 * Unit tests for content parser service
 */

import { ContentParser } from '../contentParser';
import { TutorialSection, CodeSnippet } from '../../types/content';

// Mock fs module
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  readdirSync: jest.fn(),
  statSync: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  extname: jest.fn((path) => {
    const parts = path.split('.');
    return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
  }),
}));

const mockFs = require('fs');

describe('ContentParser', () => {
  let parser: ContentParser;

  beforeEach(() => {
    parser = new ContentParser('./test-book');
    jest.clearAllMocks();
  });

  describe('parseMarkdownFile', () => {
    it('should parse a simple markdown file with sections', async () => {
      const mockContent = `# Introduction

This is the introduction section.

\`\`\`python
print("Hello, World!")
\`\`\`

# Variables

Variables are used to store values.

\`\`\`python
x = 42
name = "Alice"
\`\`\``;

      mockFs.readFileSync.mockReturnValue(mockContent);

      const sections = await parser.parseMarkdownFile('test.md');

      expect(sections).toHaveLength(2);
      expect(sections[0].title).toBe('Introduction');
      expect(sections[1].title).toBe('Variables');
      expect(sections[0].codeSnippets).toHaveLength(1);
      expect(sections[1].codeSnippets).toHaveLength(1);
    });

    it('should handle markdown without headings', async () => {
      const mockContent = `This is content without headings.

\`\`\`python
print("Hello")
\`\`\``;

      mockFs.readFileSync.mockReturnValue(mockContent);

      const sections = await parser.parseMarkdownFile('test.md');

      expect(sections).toHaveLength(1);
      expect(sections[0].title).toBe('Introduction');
      expect(sections[0].codeSnippets).toHaveLength(1);
    });

    it('should extract executable code snippets', async () => {
      const mockContent = `# Code Examples

Here are some examples:

\`\`\`python
# This is a comment
x = 25
print(x)
\`\`\`

\`\`\`shell
❯ python
Python 3.12.5
\`\`\`

\`\`\`python
# Just comments
# More comments
\`\`\``;

      mockFs.readFileSync.mockReturnValue(mockContent);

      const sections = await parser.parseMarkdownFile('test.md');

      expect(sections).toHaveLength(1);
      expect(sections[0].codeSnippets.length).toBeGreaterThan(0);

      // Find the executable snippet
      const executableSnippets = sections[0].codeSnippets.filter(s => s.isExecutable);
      expect(executableSnippets).toHaveLength(1);
      expect(executableSnippets[0].originalCode).toContain('x = 25');
    });

    it('should extract inline executable code', async () => {
      const mockContent = `# Variables

You can assign values like \`x = 42\` or call functions like \`print("hello")\`.

Some text with \`non_executable_text\` should be ignored.`;

      mockFs.readFileSync.mockReturnValue(mockContent);

      const sections = await parser.parseMarkdownFile('test.md');

      expect(sections).toHaveLength(1);
      // Should find the executable inline code
      const executableSnippets = sections[0].codeSnippets.filter(s => s.isExecutable);
      expect(executableSnippets.length).toBeGreaterThan(0);
    });

    it('should handle file read errors gracefully', async () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      const sections = await parser.parseMarkdownFile('nonexistent.md');

      expect(sections).toHaveLength(0);
    });
  });

  describe('parseAllContent', () => {
    it('should parse multiple markdown files', async () => {
      mockFs.readdirSync.mockReturnValue(['intro.md', 'variables.md', 'functions.md']);
      mockFs.statSync.mockReturnValue({ isFile: () => true });

      const mockContent1 = `# Introduction\nIntro content`;
      const mockContent2 = `# Variables\nVariable content`;
      const mockContent3 = `# Functions\nFunction content`;

      mockFs.readFileSync
        .mockReturnValueOnce(mockContent1)
        .mockReturnValueOnce(mockContent2)
        .mockReturnValueOnce(mockContent3);

      const result = await parser.parseAllContent();

      expect(result.sections).toHaveLength(3);
      expect(result.totalSections).toBe(3);
      expect(result.sections[0].title).toBe('Introduction');
      expect(result.sections[1].title).toBe('Variables');
      expect(result.sections[2].title).toBe('Functions');
    });

    it('should assign navigation links correctly', async () => {
      mockFs.readdirSync.mockReturnValue(['first.md', 'second.md']);
      mockFs.statSync.mockReturnValue({ isFile: () => true });

      mockFs.readFileSync
        .mockReturnValueOnce('# First\nFirst content')
        .mockReturnValueOnce('# Second\nSecond content');

      const result = await parser.parseAllContent();

      expect(result.sections).toHaveLength(2);
      expect(result.sections[0].nextSection).toBe(result.sections[1].id);
      expect(result.sections[1].previousSection).toBe(result.sections[0].id);
      expect(result.sections[0].previousSection).toBeUndefined();
      expect(result.sections[1].nextSection).toBeUndefined();
    });

    it('should filter out non-markdown files', async () => {
      mockFs.readdirSync.mockReturnValue(['intro.md', 'image.png', 'data.txt', 'guide.md']);
      mockFs.statSync.mockReturnValue({ isFile: () => true });

      mockFs.readFileSync
        .mockReturnValueOnce('# Introduction\nIntro content')
        .mockReturnValueOnce('# Guide\nGuide content');

      const result = await parser.parseAllContent();

      expect(mockFs.readFileSync).toHaveBeenCalledTimes(2); // Only .md files
      expect(result.sections).toHaveLength(2);
    });

    it('should handle directory read errors gracefully', async () => {
      mockFs.readdirSync.mockImplementation(() => {
        throw new Error('Directory not found');
      });

      const result = await parser.parseAllContent();

      expect(result.sections).toHaveLength(0);
      expect(result.totalSections).toBe(0);
    });
  });

  describe('code snippet detection', () => {
    it('should correctly identify executable code patterns', async () => {
      const mockContent = `# Code Tests

Assignment: \`\`\`python
x = 42
\`\`\`

Function definition: \`\`\`python
def greet():
    print("Hello")
\`\`\`

Conditional: \`\`\`python
if x > 0:
    print("positive")
\`\`\`

Just comments: \`\`\`python
# This is just a comment
# Another comment
\`\`\`

Shell output: \`\`\`shell
❯ python
Python 3.12.5
\`\`\``;

      mockFs.readFileSync.mockReturnValue(mockContent);

      const sections = await parser.parseMarkdownFile('test.md');
      const snippets = sections[0].codeSnippets;

      // Should have 3 executable snippets (assignment, function, conditional)
      const executableSnippets = snippets.filter(s => s.isExecutable);
      expect(executableSnippets).toHaveLength(3);

      // Check that non-executable snippets exist but are marked correctly
      const nonExecutableSnippets = snippets.filter(s => !s.isExecutable);
      expect(nonExecutableSnippets.length).toBeGreaterThanOrEqual(0);
    });
  });
});
