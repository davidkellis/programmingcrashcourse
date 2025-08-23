<template>
  <div class="tutorial-section">
    <div class="section-header">
      <h1>{{ sectionTitle }}</h1>
    </div>

    <div v-if="isLoading" class="loading-message">Loading section...</div>

    <div v-else-if="error" class="error-message">
      <h2>Error Loading Section</h2>
      <p>{{ error }}</p>
      <button @click="loadSection" class="retry-button">Try Again</button>
    </div>

    <div v-else-if="section" class="section-content">
      <div class="content-text" v-html="renderMarkdown(section.content)" ref="contentRef"></div>

      <div v-if="section.codeSnippets.length > 0" class="code-snippets">
        <h3>Code Examples</h3>
        <div v-for="snippet in section.codeSnippets" :key="snippet.id" class="code-example">
          <div class="code-toolbar">
            <button @click="runCodeExample(snippet.code)" class="run-button">Run</button>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick, createApp } from 'vue'
import { localContentService } from '@/services/localContentService'
import type { TutorialSection } from '@/types'
import MarkdownIt from 'markdown-it'
import AceCodeBlock from '@/components/AceCodeBlock.vue'

interface Props {
  sectionId: string
  currentLanguage?: string
}

const props = defineProps<Props>()

// Section state
const section = ref<TutorialSection | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const codeBlocks = ref<Record<string, string>>({})
const contentRef = ref<HTMLElement>()
// Keep track of dynamically mounted Ace editors so we can clean them up
type MountedAce = { unmount: () => void; el: HTMLElement }
const mountedAceBlocks = ref<MountedAce[]>([])

// Lazy Markdown-It initialization to avoid TDZ issues
let mdInstance: MarkdownIt | null = null
const getMarkdown = (): MarkdownIt => {
  if (mdInstance) return mdInstance

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
  })

  type RendererRules = { fence?: (tokens: Array<{ info: string; content: string }>, idx: number) => string; code_inline?: (tokens: Array<{ content: string }>, idx: number) => string }

  ;(md.renderer.rules as RendererRules).code_inline = (tokens: Array<{ content: string }>, idx: number) => {
    const token = tokens[idx]
    if (!token) return ''
    const code = token.content
    const escapeHtml = (str: string) => str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;')

    // Opt-out directive for inline run button
    // Author can write `norun:...` (or `nr:...`) inside the backticks to render
    // plain inline code without an attached Run button. The directive is stripped
    // from the displayed text.
    const noRunPrefixes = ['norun:', 'no-run:', 'nr:']
    for (const prefix of noRunPrefixes) {
      if (code.startsWith(prefix)) {
        const display = code.slice(prefix.length).trim()
        return `<code>${escapeHtml(display)}</code>`
      }
    }

    const codeId = `inline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    codeBlocks.value[codeId] = code

    const safeCode = escapeHtml(code)
    // return `<span class="inline-code-wrapper"><code>${safeCode}</code><button class="inline-run-button" data-code-id="${codeId}" title="Run">➤</button></span>`
    return `<span class=\"inline-code-wrapper\"><code>${safeCode}</code><button class=\"inline-run-button\" data-code-id=\"${codeId}\" title=\"Run\">➤</button></span>`
  }

  md.renderer.rules.fence = (tokens: Array<{ info: string; content: string }>, idx: number) => {
    const token = tokens[idx]
    if (!token) return ''
    const language = token.info || ''
    const code = token.content

    const codeId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    codeBlocks.value[codeId] = code

    return `<div class="ace-code-block-placeholder" data-code-id="${codeId}" data-language="${language}" data-code="${encodeURIComponent(code)}"></div>`
  }

  mdInstance = md
  return md
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
  return getMarkdown().render(content)
}

// Process Ace code block placeholders after markdown rendering by mounting
// an AceCodeBlock inline at each placeholder location
const clearMountedAceBlocks = () => {
  mountedAceBlocks.value.forEach(({ unmount, el }) => {
    try { unmount() } catch {}
    try { el.remove() } catch {}
  })
  mountedAceBlocks.value = []
}

const processAceCodeBlocks = () => {
  if (!contentRef.value) return
  clearMountedAceBlocks()

  const placeholders = contentRef.value.querySelectorAll('.ace-code-block-placeholder')

  Array.from(placeholders).forEach((placeholder) => {
    const codeId = placeholder.getAttribute('data-code-id')
    const language = placeholder.getAttribute('data-language') || 'text'
    const encodedCode = placeholder.getAttribute('data-code')

    if (codeId && encodedCode) {
      const code = decodeURIComponent(encodedCode)

      const mountEl = document.createElement('div')
      // Replace the placeholder with our mount point
      placeholder.parentNode?.replaceChild(mountEl, placeholder)

      const app = createApp(AceCodeBlock, {
        code,
        language,
        onRunCode: runCodeExample,
      })
      app.mount(mountEl)

      mountedAceBlocks.value.push({ unmount: () => app.unmount(), el: mountEl })
    }
  })
}

