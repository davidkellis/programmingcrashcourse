/**
 * Content parser service for extracting tutorial sections and code snippets from markdown
 */

import { marked } from 'marked';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { TutorialSection, CodeSnippet } from '../types/content';
import { generateId } from '../utils';

export interface ParsedContent {
  sections: TutorialSection[];
  totalSections: number;
}

export class ContentParser {
  private bookPath: string;

  constructor(bookPath: string = './Book') {
    this.bookPath = bookPath;
  }

  /**
   * Parse all markdown files in the book directory
   */
  async parseAllContent(): Promise<ParsedContent> {
    const markdownFiles = this.findMarkdownFiles();
    const sections: TutorialSection[] = [];

    for (const filePath of markdownFiles) {
      const fileSections = await this.parseMarkdownFile(filePath);
      sections.push(...fileSections);
    }

    // Sort sections by order and assign navigation
    sections.sort((a, b) => a.order - b.order);
    this.assignNavigation(sections);

    return {
      sections,
      totalSections: sections.length
    };
  }

  /**
   * Parse a single markdown file into tutorial sections
   */
  async parseMarkdownFile(filePath: string): Promise<TutorialSection[]> {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const sections = this.extractSections(content, filePath);
      return sections;
    } catch (error) {
      console.error(`Error parsing file ${filePath}:`, error);
      return [];
    }
  }

  /**
   * Extract sections from markdown content
   */
  private extractSections(content: string, filePath: string): TutorialSection[] {
    const sections: TutorialSection[] = [];

    // Split content by main headings (# or ##) at the start of a line, not inside code blocks
    const lines = content.split('\n');
    const sectionStarts: { index: number; title: string; level: number }[] = [];
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Track code block state
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      // Only process headings outside of code blocks
      if (!inCodeBlock) {
        const headingMatch = line.match(/^(#{1,2})\s+(.+)$/);
        if (headingMatch) {
          sectionStarts.push({
            index: i,
            title: headingMatch[2].trim(),
            level: headingMatch[1].length
          });
        }
      }
    }

    if (sectionStarts.length === 0) {
      // If no headings found, treat entire content as one section
      const section = this.createSection(
        this.generateSectionId(filePath, 0),
        'Introduction',
        content,
        0
      );
      sections.push(section);
      return sections;
    }

    for (let i = 0; i < sectionStarts.length; i++) {
      const currentSection = sectionStarts[i];
      const nextSection = sectionStarts[i + 1];

      const startLine = currentSection.index;
      const endLine = nextSection ? nextSection.index : lines.length;

      const sectionLines = lines.slice(startLine, endLine);
      const sectionContent = sectionLines.join('\n').trim();
      const sectionId = this.generateSectionId(filePath, i);

      const section = this.createSection(sectionId, currentSection.title, sectionContent, i);
      sections.push(section);
    }

    return sections;
  }

  /**
   * Create a tutorial section with extracted code snippets
   */
  private createSection(
    id: string,
    title: string,
    content: string,
    order: number
  ): TutorialSection {
    const codeSnippets = this.extractCodeSnippets(content);

    return {
      id,
      title,
      content,
      codeSnippets,
      order
    };
  }

  /**
   * Extract code snippets from section content
   */
  private extractCodeSnippets(content: string): CodeSnippet[] {
    const snippets: CodeSnippet[] = [];

    // Match code blocks with optional language specification
    const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)\n```/g;
    let match;
    let snippetIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'python'; // Default to Python
      const code = match[2].trim();

      if (code.length === 0) continue;

      // Determine if code is executable (not shell commands or comments only)
      const isExecutable = this.isExecutableCode(code, language);

      // Extract context from surrounding text
      const context = this.extractContext(content, match.index!);

      const snippet: CodeSnippet = {
        id: generateId(),
        originalCode: code,
        translatedCode: { [language]: code },
        isExecutable,
        context,
        lineStart: this.getLineNumber(content, match.index!),
        lineEnd: this.getLineNumber(content, match.index! + match[0].length)
      };

      snippets.push(snippet);
      snippetIndex++;
    }

    // Also extract inline code that might be executable
    const inlineCodeRegex = /`([^`\n]+)`/g;
    while ((match = inlineCodeRegex.exec(content)) !== null) {
      const code = match[1].trim();

      // Only include if it looks like executable code (contains assignment, function calls, etc.)
      if (this.isExecutableInlineCode(code)) {
        const context = this.extractContext(content, match.index!);

        const snippet: CodeSnippet = {
          id: generateId(),
          originalCode: code,
          translatedCode: { python: code },
          isExecutable: true,
          context
        };

        snippets.push(snippet);
      }
    }

    return snippets;
  }

  /**
   * Determine if code is executable
   */
  private isExecutableCode(code: string, language: string): boolean {
    // Skip shell commands and output examples
    if (code.startsWith('❯') || code.startsWith('$') || code.startsWith('>>>')) {
      return false;
    }

    // Skip if it's just comments
    const lines = code.split('\n').filter(line => line.trim());
    const nonCommentLines = lines.filter(line => {
      const trimmed = line.trim();
      return !trimmed.startsWith('#') && !trimmed.startsWith('//');
    });

    if (nonCommentLines.length === 0) {
      return false;
    }

    // Check for executable patterns
    const executablePatterns = [
      /=/, // Assignment
      /print\s*\(/, // Print statements
      /console\.log/, // Console.log
      /def\s+\w+/, // Function definitions
      /function\s+\w+/, // JS function definitions
      /class\s+\w+/, // Class definitions
      /if\s+/, // Conditionals
      /for\s+/, // Loops
      /while\s+/, // Loops
    ];

    return executablePatterns.some(pattern => pattern.test(code));
  }

  /**
   * Determine if inline code is executable
   */
  private isExecutableInlineCode(code: string): boolean {
    // Must contain assignment or function call
    return /=|\.|\(.*\)/.test(code) &&
           !code.includes(' ') || // Simple expressions like "x = 5"
           /\w+\s*=\s*\w+/.test(code); // Variable assignments
  }

  /**
   * Extract context from surrounding text
   */
  private extractContext(content: string, codeIndex: number): string {
    const beforeCode = content.slice(0, codeIndex);
    const lines = beforeCode.split('\n');

    // Get the last few lines before the code block
    const contextLines = lines.slice(-3).filter(line => line.trim());
    return contextLines.join(' ').slice(0, 200); // Limit context length
  }

  /**
   * Get line number for a character index
   */
  private getLineNumber(content: string, index: number): number {
    return content.slice(0, index).split('\n').length;
  }

  /**
   * Generate section ID from file path and index
   */
  private generateSectionId(filePath: string, index: number): string {
    const fileName = filePath.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'section';
    return `${fileName}-${index}`.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Find all markdown files in the book directory
   */
  private findMarkdownFiles(): string[] {
    const files: string[] = [];

    try {
      const entries = readdirSync(this.bookPath);

      for (const entry of entries) {
        const fullPath = join(this.bookPath, entry);
        const stat = statSync(fullPath);

        if (stat.isFile() && extname(entry).toLowerCase() === '.md') {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading book directory ${this.bookPath}:`, error);
    }

    return files.sort(); // Sort for consistent ordering
  }

  /**
   * Assign navigation links between sections
   */
  private assignNavigation(sections: TutorialSection[]): void {
    for (let i = 0; i < sections.length; i++) {
      if (i > 0) {
        sections[i].previousSection = sections[i - 1].id;
      }
      if (i < sections.length - 1) {
        sections[i].nextSection = sections[i + 1].id;
      }
    }
  }
}
