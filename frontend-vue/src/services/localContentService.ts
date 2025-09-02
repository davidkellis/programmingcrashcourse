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
   * Now parses inline snippets from content markdown
   */
  async getCodeSnippets(sectionId: string, language: string): Promise<CodeSnippet[]> {
    const section = await this.getSection(sectionId, language)
    if (!section) return []
    
    // Parse inline snippets from content
    const inlineSnippets = this.parseInlineSnippets(section.content)
    if (inlineSnippets.length > 0) {
      return inlineSnippets
    }
    
    // Fallback to legacy codeItems
    if (section.codeItems && section.codeItems.length > 0) {
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
    
    // No snippets found
    return []
  }

  /**
   * Parse inline snippets from markdown content
   */
  private parseInlineSnippets(content: string): CodeSnippet[] {
    const snippets: CodeSnippet[] = []
    
    // Regex to match code blocks with snippet comments
    const codeBlockRegex = /```(\w+)\s*\n\/\/\s*snippet:\s*([^\n]+)\n([\s\S]*?)```/g
    
    let match
    let snippetIndex = 0
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const [, blockLanguage, description, code] = match
      
      // Ensure we have valid matches
      if (!blockLanguage || !description || !code) continue
      
      // Check if this is a snippet group (contains ---)
      if (code.includes('---')) {
        const sections = code.split('---').map(section => section.trim()).filter(section => section.length > 0)
        
        sections.forEach((section, index) => {
          snippets.push({
            id: `inline_snippet_${snippetIndex}_${index}`,
            code: section,
            language: blockLanguage,
            isExecutable: true,
            context: `${description} - Part ${index + 1}`
          })
        })
      } else {
        // Single snippet
        snippets.push({
          id: `inline_snippet_${snippetIndex}`,
          code: code.trim(),
          language: blockLanguage,
          isExecutable: true,
          context: description.trim()
        })
      }
      
      snippetIndex++
    }
    
    return snippets
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
