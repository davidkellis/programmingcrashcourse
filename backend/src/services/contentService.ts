/**
 * Content service for managing tutorial content with caching
 */

import { ContentParser, ParsedContent } from './contentParser';
import { TutorialSection, CodeSnippet, Language } from '../types/content';
import { ContentService as IContentService, ContentError } from '../types/services';
import { SUPPORTED_LANGUAGES } from '../config/languages';
import { CONTENT_CONFIG } from '../config/constants';

interface CacheEntry {
  data: ParsedContent;
  timestamp: Date;
  language: string;
}

export class ContentService implements IContentService {
  private parser: ContentParser;
  private cache: Map<string, CacheEntry> = new Map();
  private lastRefresh: Date = new Date(0);

  constructor(bookPath?: string) {
    this.parser = new ContentParser(bookPath || '../Book');
  }

  /**
   * Get a specific tutorial section by ID and language
   */
  async getSection(sectionId: string, language: string): Promise<TutorialSection> {
    if (!this.isLanguageSupported(language)) {
      throw new ContentError(`Language ${language} is not supported`, 'UNSUPPORTED_LANGUAGE');
    }

    const sections = await this.getAllSections(language);
    const section = sections.find(s => s.id === sectionId);

    if (!section) {
      throw new ContentError(`Section ${sectionId} not found`, 'SECTION_NOT_FOUND');
    }

    return section;
  }

  /**
   * Get all tutorial sections for a specific language
   */
  async getAllSections(language: string): Promise<TutorialSection[]> {
    if (!this.isLanguageSupported(language)) {
      throw new ContentError(`Language ${language} is not supported`, 'UNSUPPORTED_LANGUAGE');
    }

    const cacheKey = `sections_${language}`;
    const cached = this.cache.get(cacheKey);

    // Check if cache is valid
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data.sections;
    }

    // Parse content and apply language-specific translations
    const parsedContent = await this.parser.parseAllContent();
    const translatedSections = await this.translateSections(parsedContent.sections, language);

    // Cache the result
    this.cache.set(cacheKey, {
      data: { ...parsedContent, sections: translatedSections },
      timestamp: new Date(),
      language
    });

    return translatedSections;
  }

  /**
   * Get code snippets for a specific section and language
   */
  async getCodeSnippets(sectionId: string, language: string): Promise<CodeSnippet[]> {
    const section = await this.getSection(sectionId, language);
    return section.codeSnippets;
  }

  /**
   * Get list of supported languages
   */
  async getSupportedLanguages(): Promise<Language[]> {
    return SUPPORTED_LANGUAGES;
  }

  /**
   * Refresh content cache (force reload from source)
   */
  async refreshContent(): Promise<void> {
    this.cache.clear();
    this.lastRefresh = new Date();

    // Pre-warm cache for all languages
    for (const lang of SUPPORTED_LANGUAGES) {
      try {
        await this.getAllSections(lang.id);
      } catch (error) {
        console.warn(`Failed to pre-warm cache for language ${lang.id}:`, error);
      }
    }
  }

  /**
   * Get content metadata
   */
  async getContentMetadata() {
    const pythonSections = await this.getAllSections('python');
    return {
      totalSections: pythonSections.length,
      supportedLanguages: SUPPORTED_LANGUAGES,
      lastUpdated: this.lastRefresh,
      version: '1.0.0'
    };
  }

  /**
   * Translate sections to target language (placeholder for now)
   */
  private async translateSections(sections: TutorialSection[], targetLanguage: string): Promise<TutorialSection[]> {
    if (targetLanguage === 'python') {
      // No translation needed for original language
      return sections;
    }

    // For now, return sections as-is with basic language mapping
    // This will be enhanced when we implement the translation service
    return sections.map(section => ({
      ...section,
      codeSnippets: section.codeSnippets.map(snippet => ({
        ...snippet,
        translatedCode: {
          ...snippet.translatedCode,
          [targetLanguage]: this.basicCodeTranslation(snippet.originalCode, targetLanguage)
        }
      }))
    }));
  }

  /**
   * Basic code translation (placeholder implementation)
   */
  private basicCodeTranslation(pythonCode: string, targetLanguage: string): string {
    switch (targetLanguage) {
      case 'javascript':
        return pythonCode
          .replace(/print\(/g, 'console.log(')
          .replace(/def\s+(\w+)\s*\(/g, 'function $1(')
          .replace(/:\s*$/gm, ' {')
          .replace(/^(\s*)([^#\s].*[^{])$/gm, '$1$2;');

      case 'typescript':
        return pythonCode
          .replace(/print\(/g, 'console.log(')
          .replace(/def\s+(\w+)\s*\(/g, 'function $1(')
          .replace(/:\s*$/gm, ': void {')
          .replace(/^(\s*)([^#\s].*[^{])$/gm, '$1$2;');

      case 'ruby':
        return pythonCode
          .replace(/print\(/g, 'puts(')
          .replace(/def\s+(\w+)\s*\(/g, 'def $1(')
          .replace(/:\s*$/gm, '')
          .replace(/True/g, 'true')
          .replace(/False/g, 'false');

      default:
        return pythonCode;
    }
  }

  /**
   * Check if language is supported
   */
  private isLanguageSupported(language: string): boolean {
    return SUPPORTED_LANGUAGES.some(lang => lang.id === language);
  }

  /**
   * Check if cache entry is still valid
   */
  private isCacheValid(timestamp: Date): boolean {
    const now = new Date();
    const age = now.getTime() - timestamp.getTime();
    return age < CONTENT_CONFIG.CACHE_TTL;
  }

  /**
   * Clear cache for specific language or all languages
   */
  clearCache(language?: string): void {
    if (language) {
      const cacheKey = `sections_${language}`;
      this.cache.delete(cacheKey);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const entries = Array.from(this.cache.entries());
    return {
      totalEntries: entries.length,
      languages: entries.map(([key, entry]) => entry.language),
      oldestEntry: entries.reduce((oldest, [, entry]) =>
        !oldest || entry.timestamp < oldest ? entry.timestamp : oldest, null as Date | null
      ),
      newestEntry: entries.reduce((newest, [, entry]) =>
        !newest || entry.timestamp > newest ? entry.timestamp : newest, null as Date | null
      )
    };
  }
}
