<template>
  <div class="tutorial-layout" :class="[`dock-${replLayout.position}`]">
    <main class="tutorial-main">
      <div class="grid-container" :style="gridStyle">
        <!-- Content Pane -->
        <div class="content-pane">
          <header class="tutorial-header">
            <div class="header-content three-col">
              <div class="header-left">
                <h1 class="tutorial-title">
                  <RouterLink
                    class="brand"
                    :to="{ name: 'section', params: { language: (route.params.language as string) || uiState.selectedLanguage?.id || DEFAULT_LANGUAGE.id, sectionId: 'introduction' } }"
                  >
                    <img src="/favicon.png" alt="" class="brand-icon" aria-hidden="true" />
                    Programming Crash Course
                  </RouterLink>
                </h1>
              </div>
              <div class="header-center">
                <div class="nav-group">
                <button
                  class="nav-button prev"
                  @click="navigateToPrevious"
                  :disabled="!previousSection"
                  :aria-label="previousSection ? `Go to ${previousSection.title}` : 'No previous section'"
                >
                  ← Previous
                </button>
                <div class="toc-dropdown">
                  <button class="toc-toggle" @click.stop="toggleTOC" :aria-label="isTOCVisible ? 'Hide Table of Contents' : 'Show Table of Contents'">
                    📚 {{ currentSectionTitle || 'Sections' }}
                  </button>
                  <div v-if="isTOCVisible" class="toc-menu" @click.stop>
                    <div v-for="section in orderedSections" :key="section.id" class="toc-item" @click="navigateToSection(section.id)" :class="{ active: section.id === currentSectionId }">
                      <span class="toc-number">{{ section.order }}</span>
                      <span class="toc-title">{{ section.title }}</span>
                    </div>
                  </div>
                </div>
                <button
                  class="nav-button next"
                  @click="navigateToNext"
                  :disabled="!nextSection"
                  :aria-label="nextSection ? `Go to ${nextSection.title}` : 'No next section'"
                >
                  Next →
                </button>
                </div>
              </div>
              <div class="header-right">
                <LanguageSelector :languages="SUPPORTED_LANGUAGES" :selected-language="uiState.selectedLanguage" @language-change="handleLanguageChange" :disabled="uiState.isLoading" />
              </div>
            </div>
            <div v-if="uiState.error" class="error-banner">
              {{ uiState.error }}
              <button class="error-dismiss" @click="clearError" aria-label="Dismiss error">✕</button>
            </div>
          </header>

          <div class="content-wrapper">
            <div class="inner-centered">
              <RouterView v-slot="{ Component, route: r }">
                <component
                  :is="Component"
                  v-bind="r.params"
                  :current-language="uiState.selectedLanguage?.id"
                  @run-code="handleRunCode"
                  @run-code-sequence="handleRunCodeSequence"
                />
              </RouterView>
            </div>
          </div>
        </div>

        <!-- REPL Pane (as grid cell) -->
        <div v-if="uiState.isREPLVisible" class="repl-pane">
          <DockableREPL
            :session-id="replState.sessionId"
            :language="uiState.selectedLanguage"
            :history="replState.history"
            :variables="replState.variables"
            :is-executing="replState.isExecuting"
            :last-executed-code="replState.lastExecutedCode"
            :as-pane="true"
            @execute="handleCodeExecution"
            @toggle-visibility="toggleREPLVisibility"
            @position-change="handleREPLPositionChange"
          />
        </div>
      </div>

      <div v-if="uiState.isLoading" class="loading-overlay">
        <div class="loading-spinner">Loading...</div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { SUPPORTED_LANGUAGES, STORAGE_KEYS, DEFAULT_LANGUAGE } from '@/constants'
import { languageRuntime } from '@/services/languageRuntime'
import { localContentService } from '@/services/localContentService'
import type { Language, UIState, REPLState, TutorialSection } from '@/types'
import LanguageSelector from './LanguageSelector.vue'
import DockableREPL from './DockableREPL.vue'

const uiState = ref<UIState>({ selectedLanguage: null, currentSection: null, isREPLVisible: true, isLoading: false, error: null })
const replState = ref<REPLState & { lastExecutedCode?: string }>({ sessionId: null, isExecuting: false, history: [], currentInput: '', variables: {}, lastExecutedCode: undefined })
const router = useRouter()
const route = useRoute()

