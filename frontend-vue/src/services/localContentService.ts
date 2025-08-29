/**
 * Local content service - provides tutorial content without backend dependency
 */

import type { TutorialSection, CodeSnippet, Language } from '@/types'
import { getContentForLanguage } from './content'

class LocalContentService {
  /**
   * Get all tutorial sections for a specific language
   */
  async getAllSections(language: string): Promise<TutorialSection[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    // Get language-specific content
    return getContentForLanguage(language)
  }

  /**
   * Get a specific tutorial section for a language
   */
  async getSection(sectionId: string, language: string): Promise<TutorialSection | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))

    const sections = getContentForLanguage(language)
    return sections.find(section => section.id === sectionId) || null
  }

  /**
   * Get code snippets for a specific section and language
   */
  async getCodeSnippets(sectionId: string, language: string): Promise<CodeSnippet[]> {
    const section = await this.getSection(sectionId, language)
    if (!section) return []
    if (section.codeItems && section.codeItems.length > 0) {
      // Flatten groups into a single list of snippets
      const flattened: CodeSnippet[] = []
      for (const item of section.codeItems) {
        if ('snippets' in item) {
          flattened.push(...item.snippets)
        } else {
          flattened.push(item)
        }
      }
      return flattened
    }
    return section.codeSnippets || []
  }

  /**
   * Get supported languages
   */
  async getSupportedLanguages(): Promise<Language[]> {
    return [
      {
        id: 'python',
        name: 'Python',
        fileExtension: '.py',
        replCommand: 'python',
        syntaxHighlighting: 'python',
        dockerImage: 'python:3.13-slim'
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        fileExtension: '.js',
        replCommand: 'node',
        syntaxHighlighting: 'javascript',
        dockerImage: 'node:18-slim'
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        fileExtension: '.ts',
        replCommand: 'ts-node',
        syntaxHighlighting: 'typescript',
        dockerImage: 'node:18-slim'
      },
      {
        id: 'ruby',
        name: 'Ruby',
        fileExtension: '.rb',
        replCommand: 'ruby',
        syntaxHighlighting: 'ruby',
        dockerImage: 'ruby:3.2'
      }
    ]
  }

  /**
   * Add a new section (for future extensibility)
   */
  addSection(section: TutorialSection): void {
    // This would be implemented for dynamic content management
    console.log('Adding section:', section.id)
  }

  /**
   * Update an existing section (for future extensibility)
   */
  updateSection(sectionId: string, updates: Partial<TutorialSection>): boolean {
    // This would be implemented for dynamic content management
    console.log('Updating section:', sectionId, updates)
    return true
  }

  /**
   * Get metadata about the tutorial
   */
  async getMetadata() {
    return {
      title: 'Interactive Programming Tutorial',
      description: 'Learn programming fundamentals with interactive examples',
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    }
  }
}

// Export a singleton instance
export const localContentService = new LocalContentService()
