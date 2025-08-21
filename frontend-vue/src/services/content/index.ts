import { PYTHON_TUTORIAL_SECTIONS } from './python'
import { JAVASCRIPT_TUTORIAL_SECTIONS } from './javascript'
import { TYPESCRIPT_TUTORIAL_SECTIONS } from './typescript'
import { RUBY_TUTORIAL_SECTIONS } from './ruby'
import type { TutorialSection } from '@/types'

export const LANGUAGE_CONTENT: Record<string, TutorialSection[]> = {
  python: PYTHON_TUTORIAL_SECTIONS,
  javascript: JAVASCRIPT_TUTORIAL_SECTIONS,
  typescript: TYPESCRIPT_TUTORIAL_SECTIONS,
  ruby: RUBY_TUTORIAL_SECTIONS
}

export function getContentForLanguage(languageId: string): TutorialSection[] {
  return LANGUAGE_CONTENT[languageId] || PYTHON_TUTORIAL_SECTIONS
}
