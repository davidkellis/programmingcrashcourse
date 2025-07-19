<template>
  <div class="tutorial-layout">
    <main class="tutorial-main">
      <div
        class="content-area"
        :style="contentAreaStyle"
      >
        <header class="tutorial-header">
          <div class="header-content">
            <h1 class="tutorial-title">Interactive Programming Tutorial</h1>
                    <div class="header-controls">
          <div class="toc-dropdown">
            <button
              class="toc-toggle"
              @click.stop="toggleTOC"
              :aria-label="isTOCVisible ? 'Hide Table of Contents' : 'Show Table of Contents'"
            >
              📚 Sections
            </button>
            <div v-if="isTOCVisible" class="toc-menu" @click.stop>
              <div
                v-for="section in sections"
                :key="section.id"
                class="toc-item"
                @click="navigateToSection(section.id)"
              >
                <span class="toc-number">{{ section.order }}</span>
                <span class="toc-title">{{ section.title }}</span>
              </div>
            </div>
          </div>
          <LanguageSelector
            :languages="SUPPORTED_LANGUAGES"
            :selected-language="uiState.selectedLanguage"
            @language-change="handleLanguageChange"
            :disabled="uiState.isLoading"
          />
          <button
            class="repl-toggle"
            @click="toggleREPLVisibility"
            :aria-label="uiState.isREPLVisible ? 'Hide REPL' : 'Show REPL'"
          >
            {{ uiState.isREPLVisible ? '🔽' : '🔼' }} REPL
          </button>
        </div>
          </div>
          <div v-if="uiState.error" class="error-banner">
            {{ uiState.error }}
            <button
              class="error-dismiss"
              @click="clearError"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        </header>

        <div class="content-wrapper">
          <RouterView @run-code="handleRunCode" />
        </div>
      </div>
    </main>

    <DockableREPL
      v-if="uiState.isREPLVisible"
      :session-id="replState.sessionId"
      :language="uiState.selectedLanguage"
      :history="replState.history"
      :variables="replState.variables"
      :is-executing="replState.isExecuting"
      @execute="handleCodeExecution"
      @toggle-visibility="toggleREPLVisibility"
      @position-change="handleREPLPositionChange"
    />

    <div v-if="uiState.isLoading" class="loading-overlay">
      <div class="loading-spinner">Loading...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { RouterView } from 'vue-router'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/constants'
import { languageRuntime } from '@/services/languageRuntime'
import { localContentService } from '@/services/localContentService'
import type { Language, UIState, REPLState, TutorialSection } from '@/types'
import LanguageSelector from './LanguageSelector.vue'
import DockableREPL from './DockableREPL.vue'

// State management
const uiState = ref<UIState>({
  selectedLanguage: null,
  currentSection: null,
  isREPLVisible: true,
  isLoading: false,
  error: null
})

const replState = ref<REPLState>({
  sessionId: null,
  isExecuting: false,
  history: [],
  currentInput: '',
  variables: {}
})

const router = useRouter()

const replLayout = ref({
  position: 'right' as 'bottom' | 'right',
  size: { width: 400, height: 300 }
})

// TOC state
const sections = ref<TutorialSection[]>([])
const isTOCVisible = ref(false)

// Computed properties
const contentAreaStyle = computed(() => ({
  paddingBottom: uiState.value.isREPLVisible && replLayout.value.position === 'bottom'
    ? `${replLayout.value.size.height + 20}px`
    : '1rem',
  paddingRight: uiState.value.isREPLVisible && replLayout.value.position === 'right'
    ? `${replLayout.value.size.width + 20}px`
    : '1rem'
}))

// Methods
const createREPLSession = async (language: Language) => {
  try {
    uiState.value.isLoading = true
    uiState.value.error = null

    // Create a new language runtime session
    const sessionId = await languageRuntime.createSession(language)

    replState.value = {
      ...replState.value,
      sessionId,
      history: [],
      variables: {}
    }

    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId)

  } catch (error) {
    console.error('Failed to create REPL session:', error)
    uiState.value.error = 'Failed to initialize code execution environment'
  } finally {
    uiState.value.isLoading = false
  }
}

const handleLanguageChange = async (language: Language) => {
  localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, language.id)
  uiState.value.selectedLanguage = language
  replState.value.sessionId = null
  await createREPLSession(language)
}