const replLayout = ref({ position: 'right' as 'bottom' | 'right', size: { width: 400, height: 300 } })

// Grid style: true two-pane layout with content centered in its pane
const gridStyle = computed(() => {
  if (!uiState.value.isREPLVisible) {
    return { gridTemplateColumns: '1fr', gridTemplateRows: '100%' }
  }
  if (replLayout.value.position === 'right') {
    const replW = Math.max(0, replLayout.value.size.width || 0)
    // Ensure the content track never collapses, even on narrow viewports
    // Content gets at least 320px, REPL can shrink down to 0 if needed
    return { gridTemplateColumns: `minmax(320px, 1fr) minmax(0, ${replW}px)`, gridTemplateRows: '100%' }
  }
  // Bottom dock: two rows
  return { gridTemplateColumns: '1fr', gridTemplateRows: `1fr ${replLayout.value.size.height}px` }
})

const sections = ref<TutorialSection[]>([])
const orderedSections = computed(() => {
  return [...sections.value].sort((a, b) => a.order - b.order)
})
const isTOCVisible = ref(false)

// Current section tracking
const currentSectionId = computed(() => {
  const route = router.currentRoute.value
  return route.params.sectionId as string || 'introduction'
})

const currentSection = computed(() => {
  return sections.value.find(section => section.id === currentSectionId.value)
})

const currentSectionTitle = computed(() => {
  return currentSection.value?.title || 'Sections'
})

const previousSection = computed(() => {
  const current = currentSection.value
  if (!current?.previousSection) return null
  return sections.value.find(section => section.id === current.previousSection)
})

const nextSection = computed(() => {
  const current = currentSection.value
  if (!current?.nextSection) return null
  return sections.value.find(section => section.id === current.nextSection)
})

const createREPLSession = async (language: Language) => {
  try {
    uiState.value.isLoading = true
    uiState.value.error = null
    const sessionId = await languageRuntime.createSession(language)
    replState.value = { ...replState.value, sessionId, history: [], variables: {} }
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId)
  } catch (error) {
    console.error('Failed to create REPL session:', error)
    uiState.value.error = 'Failed to initialize code execution environment'
  } finally {
    uiState.value.isLoading = false
  }
}

const handleLanguageChange = async (languageOrNull: Language | null) => {
  // If toggled off, hide REPL and clear session
  if (!languageOrNull) {
    uiState.value.selectedLanguage = null
    uiState.value.isREPLVisible = false
    replState.value.sessionId = null
    localStorage.removeItem(STORAGE_KEYS.SELECTED_LANGUAGE)
    return
  }

  const language = languageOrNull
  localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, language.id)
  uiState.value.selectedLanguage = language
  uiState.value.isREPLVisible = true
  replState.value.sessionId = null
  await loadSections()
  await createREPLSession(language)
  // Navigate to the same section under the new language
  const sect = currentSectionId.value || 'introduction'
  router.push({ name: 'section', params: { language: language.id, sectionId: sect } })
}

const handleCodeExecution = async (code: string) => {
  if (!replState.value.sessionId || !uiState.value.selectedLanguage) {
    uiState.value.error = 'No active session'
    throw new Error('No active session')
  }
  try {
    replState.value.isExecuting = true
    uiState.value.error = null
    const result = await languageRuntime.executeCode(code, uiState.value.selectedLanguage, replState.value.sessionId)
    const executionRecord = { id: `exec_${Date.now()}`, timestamp: new Date(), input: code, inputLines: parseInputLines(code), output: result.output || '', error: result.error, executionTime: result.executionTime }
    replState.value.history.push(executionRecord)
    replState.value.currentInput = ''
    
    // Store the last executed code for up arrow functionality
    replState.value.lastExecutedCode = code
    console.log('Stored last executed code for up arrow:', code)
    
    if (result.variables) replState.value.variables = { ...replState.value.variables, ...result.variables }
    return result
  } catch (error) {
    console.error('Code execution failed:', error)
    uiState.value.error = 'Code execution failed. Please try again.'
    throw error
  } finally {
    replState.value.isExecuting = false
  }
}

