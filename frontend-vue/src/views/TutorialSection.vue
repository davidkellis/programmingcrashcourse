<template>
  <div class="tutorial-section">
    <div class="section-header">
      <h1>{{ sectionTitle }}</h1>
      <div class="section-navigation">
        <button
          v-if="previousSection"
          @click="navigateToSection(previousSection)"
          class="nav-button prev"
        >
          ← Previous
        </button>
        <button
          v-if="nextSection"
          @click="navigateToSection(nextSection)"
          class="nav-button next"
        >
          Next →
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-message">
      Loading section...
    </div>

    <div v-else-if="error" class="error-message">
      <h2>Error Loading Section</h2>
      <p>{{ error }}</p>
      <button @click="loadSection" class="retry-button">Try Again</button>
    </div>

    <div v-else-if="section" class="section-content">
      <div class="content-text" v-html="renderMarkdown(section.content)"></div>

      <div v-if="section.codeSnippets.length > 0" class="code-snippets">
        <h3>Code Examples</h3>
        <div
          v-for="snippet in section.codeSnippets"
          :key="snippet.id"
          class="code-example"
        >
          <div class="code-header">
            <span class="code-context">{{ snippet.context }}</span>
            <button @click="runCodeExample(snippet.code)" class="run-button">
              Run Example
            </button>
          </div>
          <pre><code>{{ snippet.code }}</code></pre>
          <p v-if="snippet.explanation" class="code-explanation">
            {{ snippet.explanation }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { localContentService } from '@/services/localContentService'
import type { TutorialSection } from '@/types'
import MarkdownIt from 'markdown-it'

interface Props {
  sectionId: string
}

const props = defineProps<Props>()
const router = useRouter()

// Section state
const section = ref<TutorialSection | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const codeBlocks = ref<Record<string, string>>({})

// Initialize markdown-it with custom renderer for code blocks
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// Custom renderer for code blocks to make them interactive
const originalFence = md.renderer.rules.fence
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const language = token.info || ''
  const code = token.content

  const codeId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  codeBlocks.value[codeId] = code

  return `
    <div class="code-example">
      <div class="code-header">
        <span class="code-context">${language || 'code'} example</span>
        <button data-code-id="${codeId}" class="run-button">
          Run Example
        </button>
      </div>
      <pre><code>${code}</code></pre>
    </div>
  `
}

const sectionTitle = computed(() => section.value?.title || 'Tutorial Section')

const previousSection = computed(() => section.value?.previousSection || null)
const nextSection = computed(() => section.value?.nextSection || null)

const navigateToSection = (sectionId: string) => {
  router.push(`/section/${sectionId}`)
}

const loadSection = async () => {
  try {
    isLoading.value = true
    error.value = null

    const sectionData = await localContentService.getSection(props.sectionId, 'python')
    if (sectionData) {
      section.value = sectionData
    } else {
      error.value = 'Section not found'
    }
  } catch (err) {
    console.error('Failed to load section:', err)
    error.value = 'Failed to load section'
  } finally {
    isLoading.value = false
  }
}

const emit = defineEmits<{
  'run-code': [code: string]
}>()

const runCodeExample = (code: string) => {
  // Emit the code to be executed in the REPL
  emit('run-code', code)
}

const renderMarkdown = (content: string): string => {
  // Use markdown-it to render markdown with custom code block handling
  return md.render(content)
}

onMounted(() => {
  loadSection()

  // Add event listener for code block buttons
  document.addEventListener('click', handleCodeBlockClick)
})

onUnmounted(() => {
  // Remove event listener
  document.removeEventListener('click', handleCodeBlockClick)
})

// Watch for route changes to reload section content
watch(() => props.sectionId, (newSectionId) => {
  if (newSectionId) {
    loadSection()
  }
})

const handleCodeBlockClick = (event: Event) => {
  const target = event.target as HTMLElement
  if (target.classList.contains('run-button') && target.hasAttribute('data-code-id')) {
    const codeId = target.getAttribute('data-code-id')!
    const code = codeBlocks.value[codeId]
    if (code) {
      runCodeExample(code)
    }
  }
}
</script>

<style scoped>
.tutorial-section {
  width: 100vw;
  margin: 0;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.section-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.section-navigation {
  display: flex;
  gap: 1rem;
}

.nav-button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background: #2563eb;
}

.nav-button.prev {
  background: #6b7280;
}

.nav-button.prev:hover {
  background: #4b5563;
}

.section-content {
  max-width: 800px;
  margin: 0 auto;
}

.loading-message {
  text-align: center;
  color: #6b7280;
  font-size: 1.125rem;
  padding: 2rem;
}

.error-message {
  text-align: center;
  color: #dc2626;
  padding: 2rem;
}

.error-message h2 {
  margin-bottom: 1rem;
}

.retry-button {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.retry-button:hover {
  background: #2563eb;
}

.content-text {
  line-height: 1.6;
  color: #374151;
}

.content-text h1,
.content-text h2,
.content-text h3 {
  color: #1f2937;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.content-text h1 {
  font-size: 2rem;
  font-weight: 700;
}

.content-text code {
  background: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.code-snippets {
  margin-top: 3rem;
}

.code-snippets h3 {
  margin-bottom: 1.5rem;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
}

.code-context {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.code-explanation {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.content-text h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.content-text h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 1.5rem 0 0.5rem 0;
}

.content-text p {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.code-example {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1.5rem 0;
}

.code-example pre {
  background: #1f2937;
  color: #e5e7eb;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin: 0 0 1rem 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
}

.run-button {
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.run-button:hover {
  background: #059669;
}
</style>
