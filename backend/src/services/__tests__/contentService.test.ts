/**
 * Unit tests for content service
 */

import { ContentService } from '../contentService';
import { ContentParser } from '../contentParser';
import { ContentError } from '../../types/services';
import { TutorialSection } from '../../types/content';

// Mock the ContentParser
jest.mock('../contentParser');
const MockedContentParser = ContentParser as jest.MockedClass<typeof ContentParser>;

describe('ContentService', () => {
  let contentService: ContentService;
  let mockParser: jest.Mocked<ContentParser>;

  const mockSections: TutorialSection[] = [
    {
      id: 'section-1',
      title: 'Introduction',
      content: 'Introduction content',
      codeSnippets: [
        {
          id: 'snippet-1',
          originalCode: 'print("Hello, World!")',
          translatedCode: { python: 'print("Hello, World!")' },
          isExecutable: true,
          context: 'Basic output example'
        }
      ],
      order: 0
    },
    {
      id: 'section-2',
      title: 'Variables',
      content: 'Variables content',
      codeSnippets: [
        {
          id: 'snippet-2',
          originalCode: 'x = 42',
          translatedCode: { python: 'x = 42' },
          isExecutable: true,
          context: 'Variable assignment'
        }
      ],
      order: 1,
      previousSection: 'section-1'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockParser = {
      parseAllContent: jest.fn(),
      parseMarkdownFile: jest.fn(),
    } as any;

    MockedContentParser.mockImplementation(() => mockParser);
    contentService = new ContentService();
  });

  describe('getAllSections', () => {
    it('should return sections for supported language', async () => {
      mockParser.parseAllContent.mockResolvedValue({
        sections: mockSections,
        totalSections: 2
      });

      const sections = await contentService.getAllSections('python');

      expect(sections).toHaveLength(2);
      expect(sections[0].title).toBe('Introduction');
      expect(sections[1].title).toBe('Variables');
      expect(mockParser.parseAllContent).toHaveBeenCalledTimes(1);
    });

    it('should throw error for unsupported language', async () => {
      await expect(contentService.getAllSections('unsupported'))
        .rejects.toThrow(ContentError);

      expect(mockParser.parseAllContent).not.toHaveBeenCalled();
    });

    it('should cache results and not re-parse on subsequent calls', async () => {
      mockParser.parseAllContent.mockResolvedValue({
        sections: mockSections,
        totalSections: 2
      });

      // First call
      const sections1 = await contentService.getAllSections('python');
      // Second call
      const sections2 = await contentService.getAllSections('python');

      expect(sections1).toEqual(sections2);
      expect(mockParser.parseAllContent).toHaveBeenCalledTimes(1); // Only called once due to caching
    });

    it('should translate code snippets for non-Python languages', async () => {
      mockParser.parseAllContent.mockResolvedValue({
        sections: mockSections,
        totalSections: 2
      });

      const sections = await contentService.getAllSections('javascript');

      expect(sections[0].codeSnippets[0].translatedCode).toHaveProperty('javascript');
      expect(sections[0].codeSnippets[0].translatedCode.javascript).toContain('console.log');
    });
  });

  describe('getSection', () => {
    beforeEach(() => {
      mockParser.parseAllContent.mockResolvedValue({
        sections: mockSections,
        totalSections: 2
      });
    });

    it('should return specific section by ID', async () => {
      const section = await contentService.getSection('section-1', 'python');

      expect(section.id).toBe('section-1');
      expect(section.title).toBe('Introduction');
    });

    it('should throw error for non-existent section', async () => {
      await expect(contentService.getSection('non-existent', 'python'))
        .rejects.toThrow(ContentError);
    });

    it('should throw error for unsupported language', async () => {
      await expect(contentService.getSection('section-1', 'unsupported'))
        .rejects.toThrow(ContentError);
    });
  });

  describe('getCodeSnippets', () => {
    beforeEach(() => {
      mockParser.parseAllContent.mockResolvedValue({
        sections: mockSections,
        totalSections: 2
      });
    });

    it('should return code snippets for a section', async () => {
      const snippets = await contentService.getCodeSnippets('section-1', 'python');

      expect(snippets).toHaveLength(1);
      expect(snippets[0].id).toBe('snippet-1');
      expect(snippets[0].originalCode).toBe('print("Hello, World!")');
    });

    it('should return empty array for section without snippets', async () => {
      const sectionsWithoutSnippets = [{
        ...mockSections[0],
        codeSnippets: []
      }];

      mockParser.parseAllContent.mockResolvedValue({
        sections: sectionsWithoutSnippets,
        totalSections: 1
      });

      const snippets = await contentService.getCodeSnippets('section-1', 'python');
      expect(snippets).toHaveLength(0);
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return list of supported languages', async () => {
      const languages = await contentService.getSupportedLanguages();

      expect(languages).toHaveLength(4); // Python, JavaScript, TypeScript, Ruby
      expect(languages.map(l => l.id)).toContain('python');
      expect(languages.map(l => l.id)).toContain('javascript');
      expect(languages.map(l => l.id)).toContain('typescript');
      expect(languages.map(l => l.id)).toContain('ruby');
    });
  });

  describe('refreshContent', () => {
    it('should clear cache and reload content', async () => {
      mockParser.parseAllContent.mockResolvedValue({
        sections: mockSections,
        totalSections: 2
      });

      // Load content first
      await contentService.getAllSections('python');
      expect(mockParser.parseAllContent).toHaveBeenCalledTimes(1);

      // Refresh content
      await contentService.refreshContent();

      // Should have been called multiple times (once for each language during pre-warming)
      expect(mockParser.parseAllContent).toHaveBeenCalledTimes(5); // 1 + 4 languages
    });
  });

  describe('cache management', () => {
    beforeEach(() => {
      mockParser.parseAllContent.mockResolvedValue({
        sections: mockSections,
        totalSections: 2
      });
    });

    it('should provide cache statistics', async () => {
      await contentService.getAllSections('python');
      await contentService.getAllSections('javascript');

      const stats = contentService.getCacheStats();

      expect(stats.totalEntries).toBe(2);
      expect(stats.languages).toContain('python');
      expect(stats.languages).toContain('javascript');
      expect(stats.oldestEntry).toBeInstanceOf(Date);
      expect(stats.newestEntry).toBeInstanceOf(Date);
    });

    it('should clear cache for specific language', async () => {
      await contentService.getAllSections('python');
      await contentService.getAllSections('javascript');

      contentService.clearCache('python');
      const stats = contentService.getCacheStats();

      expect(stats.totalEntries).toBe(1);
      expect(stats.languages).not.toContain('python');
      expect(stats.languages).toContain('javascript');
    });

    it('should clear all cache', async () => {
      await contentService.getAllSections('python');
      await contentService.getAllSections('javascript');

      contentService.clearCache();
      const stats = contentService.getCacheStats();

      expect(stats.totalEntries).toBe(0);
    });
  });

  describe('basic code translation', () => {
    beforeEach(() => {
      mockParser.parseAllContent.mockResolvedValue({
        sections: mockSections,
        totalSections: 2
      });
    });

    it('should translate Python print to JavaScript console.log', async () => {
      const sections = await contentService.getAllSections('javascript');
      const snippet = sections[0].codeSnippets[0];

      expect(snippet.translatedCode.javascript).toBe('console.log("Hello, World!");');
    });

    it('should translate Python print to Ruby puts', async () => {
      const sections = await contentService.getAllSections('ruby');
      const snippet = sections[0].codeSnippets[0];

      expect(snippet.translatedCode.ruby).toBe('puts("Hello, World!")');
    });

    it('should add type annotations for TypeScript', async () => {
      const sectionsWithFunction = [{
        ...mockSections[0],
        codeSnippets: [{
          id: 'snippet-func',
          originalCode: 'def greet():',
          translatedCode: { python: 'def greet():' },
          isExecutable: true,
          context: 'Function definition'
        }]
      }];

      mockParser.parseAllContent.mockResolvedValue({
        sections: sectionsWithFunction,
        totalSections: 1
      });

      const sections = await contentService.getAllSections('typescript');
      const snippet = sections[0].codeSnippets[0];

      expect(snippet.translatedCode.typescript).toContain(': void {');
    });
  });
});