const toggleREPLVisibility = () => { uiState.value.isREPLVisible = !uiState.value.isREPLVisible }
const handleREPLPositionChange = (position: 'bottom' | 'right', size: { width: number; height: number }) => { replLayout.value = { position, size } }
const clearError = () => { uiState.value.error = null }
const toggleTOC = () => { isTOCVisible.value = !isTOCVisible.value }
const navigateToSection = (sectionId: string) => {
  isTOCVisible.value = false
  const lang = (route.params.language as string) || uiState.value.selectedLanguage?.id || DEFAULT_LANGUAGE.id
  router.push({ name: 'section', params: { language: lang, sectionId } })
}
const navigateToPrevious = () => { if (previousSection.value) navigateToSection(previousSection.value.id) }
const navigateToNext = () => { if (nextSection.value) navigateToSection(nextSection.value.id) }

const handleClickOutside = (event: Event) => { const target = event.target as HTMLElement; if (!target.closest('.toc-dropdown')) isTOCVisible.value = false }

const loadSections = async () => {
  try {
    const languageId = uiState.value.selectedLanguage?.id || 'python'
    sections.value = await localContentService.getAllSections(languageId)
  } catch (error) {
    console.error('Failed to load sections:', error)
  }
}

const handleRunCode = async (code: string) => { try { await handleCodeExecution(code) } catch (error) { console.error('Failed to run code example:', error) } }

type RunCodeSequencePayload = { codes: string[]; continueOnError?: boolean; groupId?: string; title?: string }
const handleRunCodeSequence = async (payload: RunCodeSequencePayload) => {
  const { codes, continueOnError = false } = payload || { codes: [] }
  if (!codes || codes.length === 0) return
  for (const code of codes) {
    try {
      await handleCodeExecution(code)
    } catch (err) {
      console.error('Failed during group execution:', err)
      if (!continueOnError) break
    }
  }
}
const parseInputLines = (code: string): Array<{ prompt: string; text: string }> => {
  const lines = code.split('\n')
  return lines.map((line, index) => ({ 
    prompt: index === 0 ? '>>> ' : '... ', 
    text: line // Preserve original whitespace including leading/trailing spaces
  }))
}

onMounted(async () => {
  const routeLang = route.params.language as string | undefined
  let selected: Language | undefined
  if (routeLang) {
    selected = SUPPORTED_LANGUAGES.find(l => l.id === routeLang)
  }
  if (!selected) {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE) || undefined
    if (savedLanguage) selected = SUPPORTED_LANGUAGES.find(l => l.id === savedLanguage)
  }
  if (!selected) {
    selected = DEFAULT_LANGUAGE
  }

  if (selected) {
    uiState.value.selectedLanguage = selected
    uiState.value.isREPLVisible = true
    localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, selected.id)
    await loadSections()
    await createREPLSession(selected)
    if (!routeLang) {
      // Ensure URL reflects selected language
      const sect = currentSectionId.value || 'introduction'
      router.replace({ name: 'section', params: { language: selected.id, sectionId: sect } })
    }
  }

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => { document.removeEventListener('click', handleClickOutside) })
watch(() => uiState.value.selectedLanguage, (newLanguage) => { if (newLanguage && !replState.value.sessionId) createREPLSession(newLanguage) })

// Keep selected language in sync with route changes
watch(
  () => route.params.language,
  async (newLang) => {
    if (typeof newLang !== 'string') return
    const match = SUPPORTED_LANGUAGES.find(l => l.id === newLang)
    if (!match) return
    if (uiState.value.selectedLanguage?.id !== match.id) {
      uiState.value.selectedLanguage = match
      uiState.value.isREPLVisible = true
      localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, match.id)
      await loadSections()
      await createREPLSession(match)
    }
  },
  { immediate: false }
)
</script>