const handleCodeExecution = async (code: string) => {
  if (!replState.value.sessionId || !uiState.value.selectedLanguage) {
    uiState.value.error = 'No active session'
    throw new Error('No active session')
  }

  try {
    replState.value.isExecuting = true
    uiState.value.error = null

    // Execute code using the language runtime
    const result = await languageRuntime.executeCode(
      code,
      uiState.value.selectedLanguage,
      replState.value.sessionId
    )

    // Create execution record
    const executionRecord = {
      id: `exec_${Date.now()}`,
      timestamp: new Date(),
      input: code,
      inputLines: parseInputLines(code),
      output: result.output || '',
      error: result.error,
      executionTime: result.executionTime
    }

    replState.value.history.push(executionRecord)
    replState.value.currentInput = ''

    // Update variables from the execution result
    if (result.variables) {
      replState.value.variables = { ...replState.value.variables, ...result.variables }
    }

    return result

  } catch (error) {
    console.error('Code execution failed:', error)
    uiState.value.error = 'Code execution failed. Please try again.'
    throw error
  } finally {
    replState.value.isExecuting = false
  }
}

const toggleREPLVisibility = () => {
  uiState.value.isREPLVisible = !uiState.value.isREPLVisible
}

const handleREPLPositionChange = (position: 'bottom' | 'right', size: { width: number; height: number }) => {
  replLayout.value = { position, size }
}

const clearError = () => {
  uiState.value.error = null
}

const toggleTOC = () => {
  isTOCVisible.value = !isTOCVisible.value
}

const navigateToSection = (sectionId: string) => {
  isTOCVisible.value = false
  router.push(`/section/${sectionId}`)
}

// Close TOC when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.toc-dropdown')) {
    isTOCVisible.value = false
  }
}

const loadSections = async () => {
  try {
    const sectionsData = await localContentService.getAllSections('python')
    sections.value = sectionsData
  } catch (error) {
    console.error('Failed to load sections:', error)
  }
}

const handleRunCode = async (code: string) => {
  try {
    // Execute the code in the REPL
    await handleCodeExecution(code)
  } catch (error) {
    console.error('Failed to run code example:', error)
  }
}

const parseInputLines = (code: string): Array<{ prompt: string; text: string }> => {
  const lines = code.split('\n')
  return lines.map((line, index) => ({
    prompt: index === 0 ? '>>> ' : '... ',
    text: line
  }))
}

// Initialize language selection and load sections
onMounted(async () => {
  const savedLanguage = localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE)
  const language = savedLanguage
    ? SUPPORTED_LANGUAGES.find(lang => lang.id === savedLanguage) || DEFAULT_LANGUAGE
    : DEFAULT_LANGUAGE

  uiState.value.selectedLanguage = language

  // Load sections for TOC
  await loadSections()

  // Add click outside handler for TOC
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Create REPL session when language changes
watch(() => uiState.value.selectedLanguage, (newLanguage) => {
  if (newLanguage && !replState.value.sessionId) {
    createREPLSession(newLanguage)
  }
})
</script>

<style scoped>
.tutorial-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  max-width: 100vw;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  box-sizing: border-box;
}

.tutorial-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  position: sticky;
  top: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  width: 100%;
  box-sizing: border-box;
}

.tutorial-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toc-dropdown {
  position: relative;
}

.toc-toggle {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.toc-toggle:hover {
  background: #5a6268;
}

.toc-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 250px;
  max-height: 400px;
  overflow-y: auto;
}

.toc-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f8f9fa;
}

.toc-item:hover {
  background: #f8f9fa;
}

.toc-item:last-child {
  border-bottom: none;
}

.toc-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: #10b981;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.toc-title {
  font-size: 0.875rem;
  color: #2c3e50;
  font-weight: 500;
}

.repl-toggle {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.repl-toggle:hover {
  background: #0056b3;
}

.error-banner {
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5c6cb;
}

.error-dismiss {
  background: none;
  border: none;
  color: #721c24;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  margin-left: 1rem;
}

.tutorial-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  max-width: 100vw;
  min-width: 0;
  min-height: 0;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  margin: 0;
  position: relative;
  min-width: 0;
  min-height: 0;
}

.content-wrapper {
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .tutorial-title {
    font-size: 1.25rem;
  }

  .content-wrapper {
    padding: 0.5rem;
  }
}
</style>
