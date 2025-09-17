<template>
  <div class="tutorial-section">
    <!-- Floating ToC rail -->
    <div class="toc-rail">
      <div
        class="toc-panel"
        :class="{ open: tocOpen }"
        :style="{ top: `${tocTop}px` }"
        role="navigation"
        aria-label="Navigation (click to close)"
      >
        <button
          type="button"
          class="toc-header"
          :aria-expanded="tocOpen"
          aria-controls="toc-list"
          @click="tocOpen = !tocOpen"
          title="Toggle table of contents"
        >
          <span>Navigation (click to close)</span>
          <span class="toc-chevron" :class="{ open: tocOpen }" aria-hidden="true"></span>
        </button>
        <div v-if="headings.length === 0" class="toc-empty">No subsections</div>
        <ul v-else class="toc-list" id="toc-list">
          <li
            v-for="h in headings"
            :key="h.id"
            :class="['toc-item', `level-${h.level}`, { active: h.id === activeHeadingId }]"
          >
            <button type="button" class="toc-link" @click.stop.prevent="scrollToHeading(h.id)">
              {{ h.text }}
            </button>
          </li>
        </ul>
      </div>
      <!-- Always-visible Notion-like handle to reveal the ToC -->
      <button
        class="toc-handle"
        v-show="!tocOpen"
        :style="{ top: `${tocTop}px` }"
        title="On this page"
        aria-label="Open table of contents"
        @click="tocOpen = true"
      >
        <span class="line line-1"></span>
        <span class="line line-2"></span>
        <span class="line line-3"></span>
      </button>
    </div>
    <div class="section-header">
      <h1 :id="slugify(sectionTitle)">{{ sectionTitle }}</h1>
    </div>

    <div v-if="isLoading" class="loading-message">Loading section...</div>

    <div v-else-if="error" class="error-message">
      <h2>Error Loading Section</h2>
      <p>{{ error }}</p>
      <button @click="loadSection" class="retry-button">Try Again</button>
    </div>

    <div v-else-if="section" class="section-content">
      <div class="content-text" v-html="renderedHtml" ref="contentRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, createApp } from 'vue'
import { localContentService } from '@/services/localContentService'
import type { TutorialSection, CodeSnippet, CodeSnippetGroup } from '@/types'
import MarkdownIt from 'markdown-it'
import AceCodeBlock from '@/components/AceCodeBlock.vue'
import CodeSnippetGroupBlock from '@/components/CodeSnippetGroupBlock.vue'

interface Props {
  sectionId: string
  currentLanguage?: string
  language?: string
}

const props = defineProps<Props>()

// Section state
const section = ref<TutorialSection | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const codeBlocks = ref<Record<string, string>>({})
const contentRef = ref<HTMLElement>()
// Cache of rendered markdown HTML; only updated when section.content changes
const renderedHtml = ref<string>('')
// Keep track of dynamically mounted Ace editors so we can clean them up
type MountedAce = { unmount: () => void; el: HTMLElement }
const mountedAceBlocks = ref<MountedAce[]>([])

// Track inline snippet group mounts and which group IDs are embedded inline
type MountedInlineGroup = { unmount: () => void; el: HTMLElement }
const mountedInlineGroups = ref<MountedInlineGroup[]>([])
const inlineGroupIds = ref<string[]>([])

// Track inline single snippet mounts and IDs used inline
type MountedInlineSnippet = { unmount: () => void; el: HTMLElement }
const mountedInlineSnippets = ref<MountedInlineSnippet[]>([])
const inlineSnippetIds = ref<string[]>([])

// ToC state
type HeadingItem = { id: string; text: string; level: number; top: number }
const headings = ref<HeadingItem[]>([])
const activeHeadingId = ref<string>('')
const tocOpen = ref(true)
let scrollListener: ((e: Event) => void) | null = null
let resizeListener: ((e: Event) => void) | null = null
let scrollContainer: HTMLElement | null = null
let prevScrollEl: HTMLElement | null = null
const tocTop = ref<number>(0)

const updateTocTop = () => {
  // Place handle/panel just below the sticky header
  tocTop.value = getHeaderOffset() + 12
}