onMounted(() => {
  loadSection()

  // Add event listener for code block buttons
  document.addEventListener('click', handleCodeBlockClick)
})

// Watch for content changes to process Ace code blocks
watch(
  () => section.value?.content,
  () => {
    nextTick(() => {
      processAceCodeBlocks()
    })
  },
)

onUnmounted(() => {
  // Remove event listener
  document.removeEventListener('click', handleCodeBlockClick)
  clearMountedAceBlocks()
})

// Watch for route changes to reload section content
watch(
  () => props.sectionId,
  (newSectionId) => {
    if (newSectionId) {
      loadSection()
    }
  },
)

// Watch for language changes to reload section content
watch(
  () => props.currentLanguage,
  () => {
    if (props.sectionId) {
      loadSection()
    }
  },
)

const handleCodeBlockClick = (event: Event) => {
  const target = event.target as HTMLElement

  // Handle regular code block run buttons
  if (target.classList.contains('run-button') && target.hasAttribute('data-code-id')) {
    const codeId = target.getAttribute('data-code-id')!
    const code = codeBlocks.value[codeId]
    if (code) {
      runCodeExample(code)
    }
  }

  // Handle inline code run buttons
  if (target.classList.contains('inline-run-button') && target.hasAttribute('data-code-id')) {
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
  padding-bottom: 0.25rem;
  border-bottom: 2px solid #e5e7eb;
  max-width: 920px;
  margin: 0 auto 1rem auto;
}

.section-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.section-content {
  max-width: 920px;
  margin: 0 auto;
}
.content-wrapper-centered {
  display: flex;
  justify-content: center;
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

/* Typography to mirror pamphlet look */
.content-text {
  line-height: 1.8;
  color: #1f2937;
  font-size: 1.2rem;
}

/* Headings inside v-html */
.content-text :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 2rem 0 0.75rem;
}
.content-text :deep(h2) {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 2rem 0 0.75rem;
}
.content-text :deep(h3) {
  font-size: 1.35rem;
  font-weight: 600;
  color: #111827;
  margin: 1.5rem 0 0.5rem;
}

/* Paragraphs and lists */
.content-text :deep(p) {
  margin: 0.35rem 0 0.9rem;
}
.content-text :deep(ul) {
  list-style: disc;
  padding-left: 1.6rem;
  margin: 0.25rem 0 0.9rem;
}
.content-text :deep(ul ul) {
  list-style: circle;
  padding-left: 1.25rem;
  margin-top: 0.25rem;
}
.content-text :deep(li) {
  margin: 0.2rem 0;
}
.content-text :deep(li::marker) {
  color: #2563eb;
}
.content-text :deep(ul ul li::marker) {
  color: #60a5fa;
}

/* Inline code (not code blocks) */
.content-text :deep(p code),
.content-text :deep(li code) {
  background: #fff5f5;
  border: 1px solid #fde2e2;
  color: #1f2937;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
  font-size: 1.1rem;
}

/* Code cards (rendered fences via v-html and snippet list) */
.content-text :deep(.code-example),
.code-example {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.02);
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
.code-context {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 600;
}

.content-text :deep(.code-pre),
.code-pre {
  background: #f3f4f6;
  color: #111827;
  padding: 1rem;
  margin: 0;
  border-radius: 0 0 0.5rem 0.5rem;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 1rem;
  line-height: 1.6;
}

.content-text :deep(.code-explanation),
.code-explanation {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
  font-size: 1rem;
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
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.content-text :deep(.run-button:hover),
.run-button:hover {
  background: #059669;
}

.code-snippets {
  margin-top: 2.5rem;
}
.code-snippets h3 {
  margin-bottom: 1rem;
}

.ace-code-block-wrapper {
  margin: 1rem 0;
}

.ace-code-block-placeholder {
  display: none;
}

/* Inline code run buttons */
.inline-code-wrapper {
  position: relative;
  display: inline-flex;
  align-items: stretch;
  gap: 0rem;
}

.content-text :deep(.inline-run-button),
.inline-run-button {
  background: #10b981 !important;
  color: white !important;
  border: none !important;
  border-radius: 0.375rem !important;
  padding: 0.2rem 0.6rem !important;
  font-size: 0.95rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  opacity: 1 !important;
  transition: all 0.2s !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1.35 !important;
  flex-shrink: 0 !important;
  margin-left: 0 !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), inset 1px 0 0 rgba(255, 255, 255, 0.6) !important;
}

.inline-code-wrapper:hover .inline-run-button {
  opacity: 1;
}

.content-text :deep(.inline-run-button:hover),
.inline-run-button:hover {
  background: #059669 !important;
  /* transform: translateY(-1px) !important; */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
}

.inline-run-button:active {
  transform: translateY(0) !important;
}

/* Ensure inline code styling is preserved */
.content-text :deep(.inline-code-wrapper code) {
  background: #fff5f5;
  border: 1px solid #fde2e2;
  color: #1f2937;
  padding: 0.2rem 0.6rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  line-height: 1.35;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
</style>
