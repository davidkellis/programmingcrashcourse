<template>
  <div class="tutorial-section">
    <div class="section-header">
      <h1>{{ sectionTitle }}</h1>
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
          <div class="code-toolbar">
            <button @click="runCodeExample(snippet.code)" class="run-button">
              Run
            </button>
            <span class="code-context">{{ snippet.context }}</span>
          </div>
          <pre class="code-pre"><code>{{ snippet.code }}</code></pre>
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
  currentLanguage?: string
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
  typographer: true,
  breaks: true
})

// Custom renderer for code blocks to make them interactive
const originalFence = md.renderer.rules.fence
md.renderer.rules.fence = (tokens: any[], idx: number) => {
  const token = tokens[idx]
  const language = token.info || ''
  const code = token.content

  const codeId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  codeBlocks.value[codeId] = code

  const label = language ? `${language} REPL` : 'Code'

  return `
    <div class="code-example">
      <div class="code-toolbar">
        <button data-code-id="${codeId}" class="run-button">Run</button>
        <span class="code-context">${label}</span>
      </div>
      <pre class="code-pre"><code>${code}</code></pre>
    </div>
  `
}

const sectionTitle = computed(() => section.value?.title || 'Tutorial Section')



const loadSection = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Get the current language from props or default to python
    const currentLanguage = props.currentLanguage || 'python'
    const sectionData = await localContentService.getSection(props.sectionId, currentLanguage)
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

// Watch for language changes to reload section content
watch(() => props.currentLanguage, () => {
  if (props.sectionId) {
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
  width: 100%;
  margin: 0;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  background: #fbfbfc;
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





.section-content { max-width: 760px; margin: 0 auto; }
.content-wrapper-centered {
  display: flex;
  justify-content: center;
}

.loading-message { text-align: center; color: #6b7280; font-size: 1.125rem; padding: 2rem; }

.error-message { text-align: center; color: #dc2626; padding: 2rem; }
.error-message h2 { margin-bottom: 1rem; }

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
.retry-button:hover { background: #2563eb; }

/* Typography to mirror pamphlet look */
.content-text { line-height: 1.8; color: #1f2937; font-size: 1.06rem; }

/* Headings inside v-html */
.content-text :deep(h1) { font-size: 2rem; font-weight: 700; color: #111827; margin: 2rem 0 0.75rem; }
.content-text :deep(h2) { font-size: 1.75rem; font-weight: 700; color: #111827; margin: 2rem 0 0.75rem; }
.content-text :deep(h3) { font-size: 1.35rem; font-weight: 600; color: #111827; margin: 1.5rem 0 0.5rem; }

/* Paragraphs and lists */
.content-text :deep(p) { margin: 0.35rem 0 0.9rem; }
.content-text :deep(ul) { list-style: disc; padding-left: 1.6rem; margin: 0.25rem 0 0.9rem; }
.content-text :deep(ul ul) { list-style: circle; padding-left: 1.25rem; margin-top: 0.25rem; }
.content-text :deep(li) { margin: 0.2rem 0; }
.content-text :deep(li::marker) { color: #2563eb; }
.content-text :deep(ul ul li::marker) { color: #60a5fa; }

/* Inline code (not code blocks) */
.content-text :deep(p code),
.content-text :deep(li code) {
  background: #fff5f5;
  border: 1px solid #fde2e2;
  color: #1f2937;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
  font-size: 0.95em;
}

/* Code cards (rendered fences via v-html and snippet list) */
.content-text :deep(.code-example),
.code-example {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 1px rgba(0,0,0,0.02);
  margin: 1rem 0 1.5rem 0;
  overflow: hidden;
}

.content-text :deep(.code-toolbar),
.code-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.8rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.content-text :deep(.code-context),
.code-context { font-size: 0.875rem; color: #6b7280; font-weight: 600; }

.content-text :deep(.code-pre),
.code-pre {
  background: #f3f4f6;
  color: #111827;
  padding: 1rem;
  margin: 0;
  border-radius: 0 0 0.5rem 0.5rem;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
}

.content-text :deep(.code-explanation),
.code-explanation {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.content-text :deep(.run-button),
.run-button {
  padding: 0.4rem 0.9rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.content-text :deep(.run-button:hover),
.run-button:hover { background: #059669; }

.code-snippets { margin-top: 2.5rem; }
.code-snippets h3 { margin-bottom: 1rem; }
</style>