const getScrollContainer = (): HTMLElement | null => {
  const start = contentRef.value as HTMLElement | null
  const isScrollable = (el: HTMLElement) => {
    const cs = window.getComputedStyle(el)
    const oy = cs.overflowY
    return (oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1
  }
  let el: HTMLElement | null = start
  while (el) {
    if (isScrollable(el)) return el
    el = el.parentElement as HTMLElement | null
  }
  // Try known pane
  const pane = document.querySelector('.content-pane') as HTMLElement | null
  if (pane && isScrollable(pane)) return pane
  // Fallback
  return (document.scrollingElement as HTMLElement | null) || document.documentElement
}

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

  type RendererRules = {
    fence?: (tokens: Array<{ info: string; content: string }>, idx: number) => string
    code_inline?: (tokens: Array<{ content: string }>, idx: number) => string
  }
  ;(md.renderer.rules as RendererRules).code_inline = (
    tokens: Array<{ content: string }>,
    idx: number,
  ) => {
    const token = tokens[idx]
    if (!token) return ''
    const code = token.content
    const escapeHtml = (str: string) =>
      str
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
    return `<span class="inline-code-wrapper"><code>${safeCode}</code><button class="inline-run-button" data-code-id="${codeId}" title="Run">➤</button></span>`
  }

  md.renderer.rules.fence = (tokens: Array<{ info: string; content: string }>, idx: number) => {
    const token = tokens[idx]
    if (!token) return ''
    const language = token.info || ''
    const code = token.content

    // Detect no-run directive at the very start of the fenced block content.
    // Supported prefixes mirror inline behavior: "norun:", "no-run:", "nr:".
    const noRunPrefixes = ['norun:', 'no-run:', 'nr:']
    const escapeHtml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#39;')

    // Check first non-empty line for a no-run directive
    const lines = code.split(/\r?\n/)
    const firstLineRaw = lines[0] ?? ''
    const firstLine = firstLineRaw.trim()
    const matchedPrefix = noRunPrefixes.find((p) => firstLine.startsWith(p))
    const hasNoRun = Boolean(matchedPrefix)

    if (hasNoRun) {
      // Remove directive and preserve remainder if present on the same line.
      // If directive is alone on its own line, also skip an optional immediate blank line.
      let startIdx = 1
      const remainder = matchedPrefix ? firstLine.slice(matchedPrefix.length).trim() : ''
      if (!remainder && lines[1] != null && lines[1].trim() === '') startIdx = 2
      const displayLines = [] as string[]
      if (remainder) displayLines.push(remainder)
      displayLines.push(...lines.slice(startIdx))
      const displayCode = displayLines.join('\n')

      if (import.meta.env.DEV) {
        try {
          console.log('[Fence] Rendering plain (no-run) code block', {
            language,
            codePreview: displayCode.slice(0, 60),
          })
        } catch {}
      }

      const escaped = escapeHtml(displayCode)
      const langClass = language ? ` class="language-${language}"` : ''
      return `<pre class="md-code-block no-run"><code${langClass}>${escaped}</code></pre>`
    }

    // Default: render Ace editor placeholder for runnable blocks
    const codeId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    codeBlocks.value[codeId] = code

    if (import.meta.env.DEV) {
      try {
        console.log('[Fence] Created placeholder', {
          codeId,
          language,
          codePreview: code.slice(0, 60),
        })
      } catch {}
    }

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

    // Prefer language from route params, fallback to currentLanguage prop, then default
    const currentLanguage = props.language || props.currentLanguage || 'python'
    console.log('[DEBUG] loadSection called with:', { sectionId: props.sectionId, currentLanguage })
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
  'run-code-sequence': [
    payload: { codes: string[]; continueOnError?: boolean; groupId?: string; title?: string },
  ]
}>()

const runCodeExample = (code: string) => {
  // Emit the code to be executed in the REPL
  emit('run-code', code)
}

// Helpers for compact single-snippet rendering

const commentPrefixFor = (lang?: string) => {
  const l = (lang || '').toLowerCase()
  if (
    [
      'js',
      'ts',
      'javascript',
      'typescript',
      'go',
      'java',
      'c',
      'cpp',
      'c++',
      'rust',
      'php',
    ].includes(l)
  )
    return '//'
  if (['py', 'python', 'sh', 'bash', 'rb', 'ruby'].includes(l)) return '#'
  if (['lua'].includes(l)) return '--'
  if (['elixir'].includes(l)) return '#'
  return '//'
}

const composeTitle = (snippet: CodeSnippet) => {
  const desc = (snippet.context || snippet.explanation || '').trim()
  if (!desc) return snippet.code
  const prefix = commentPrefixFor(snippet.language)
  return `${snippet.code}  ${prefix} ${desc}`
}

// Group helpers and state
const isGroup = (item: CodeSnippet | CodeSnippetGroup): item is CodeSnippetGroup => {
  return 'snippets' in item
}

// Note: previously used to render non-inline snippet lists; removed after inline injection adoption

const groupExpanded = ref<Record<string, boolean>>({})
const initializeGroupExpanded = () => {
  groupExpanded.value = {}
  const items = section.value?.codeItems || []
  items.forEach((it) => {
    if (isGroup(it)) {
      groupExpanded.value[it.id] = !(it.collapsedByDefault ?? false)
    }
  })

  // After Ace mounts adjust layout, recompute heading positions so ToC ranges align
  setTimeout(() => {
    recomputeHeadingPositions()
    updateActiveHeading()
  }, 150)
  setTimeout(() => {
    recomputeHeadingPositions()
    updateActiveHeading()
  }, 400)
}

// Note: group expand/collapse and run are handled inside CodeSnippetGroupBlock now.

const renderMarkdown = (content: string): string => {
  if (import.meta.env.DEV) {
    try {
      console.log('[Markdown] Rendering content:', content.slice(0, 200))
      console.log('[Markdown] Content contains fenced blocks:', content.includes('```'))
    } catch {}
  }
  // Preprocess custom inline snippet/group markers like [[snippet:ID]] and [[snippet-group:GROUP_ID]]
  // Replace with mount placeholders and collect IDs used inline
  inlineGroupIds.value = []
  inlineSnippetIds.value = []
  const groupMarker = /\[\[\s*snippet-group\s*:\s*([A-Za-z0-9_-]+)\s*\]\]/g
  const snippetMarker = /\[\[\s*snippet\s*:\s*([A-Za-z0-9_-]+)\s*\]\]/g

  // Also detect inline code blocks with title/description comments (supports both // and # comment styles)
  const inlineSnippetRegex =
    /```(\w+)\s*\n(?:\/\/|#)\s*title:\s*([^\n]+)(?:\n(?:\/\/|#)\s*description:\s*([^\n]+))?\n([\s\S]*?)```/g

  const foundGroupIds: string[] = []
  const foundSnippetIds: string[] = []

  let preprocessed = content.replace(groupMarker, (_m, gid) => {
    const id = String(gid)
    foundGroupIds.push(id)
    return `<div class="snippet-group-placeholder" data-group-id="${id}"></div>`
  })

  preprocessed = preprocessed.replace(snippetMarker, (_m, sid) => {
    const id = String(sid)
    foundSnippetIds.push(id)
    return `<div class="snippet-placeholder" data-snippet-id="${id}"></div>`
  })

  // Replace inline snippet code blocks with placeholders
  let snippetIndex = 0
  preprocessed = preprocessed.replace(
    inlineSnippetRegex,
    (_match, language, title, description, code) => {
      if (code.includes('---')) {
        // Snippet group
        const groupId = `inline_group_${snippetIndex}`
        foundGroupIds.push(groupId)
        snippetIndex++
        return `<div class="snippet-group-placeholder" data-group-id="${groupId}" data-inline-title="${title}" data-inline-description="${description || ''}" data-inline-code="${encodeURIComponent(code)}" data-inline-language="${language}"></div>`
      } else {
        // Single snippet
        const snippetId = `inline_snippet_${snippetIndex}`
        foundSnippetIds.push(snippetId)
        snippetIndex++
        return `<div class="snippet-placeholder" data-snippet-id="${snippetId}" data-inline-title="${title}" data-inline-description="${description || ''}" data-inline-code="${encodeURIComponent(code)}" data-inline-language="${language}"></div>`
      }
    },
  )

  inlineGroupIds.value = foundGroupIds
  inlineSnippetIds.value = foundSnippetIds

  const html = getMarkdown().render(preprocessed)
  if (import.meta.env.DEV) {
    try {
      console.log('[Markdown] Rendered HTML preview:', html.slice(0, 500))
    } catch {}
  }
  // Post-process HTML to add IDs to headings
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const seen = new Map<string, number>()
  if (import.meta.env.DEV) {
    try {
      const phCount = doc.body.querySelectorAll('.ace-code-block-placeholder').length
      console.log('[Markdown] Placeholders in rendered HTML:', phCount)
    } catch {}
  }

  headingElements.forEach((heading) => {
    const text = heading.textContent?.trim() || ''
    if (!text) return

    const base = slugify(text)
    if (!base) return

    const count = seen.get(base) || 0
    seen.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count + 1}`
    heading.setAttribute('id', id)
  })

  // Rewrite internal section links to include current language in the path.
  // This ensures links like "/section/types" keep the user within the active language
  // (e.g., "/javascript/section/types").
  const lang = props.language || props.currentLanguage || 'python'
  const anchors = Array.from(doc.querySelectorAll('a[href]')) as HTMLAnchorElement[]
  anchors.forEach((a) => {
    const href = a.getAttribute('href') || ''
    if (href.startsWith('/section/')) {
      a.setAttribute('href', `/${lang}${href}`)
    } else if (href.startsWith('section/')) {
      a.setAttribute('href', `/${lang}/${href}`)
    }
  })

  return doc.body.innerHTML
}

// Process Ace code block placeholders after markdown rendering by mounting
// an AceCodeBlock inline at each placeholder location
const clearMountedAceBlocks = () => {
  console.log('[DEBUG] clearMountedAceBlocks called, stack trace:', new Error().stack)
  mountedAceBlocks.value.forEach(({ unmount, el }) => {
    try {
      unmount()
    } catch {}
    try {
      el.remove()
    } catch {}
  })
  mountedAceBlocks.value = []
}

const clearMountedInlineGroups = () => {
  console.log('[DEBUG] clearMountedInlineGroups called, stack trace:', new Error().stack)
  mountedInlineGroups.value.forEach(({ unmount, el }) => {
    try {
      unmount()
    } catch {}
    try {
      el.remove()
    } catch {}
  })
  mountedInlineGroups.value = []
}

const clearMountedInlineSnippets = () => {
  console.log('[DEBUG] clearMountedInlineSnippets called, stack trace:', new Error().stack)
  mountedInlineSnippets.value.forEach(({ unmount, el }) => {
    try {
      unmount()
    } catch {}
    try {
      el.remove()
    } catch {}
  })
  mountedInlineSnippets.value = []
}

// Parse inline snippets from markdown content
const parseInlineSnippets = (content: string): CodeSnippet[] => {
  const snippets: CodeSnippet[] = []

  // Regex to match code blocks with title/description comments (supports both // and # comment styles)
  const codeBlockRegex =
    /```(\w+)\s*\n(?:\/\/|#)\s*title:\s*([^\n]+)(?:\n(?:\/\/|#)\s*description:\s*([^\n]+))?\n([\s\S]*?)```/g

  let match
  let snippetIndex = 0

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const [, blockLanguage, title, description, code] = match

    // Ensure we have valid matches
    if (!blockLanguage || !title || !code) continue

    // Check if this is a snippet group (contains ---)
    if (code.includes('---')) {
      const sections = code
        .split('---')
        .map((section) => section.trim())
        .filter((section) => section.length > 0)

      sections.forEach((section, index) => {
        snippets.push({
          id: `inline_snippet_${snippetIndex}_${index}`,
          code: section,
          language: blockLanguage,
          isExecutable: true,
          context: description || title,
        })
      })
    } else {
      // Single snippet
      snippets.push({
        id: `inline_snippet_${snippetIndex}`,
        code: code.trim(),
        language: blockLanguage,
        isExecutable: true,
        context: description ? description.trim() : title,
      })
    }

    snippetIndex++
  }

  return snippets
}

// Mount inline snippet groups where placeholders were inserted during markdown render
const mountInlineSnippetGroups = () => {
  if (!contentRef.value) return
  const placeholders = contentRef.value.querySelectorAll('.snippet-group-placeholder')
  if (placeholders.length === 0) return
  Array.from(placeholders).forEach((ph) => {
    const groupId = ph.getAttribute('data-group-id') || ''

    // Check if this is an inline snippet group
    const inlineTitle = ph.getAttribute('data-inline-title')
    const inlineDescription = ph.getAttribute('data-inline-description')
    const inlineCode = ph.getAttribute('data-inline-code')
    const inlineLanguage = ph.getAttribute('data-inline-language')

    let group: CodeSnippetGroup | undefined

    if (inlineTitle && inlineCode && inlineLanguage) {
      // Create group from inline data
      const decodedCode = decodeURIComponent(inlineCode)
      const sections = decodedCode
        .split('---')
        .map((section) => section.trim())
        .filter((section) => section.length > 0)
      group = {
        id: groupId,
        title: inlineTitle,
        description: inlineDescription || '',
        collapsedByDefault: false,
        continueOnError: false,
        snippets: sections.map((section, index) => ({
          id: `${groupId}_${index}`,
          code: section,
          language: inlineLanguage,
          isExecutable: true,
          context: '',
        })),
      }
    } else {
      // Legacy: find from codeItems
      const items = section.value?.codeItems || []
      group = items.find((it) => isGroup(it) && it.id === groupId) as CodeSnippetGroup | undefined
    }

    const mountEl = document.createElement('div')
    mountEl.className = 'inline-snippet-group-mount'
    try {
      ph.parentNode?.replaceChild(mountEl, ph)
    } catch (e) {
      console.warn('[InlineGroup] Failed to replace placeholder', e)
      return
    }

    if (!group) {
      mountEl.innerHTML = `<div class="code-example"><div class="code-toolbar"><span class="code-context"><strong>Snippet group not found:</strong> ${groupId}</span></div></div>`
      return
    }

    try {
      const app = createApp(CodeSnippetGroupBlock, {
        group,
        onRunCode: runCodeExample,
        onRunCodeSequence: (payload: {
          codes: string[]
          continueOnError?: boolean
          groupId?: string
          title?: string
        }) => emit('run-code-sequence', payload),
      })
      app.mount(mountEl)
      mountedInlineGroups.value.push({ unmount: () => app.unmount(), el: mountEl })
    } catch (e) {
      console.error('[InlineGroup] Failed to mount CodeSnippetGroupBlock', e)
    }
  })
}

// Mount inline single snippets where placeholders were inserted during markdown render
const mountInlineSnippets = () => {
  if (!contentRef.value) return
  const placeholders = contentRef.value.querySelectorAll('.snippet-placeholder')
  if (placeholders.length === 0) return

  Array.from(placeholders).forEach((ph) => {
    const snippetId = ph.getAttribute('data-snippet-id') || ''

    // Check if this is an inline snippet
    const inlineTitle = ph.getAttribute('data-inline-title')
    const inlineDescription = ph.getAttribute('data-inline-description')
    const inlineCode = ph.getAttribute('data-inline-code')
    const inlineLanguage = ph.getAttribute('data-inline-language')

    let snippet: CodeSnippet | undefined

    if (inlineTitle && inlineCode && inlineLanguage) {
      // Create snippet from inline data
      const decodedCode = decodeURIComponent(inlineCode)

      // Remove duplicate title comment from code if it matches the title
      let cleanedCode = decodedCode.trim()
      const titleComment = `// ${inlineTitle}`
      console.log('[DEBUG] Title:', inlineTitle)
      console.log('[DEBUG] Original code:', cleanedCode)
      console.log('[DEBUG] Looking for comment:', titleComment)
      if (cleanedCode.startsWith(titleComment)) {
        cleanedCode = cleanedCode.substring(titleComment.length).trim()
        console.log('[DEBUG] Cleaned code:', cleanedCode)
      } else {
        console.log('[DEBUG] Comment not found at start')
      }

      snippet = {
        id: snippetId,
        code: cleanedCode,
        language: inlineLanguage,
        isExecutable: true,
        context: inlineDescription ? inlineDescription.trim() : inlineTitle,
      }
    } else {
      // Try to get snippet from inline parsing first
      if (section.value) {
        const inlineSnippets = parseInlineSnippets(section.value.content)
        snippet = inlineSnippets.find((s: CodeSnippet) => s.id === snippetId)
      }

      // Fallback to legacy codeItems
      if (!snippet) {
        const items = section.value?.codeItems || []
        snippet = items.find((it) => !isGroup(it) && (it as CodeSnippet).id === snippetId) as
          | CodeSnippet
          | undefined
      }
    }

    const mountEl = document.createElement('div')
    mountEl.className = 'inline-snippet-mount'
    try {
      ph.parentNode?.replaceChild(mountEl, ph)
    } catch (e) {
      console.warn('[InlineSnippet] Failed to replace placeholder', e)
      return
    }

    if (!snippet) {
      mountEl.innerHTML = `<div class="code-example"><div class="code-toolbar"><span class="code-context"><strong>Snippet not found:</strong> ${snippetId}</span></div></div>`
      return
    }

    // Build snippet with minimal header
    const wrapper = document.createElement('div')
    wrapper.className = 'code-example is-single-snippet'

    // Create minimal header for individual snippet (title only)
    const toolbar = document.createElement('div')
    toolbar.className = 'code-toolbar single-snippet-toolbar'

    // Debug logging
    console.log(
      '[DEBUG] Creating single snippet with classes:',
      wrapper.className,
      toolbar.className,
    )

    const titleSpan = document.createElement('span')
    titleSpan.className = 'code-context'
    titleSpan.innerHTML = `<strong>${inlineTitle}</strong>`
    toolbar.appendChild(titleSpan)

    if (inlineDescription && inlineDescription.trim()) {
      const descSpan = document.createElement('span')
      descSpan.className = 'single-snippet-description'
      descSpan.textContent = inlineDescription
      toolbar.appendChild(descSpan)
    }

    // Create code row with run button (using same structure as snippet groups)
    const row = document.createElement('div')
    row.className = 'snippet-row'

    const snippetMain = document.createElement('div')
    snippetMain.className = 'snippet-main'

    const codeEl = document.createElement('code')
    codeEl.className = 'snippet-code-preview'
    codeEl.title = composeTitle(snippet)
    // For single snippets, just show the code without the title comment since it's already in the header
    codeEl.textContent = snippet.code

    const btn = document.createElement('button')
    btn.className = 'run-button run-micro'
    btn.textContent = 'Run'

    const onClick = () => runCodeExample(snippet!.code)
    btn.addEventListener('click', onClick)

    snippetMain.appendChild(codeEl)
    row.appendChild(snippetMain)
    row.appendChild(btn)

    wrapper.appendChild(toolbar)
    wrapper.appendChild(row)
    mountEl.appendChild(wrapper)

    if (snippet.explanation) {
      const p = document.createElement('p')
      p.className = 'code-explanation'
      p.textContent = snippet.explanation
      mountEl.appendChild(p)
    }

    mountedInlineSnippets.value.push({
      unmount: () => {
        try {
          btn.removeEventListener('click', onClick)
        } catch {}
      },
      el: mountEl,
    })
  })
}

// Debug: log element and ancestors' dimensions and computed layout
const logAncestorLayout = (el: HTMLElement, label = '') => {
  if (!import.meta.env.DEV) return
  try {
    const lines: string[] = []
    let node: HTMLElement | null = el
    let depth = 0
    while (node && depth < 10) {
      const cs = window.getComputedStyle(node)
      const tag = node.tagName.toLowerCase()
      const cls = (node.className || '').toString()
      const id = node.id ? `#${node.id}` : ''
      const w = node.offsetWidth
      const h = node.offsetHeight
      lines.push(
        `${depth}: <${tag}${id} class="${cls}"> ${w}x${h} display:${cs.display} position:${cs.position} visibility:${cs.visibility} overflow:${cs.overflow}/${cs.overflowX}/${cs.overflowY}`,
      )
      node = node.parentElement as HTMLElement | null
      depth++
    }
    console.log('[AceMount] Ancestor layout', label, lines)
  } catch (e) {
    console.warn('[AceMount] Failed to log ancestor layout', e)
  }
}

const recomputeHeadingPositions = () => {
  // Refresh heading top offsets relative to the current scroll container
  scrollContainer = scrollContainer || getScrollContainer()
  const sc = scrollContainer as HTMLElement | null
  if (!sc) return
  const containerRect = sc.getBoundingClientRect()
  headings.value = headings.value.map((h) => {
    const el = document.getElementById(h.id)
    if (el) {
      const rect = el.getBoundingClientRect()
      const top = rect.top - containerRect.top + sc.scrollTop
      return { ...h, top }
    }
    return h
  })
}

const processAceCodeBlocks = () => {
  if (!contentRef.value) {
    if (import.meta.env.DEV) {
      try {
        console.log('[AceMount] No contentRef available')
      } catch {}
    }
    return
  }

  const placeholders = contentRef.value.querySelectorAll('.ace-code-block-placeholder')
  if (import.meta.env.DEV) {
    try {
      console.log('[AceMount] Found placeholders:', placeholders.length)
      console.log('[AceMount] Existing mounted blocks:', mountedAceBlocks.value.length)
    } catch {}
  }

  // Only clear and remount if we actually have placeholders to process
  if (placeholders.length === 0) {
    if (import.meta.env.DEV) {
      try {
        console.log('[AceMount] No placeholders found, skipping remount')
      } catch {}
    }
    return
  }

  clearMountedAceBlocks()

  Array.from(placeholders).forEach((placeholder) => {
    const codeId = placeholder.getAttribute('data-code-id')
    const language = placeholder.getAttribute('data-language') || 'text'
    const encodedCode = placeholder.getAttribute('data-code')

    let code: string | null = null
    if (codeId) {
      // Prefer retrieving original code from the in-memory map
      // (HTML attributes may be sanitized or truncated by the browser)
      code = codeBlocks.value[codeId] ?? null
      if (!code && encodedCode) {
        try {
          code = decodeURIComponent(encodedCode)
        } catch {
          code = encodedCode
        }
      }
    }

    if (codeId && code != null) {
      const mountEl = document.createElement('div')
      mountEl.style.cssText =
        'width: 100% !important; display: block !important; position: relative !important; margin: 1rem 0 !important; visibility: visible !important; box-sizing: border-box !important;'
      mountEl.className = 'ace-mount-container'

      try {
        placeholder.parentNode?.replaceChild(mountEl, placeholder)
      } catch (e) {
        console.error('[AceMount] Failed to replace placeholder', e)
        return
      }

      // Log immediate layout context before mounting Vue component
      logAncestorLayout(mountEl as HTMLElement, `before-mount ${codeId}`)
      try {
        const r = (mountEl as HTMLElement).getBoundingClientRect()
        console.log('[AceMount] mountEl rect before-mount:', {
          x: r.x,
          y: r.y,
          w: r.width,
          h: r.height,
        })
      } catch {}

      try {
        const app = createApp(AceCodeBlock, {
          code,
          language,
          onRunCode: runCodeExample,
        })

        // Wait for DOM to be ready before mounting
        setTimeout(() => {
          app.mount(mountEl)
          mountedAceBlocks.value.push({ unmount: () => app.unmount(), el: mountEl })
          if (import.meta.env.DEV) {
            try {
              console.log('[AceMount] Mounted AceCodeBlock for', codeId)
            } catch {}
            // Re-log after mount to see if size has resolved
            logAncestorLayout(mountEl as HTMLElement, `after-mount ${codeId}`)
            setTimeout(
              () => logAncestorLayout(mountEl as HTMLElement, `after-mount+100ms ${codeId}`),
              100,
            )
            setTimeout(
              () => logAncestorLayout(mountEl as HTMLElement, `after-mount+300ms ${codeId}`),
              300,
            )
          }
        }, 10)
      } catch (e) {
        console.error('[AceMount] Failed to mount AceCodeBlock', e)
      }
    }
  })
}

// Build ToC from rendered markdown: assign ids to headings and collect positions
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const buildHeadings = () => {
  if (!contentRef.value) return
  const el = contentRef.value
  scrollContainer = getScrollContainer()
  if (!scrollContainer) return
  const sc = scrollContainer as HTMLElement
  const containerRect = sc.getBoundingClientRect()

  // Find headings in markdown content
  const contentHeadings = Array.from(el.querySelectorAll('h1, h2, h3, h4')) as HTMLElement[]

  // Find the section header (outside markdown content)
  const sectionHeader = document.querySelector('.section-header h1') as HTMLElement | null

  const allHeadings = sectionHeader ? [sectionHeader, ...contentHeadings] : contentHeadings
  const list: HeadingItem[] = []

  allHeadings.forEach((h) => {
    const raw = (h.textContent || '').trim()
    if (!raw || !h.id) return
    const level = Number(h.tagName.substring(1)) || 3
    const hRect = h.getBoundingClientRect()
    const top = hRect.top - containerRect.top + sc.scrollTop
    list.push({ id: h.id, text: raw, level, top })
    // console.log('[ToC] Found heading with ID:', { id: h.id, text: raw, element: h })
  })
  headings.value = list
  // console.log(
  //   '[ToC] Built headings:',
  //   headings.value.map((h) => h.id),
  // )
  // Ensure listeners are bound to the correct scroll container once content exists
  attachScrollHandlers()
  updateActiveHeading()
}

const getHeaderOffset = () => {
  const sticky = document.querySelector('.tutorial-header') as HTMLElement | null
  return sticky ? sticky.offsetHeight + 8 : 0
}

const updateActiveHeading = () => {
  const first = headings.value[0]
  if (!first) {
    activeHeadingId.value = ''
    return
  }
  scrollContainer = scrollContainer || getScrollContainer()
  if (!scrollContainer) {
    activeHeadingId.value = first.id
    return
  }
  const sc = scrollContainer as HTMLElement
  const scrollY = sc.scrollTop // Use exact scroll position for accurate section detection
  // Use the same anchor gap used by scrollToHeading() so clicking a ToC item lands
  // squarely inside the intended section. This keeps section boundaries non-overlapping.
  const anchorGap = getHeaderOffset() + 20
  const epsilon = 0.5
  let current: HeadingItem = first

  if (import.meta.env.DEV) {
    // console.log(
    //   '[ToC] updateActiveHeading - scrollY:',
    //   scrollY,
    //   'headings:',
    //   headings.value.map((h) => ({ id: h.id, text: h.text, top: h.top })),
    // )
  }

  // Find the closest heading by checking which section boundary we're in
  let bestMatch: HeadingItem = first
  let bestDistance = Infinity

  for (let i = 0; i < headings.value.length; i++) {
    const h = headings.value[i]
    if (!h) continue
    const nextH = headings.value[i + 1]

    // Calculate section boundaries based on the same anchor gap used by scrolling
    // Non-overlapping: a section ends exactly where the next section begins.
    const sectionStart = h.top - anchorGap
    const sectionEnd = nextH ? nextH.top - anchorGap : Infinity

    if (import.meta.env.DEV) {
      // console.log(
      //   `[ToC] Section "${h.text}": ${sectionStart} to ${sectionEnd} (scrollY: ${scrollY})`,
      // )
    }

    // Check if we're within this section's boundaries
    if (scrollY + 0 >= sectionStart - epsilon && scrollY < sectionEnd - epsilon) {
      bestMatch = h
      if (import.meta.env.DEV) {
        // console.log(`[ToC] In section: "${h.text}"`)
      }
      break
    }

    // Also track the closest heading as fallback
    const distance = Math.abs(scrollY - h.top)
    if (distance < bestDistance) {
      bestDistance = distance
      current = h
    }
  }

  // Use section-based match if found, otherwise use closest heading
  const selected = bestMatch || current

  // Only update if it's actually changed to avoid unnecessary re-renders
  if (activeHeadingId.value !== selected.id) {
    activeHeadingId.value = selected.id
    // console.log('[ToC] Active heading changed to:', selected.id, 'at scroll position:', scrollY)
  }
}

const attachScrollHandlers = () => {
  const newEl = getScrollContainer()
  if (!newEl) return
  if (prevScrollEl && scrollListener)
    prevScrollEl.removeEventListener('scroll', scrollListener as EventListener)
  scrollContainer = newEl
  if (resizeListener) window.removeEventListener('resize', resizeListener)
  scrollListener = () => updateActiveHeading()
  resizeListener = () => {
    updateTocTop()
    recomputeHeadingPositions()
    updateActiveHeading()
  }
  const sc = scrollContainer as HTMLElement
  sc.addEventListener(
    'scroll',
    scrollListener as EventListener,
    { passive: true } as AddEventListenerOptions,
  )
  window.addEventListener('resize', resizeListener)
  prevScrollEl = sc
}

const scrollToHeading = (id: string) => {
  // console.log('[ToC] scrollToHeading called with id:', id)
  const el = document.getElementById(id)
  if (!el) {
    // console.log('[ToC] Element not found:', id)
    return
  }
  scrollContainer = getScrollContainer()
  if (!scrollContainer) {
    // console.log('[ToC] No scroll container found')
    return
  }
  const sc = scrollContainer as HTMLElement
  // console.log('[ToC] Scroll container:', sc, sc.tagName, sc.className)
  const offset = getHeaderOffset()

  // Use the same position calculation as buildHeadings for consistency
  const containerRect = sc.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const headingTop = elRect.top - containerRect.top + sc.scrollTop

  // Target position: heading position minus header offset minus small buffer
  let target = headingTop - offset - 20 // 20px buffer to ensure heading is visible

  // Clamp to valid range
  target = Math.max(0, Math.min(target, sc.scrollHeight - sc.clientHeight))
  // console.log('[ToC] Scroll details:', {
  //   id,
  //   offset,
  //   headingTop,
  //   target,
  //   current: sc.scrollTop,
  //   scrollHeight: sc.scrollHeight,
  // })

  sc.scrollTop = target
  // Recompute heading positions right after programmatic scroll to account for
  // any lazy layout shifts so our section detection uses fresh coordinates.
  recomputeHeadingPositions()
  // Keep the ToC state unchanged after navigating
  // tocOpen value remains as-is

  // Ensure highlight is correct after scroll completes
  window.setTimeout(() => updateActiveHeading(), 100)
}

onMounted(() => {
  loadSection()

  // Add event listener for code block buttons
  document.addEventListener('click', handleCodeBlockClick)
  updateTocTop()
  attachScrollHandlers()
})

// Watch for content changes to process Ace code blocks
let processTimeout: ReturnType<typeof setTimeout> | null = null
let lastProcessedContent: string | null = null

watch(
  () => section.value?.content,
  (newContent, oldContent) => {
    // Only process if content actually changed and is different from last processed
    if (!newContent || newContent === oldContent || newContent === lastProcessedContent) return

    // Clear any pending timeout
    if (processTimeout) {
      clearTimeout(processTimeout)
    }

    // Debounce the processing to avoid multiple rapid calls
    processTimeout = setTimeout(() => {
      // Store the content we're about to process
      lastProcessedContent = newContent

      // Unmount any existing Ace editors before replacing HTML to avoid leaks
      clearMountedAceBlocks()
      // Also unmount any inline snippet groups mounted into the previous content
      clearMountedInlineGroups()
      // Also unmount any inline single snippets mounted into the previous content
      clearMountedInlineSnippets()
      // Reset code map; new render will repopulate via placeholders
      codeBlocks.value = {}
      // Render markdown once and cache the HTML so it won't change on scroll
      renderedHtml.value = renderMarkdown(newContent || '')
      // Wait for DOM to reflect new HTML, then build headings and mount Ace
      nextTick(() => {
        buildHeadings()
        setTimeout(() => {
          if (import.meta.env.DEV) {
            try {
              console.log('[Pipeline] Mounting Ace editors after headings rendered')
            } catch {}
          }
          processAceCodeBlocks()
          // Mount inline snippet groups at their placeholders
          mountInlineSnippetGroups()
          // Mount inline single snippets at their placeholders
          mountInlineSnippets()
        }, 120)
      })
    }, 50) // 50ms debounce
  },
)

// Initialize group collapse state when items change
watch(
  () => section.value?.codeItems,
  () => initializeGroupExpanded(),
  { immediate: true },
)

onUnmounted(() => {
  // Remove event listener
  document.removeEventListener('click', handleCodeBlockClick)
  clearMountedAceBlocks()
  clearMountedInlineGroups()
  clearMountedInlineSnippets()
  if (prevScrollEl && scrollListener)
    prevScrollEl.removeEventListener('scroll', scrollListener as EventListener)
  if (resizeListener) window.removeEventListener('resize', resizeListener)
  if (processTimeout) clearTimeout(processTimeout)
})

// Watch for route and language changes to reload section content
watch(
  () => [props.sectionId, props.language, props.currentLanguage],
  (
    [newSectionId, newLanguage, newCurrentLanguage],
    [oldSectionId, oldLanguage, oldCurrentLanguage],
  ) => {
    console.log('[DEBUG] Route watcher triggered:', {
      newSectionId,
      newLanguage,
      newCurrentLanguage,
      oldSectionId,
      oldLanguage,
      oldCurrentLanguage,
    })

    // Only reload if section ID actually changed or language changed meaningfully
    const sectionChanged = newSectionId !== oldSectionId
    const languageChanged =
      (newLanguage || newCurrentLanguage) !== (oldLanguage || oldCurrentLanguage)

    if (newSectionId && (sectionChanged || languageChanged)) {
      console.log('[DEBUG] Reloading section due to meaningful change')
      loadSection()
    } else {
      console.log('[DEBUG] Skipping section reload - no meaningful change')
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
  /* Let the parent .content-pane be the scroll container */
  height: auto;
  overflow: visible;
  background: #fbfbfc;
}

/* Floating ToC rail */
.toc-rail {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 44px; /* includes handle width */
  z-index: 20;
}

.toc-panel {
  position: absolute;
  left: 8px; /* appear closer to the handle/left edge */
  top: 80px; /* below sticky header */
  transform: translateX(-100%);
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
  opacity: 0.95;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px; /* full rounding as it's no longer butted to handle */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  min-width: 240px;
  max-width: 320px;
  max-height: calc(100vh - 100px);
  overflow: auto;
  padding: 0.5rem 0.75rem;
}

.toc-panel.open {
  transform: translateX(0);
}

.toc-header {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0.25rem 0.25rem;
  margin: 0 0 0.25rem 0;
  cursor: pointer;
  font-weight: 700;
  color: #111827;
  border-radius: 6px;
}
.toc-header:hover {
  background: #f3f4f6;
}

.toc-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  color: #6b7280;
}
.toc-chevron::before {
  content: '▸';
  line-height: 1;
}
.toc-chevron.open::before {
  content: '▾';
}

.toc-empty {
  color: #6b7280;
  font-size: 0.9rem;
  padding: 0.5rem 0.25rem;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0.25rem 0;
}
.toc-item {
  margin: 0;
  padding: 0;
}
.toc-item .toc-link {
  appearance: none;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  color: #374151;
  font-size: 0.95rem;
}
.toc-item .toc-link:hover {
  background: #f3f4f6;
}
.toc-item.active .toc-link {
  background: #e3f2fd;
  color: #007bff;
  font-weight: 600;
}

.toc-item.level-2 .toc-link {
  padding-left: 0.5rem;
}
.toc-item.level-3 .toc-link {
  padding-left: 1.25rem;
  font-size: 0.92rem;
}
.toc-item.level-4 .toc-link {
  padding-left: 2rem;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .toc-rail {
    display: none;
  }
}

/* ToC handle: visible hint for discoverability */
.toc-handle {
  position: absolute;
  left: 8px;
  top: 90px; /* overridden by inline style bound to tocTop */
  width: 36px;
  height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}
.toc-handle:hover {
  transform: translateX(2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
  border-color: #d1d5db;
}
.toc-panel.open ~ .toc-handle {
  opacity: 0;
  pointer-events: none;
}

.toc-handle .line {
  display: block;
  height: 3px;
  border-radius: 2px;
}
.toc-handle .line-1 {
  width: 18px;
  background: #111827;
  opacity: 0.9;
}
.toc-handle .line-2 {
  width: 14px;
  background: #cbd5e1;
}
.toc-handle .line-3 {
  width: 10px;
  background: #e5e7eb;
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
  display: block;
  width: 100%;
  min-width: 0;
  position: relative;
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
  display: block;
  width: 100%;
  min-width: 0;
  min-height: 1px;
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

/* Blockquotes - Notion-style */
.content-text :deep(blockquote) {
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border-radius: 0 6px 6px 0;
  font-style: normal;
  position: relative;
}
.content-text :deep(blockquote p) {
  margin: 0.5rem 0;
  color: #374151;
}
.content-text :deep(blockquote p:first-child) {
  margin-top: 0;
}
.content-text :deep(blockquote p:last-child) {
  margin-bottom: 0;
}
.content-text :deep(blockquote strong) {
  color: #1f2937;
  font-weight: 600;
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
.content-text :deep(ol) {
  list-style: decimal;
  padding-left: 1.8rem;
  margin: 0.25rem 0 0.9rem;
}
.content-text :deep(ol ol) {
  list-style: lower-alpha;
  padding-left: 1.5rem;
  margin-top: 0.25rem;
}
.content-text :deep(li) {
  margin: 0.2rem 0;
  padding-left: 0.3rem;
}
.content-text :deep(li::marker) {
  color: #2563eb;
  font-weight: 600;
}
.content-text :deep(ul ul li::marker) {
  color: #60a5fa;
}
.content-text :deep(ol li::marker) {
  color: #2563eb;
  font-weight: 600;
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
  position: relative; /* allow absolute-positioned run button */
}

.content-text :deep(.code-toolbar),
.code-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.75rem;
  background: #e3f2fd;
  border-bottom: none;
}

/* Compact single snippet row */
.content-text :deep(.compact-snippet-row),
.compact-snippet-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.2rem 0.75rem;
  background: transparent;
  border-bottom: none;
}

.content-text :deep(.snippet-code-preview),
.snippet-code-preview {
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 1rem;
  color: #111827;
  white-space: pre-wrap;
  overflow: visible;
  flex: 1 1 auto;
}

.content-text :deep(.run-micro),
.run-micro {
  padding: 0.25rem 0.6rem;
  font-size: 0.9rem;
}

/* Subtle bordered card for ungrouped inline snippets */
.content-text :deep(.inline-snippet-mount),
.inline-snippet-mount {
  border: 1px solid #eef2f7;
  border-radius: 8px;
  background: #ffffff;
  margin: 0.6rem 0;
}

/* Softer divider above inline snippet explanation only */
.inline-snippet-mount > .code-explanation {
  border-top: 1px solid #eef2f7;
  background: #f9fafb;
}

/* Flex spacer to push Run Group button to the right */
.content-text :deep(.group-toolbar .toolbar-spacer),
.group-toolbar .toolbar-spacer {
  flex: 1 1 auto;
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

/* Code area wrapper to position Run button over the code */
.content-text :deep(.code-body),
.code-body {
  position: relative;
}

/* Run button inside code area (top-right) */
.content-text :deep(.code-body .snippet-run),
.code-body .snippet-run {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

/* Avoid overlap between code and the floating button */
.content-text :deep(.code-body .code-pre),
.code-body .code-pre {
  padding-right: 4.25rem;
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

.content-text :deep(.ace-code-block-placeholder),
.ace-code-block-placeholder {
  display: none;
}

/* Ensure mounted Ace editors are visible and sized */
.content-text :deep(.ace-code-block) {
  display: block !important;
  visibility: visible !important;
  width: 100% !important;
}

/* Force dimensions on dynamically mounted containers */
.content-text :deep(.ace-mount-container) {
  display: block !important;
  width: 100% !important;
  position: relative !important;
  visibility: visible !important;
  box-sizing: border-box !important;
}

/* Plain markdown code blocks marked as no-run (non-editable, non-runnable) */
.content-text :deep(pre.md-code-block.no-run) {
  background: #f8fafc;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.02);
  padding: 0.75rem 1rem;
  margin: 1rem 0 1.5rem 0;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 1rem;
  line-height: 1.6;
}
.content-text :deep(pre.md-code-block.no-run code) {
  background: transparent;
  display: block;
  white-space: pre;
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
  font-size: 1.15rem !important;
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
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 1px 0 0 rgba(255, 255, 255, 0.6) !important;
}

/* Single snippet minimal header styles */
.content-text :deep(.is-single-snippet) {
  margin: 0.75rem 0 !important;
  border-radius: 0.5rem !important;
  overflow: hidden !important;
  border: 1px solid #e5e7eb !important;
}

.content-text :deep(.code-example.is-single-snippet) {
  margin: 0 !important;
}

.content-text :deep(.is-single-snippet) * {
  margin: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.content-text :deep(.single-snippet-toolbar) {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  padding: 0.25rem 0.75rem !important;
  background: #e3f2fd !important;
  border-radius: 0.5rem 0.5rem 0 0 !important;
  border-bottom: none !important;
  margin: 0 !important;
}

.content-text :deep(.single-snippet-header) {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.content-text :deep(.single-snippet-description) {
  margin: 0 !important;
  padding: 0;
  display: block;
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.25;
}

/* Unified snippet row styling for both groups and single snippets */
.content-text :deep(.snippet-row) {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
  padding: 0.2rem 0.75rem !important;
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  margin: 0 !important;
  border-top: 1px solid #eef2f7 !important;
}

/* Add separator line between rows in single snippets (like in groups) */
.content-text :deep(.is-single-snippet .snippet-row) {
  background: white !important;
  border-radius: 0 0 0.5rem 0.5rem !important;
}

.content-text :deep(.snippet-main) {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  flex: 1 1 auto !important;
  min-width: 0 !important;
}

.content-text :deep(.toolbar-spacer) {
  flex: 1 1 auto;
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
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  line-height: 1.35;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
</style>