<style scoped>
.tutorial-layout { display: flex; flex-direction: column; height: 100vh; width: 100%; background-color: #f8f9fa; margin: 0; padding: 0; overflow: hidden; box-sizing: border-box; }

.tutorial-main { flex: 1; display: flex; flex-direction: column; width: 100%; min-width: 0; min-height: 0; }
.grid-container {
  display: grid;
  width: 100%;
  height: 100%;
  /* Safer default so content doesn't collapse before inline style applies */
  grid-template-columns: minmax(320px, 1fr) minmax(0, 1fr);
}

/* Place content and REPL in specific grid cells */
.dock-right .content-pane { grid-column: 1; grid-row: 1; overflow: auto; min-height: 0; min-width: 0; position: relative; }
.dock-right .repl-pane { grid-column: 2; grid-row: 1; }

.dock-bottom .content-pane { grid-column: 1; grid-row: 1; overflow: auto; min-height: 0; min-width: 0; position: relative; }
.dock-bottom .repl-pane { grid-column: 1; grid-row: 2; }

/* Content centering and sizing */
.content-wrapper { padding: 1rem; box-sizing: border-box; width: 100%; }
.inner-centered { width: 100%; }

/* REPL pane fills its grid cell */
.repl-pane { display: flex; height: 100%; width: 100%; min-width: 0; }

/* Header and misc styles */
.tutorial-header { background: white; border-bottom: 1px solid #e9ecef; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); z-index: 1100; position: sticky; top: 0; }
.header-content { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; width: 100%; box-sizing: border-box; }
.three-col { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
.header-left { justify-self: start; }
.header-center { justify-self: center; }
.header-right { justify-self: end; }
.tutorial-title { margin: 0; font-size: 1.5rem; font-weight: 600; color: #2c3e50; }
.brand { display: inline-flex; align-items: center; gap: 0.5rem; color: inherit; text-decoration: none; }
.brand-icon { width: 24px; height: 24px; border-radius: 4px; display: inline-block; }
.nav-group { display: inline-flex; align-items: center; gap: 0.5rem; }

.nav-button { background: #28a745; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; font-weight: 600; min-height: 36px; line-height: 1; display: inline-flex; align-items: center; }
.nav-button:hover:not(:disabled) { background: #218838; transform: translateY(-1px); }
.nav-button:disabled { background: #6c757d; cursor: not-allowed; opacity: 0.6; }
.nav-button.prev { margin-right: 0.25rem; }
.nav-button.next { margin-left: 0.25rem; }

.toc-dropdown { position: relative; }
.toc-toggle { background: #e9ecef; color: #2c3e50; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem; transition: background-color 0.2s, transform 0.2s; font-weight: 600; min-height: 36px; line-height: 1; display: inline-flex; align-items: center; border:#218838 1px solid; }
.toc-toggle:hover { background: #dfe3e6; transform: translateY(-1px); }
.toc-menu { position: absolute; top: 100%; left: 0; background: white; border: 1px solid #e9ecef; border-radius: 4px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 1000; min-width: 250px; max-height: 400px; overflow-y: auto; }
.toc-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; cursor: pointer; transition: background-color 0.2s; border-bottom: 1px solid #f8f9fa; }
.toc-item:hover { background: #f8f9fa; }
.toc-item.active { background: #e3f2fd; border-left: 3px solid #007bff; }
.toc-item.active .toc-number { background: #007bff; }
.toc-item.active .toc-title { color: #007bff; font-weight: 600; }
.toc-item:last-child { border-bottom: none; }
.toc-number { display: flex; align-items: center; justify-content: center; width: 1.5rem; height: 1.5rem; background: #10b981; color: white; border-radius: 50%; font-size: 0.75rem; font-weight: 600; flex-shrink: 0; }
.toc-title { font-size: 0.875rem; color: #2c3e50; font-weight: 500; }
.repl-toggle { background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; transition: background-color 0.2s; }
.repl-toggle:hover { background: #0056b3; }
.error-banner { background: #f8d7da; color: #721c24; padding: 0.75rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f5c6cb; }
.error-dismiss { background: none; border: none; color: #721c24; cursor: pointer; font-size: 1.2rem; padding: 0; margin-left: 1rem; }

.loading-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.loading-spinner { background: white; padding: 2rem; border-radius: 8px; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }

@media (max-width: 768px) {
  .header-content { padding: 1rem; flex-direction: column; gap: 1rem; }
  .tutorial-title { font-size: 1.25rem; }
  .content-wrapper { padding: 0.5rem; }
}
</style>
