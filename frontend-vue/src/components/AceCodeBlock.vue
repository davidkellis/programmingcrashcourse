<template>
  <div class="ace-code-block" ref="containerRef">
    <!-- Floating Run button in top-right corner -->
    <button class="ace-run-button" @click="runCode" :title="`Run ${language} code (Ctrl+Enter)`">
      Run
    </button>

    <!-- Ace Editor container -->
    <div :id="editorId" class="ace-editor-container" ref="editorRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useScroll } from '@vueuse/core'

interface Props {
  code: string
  language: string
  onRunCode: (code: string) => void
}

// Utility: find nearest scrollable ancestor (overflow-y auto/scroll)
const getScrollParent = (el: HTMLElement | null): HTMLElement | null => {
  let node: HTMLElement | null = el
  while (node && node !== document.body) {
    const cs = window.getComputedStyle(node)
    const oy = cs.overflowY
    if (oy === 'auto' || oy === 'scroll') return node
    node = node.parentElement
  }
  return (document.scrollingElement as HTMLElement) || document.documentElement
}

const props = defineProps<Props>()

// Refs
const containerRef = ref<HTMLElement>()
const editorRef = ref<HTMLElement>()
const editorId = ref(`ace-editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

// Ace Editor types (minimal shims)
type AceEditor = {
  setTheme: (theme: string) => void
  setOptions: (opts: Record<string, unknown>) => void
  setValue: (code: string, cursorPos?: number) => void
  getValue: () => string
  focus: () => void
  destroy: () => void
  resize: () => void
  on: (event: string, cb: () => void) => void
  session: { setMode: (mode: string) => void }
  commands: {
    addCommand: (cmd: { name: string; bindKey: Record<string, string>; exec: () => void }) => void
  }
  setKeyboardHandler?: (handler: string) => void
  renderer: {
    setScrollMargin: (top: number, bottom: number, left: number, right: number) => void
    setOption: (name: string, value: unknown) => void
  }
}

let editor: AceEditor | null = null
let keydownHandlerRef: ((e: KeyboardEvent) => void) | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null

// Dynamic height constants
const LINE_HEIGHT = 25.6 // 16px font * 1.6 line-height
const MIN_LINES = 4
const MAX_LINES = 100
const MIN_HEIGHT = Math.ceil(MIN_LINES * LINE_HEIGHT)
const MAX_HEIGHT = Math.ceil(MAX_LINES * LINE_HEIGHT)

// Calculate dynamic height based on content
const calculateEditorHeight = (code: string): number => {
  const lines = code.split('\n').length
  const clampedLines = Math.max(MIN_LINES, Math.min(MAX_LINES, lines))
  return Math.ceil(clampedLines * LINE_HEIGHT)
}

// Update editor height based on content
const updateEditorHeight = (code: string) => {
  if (!containerRef.value || !editorRef.value) return
  
  const dynamicHeight = calculateEditorHeight(code)
  const heightPx = `${dynamicHeight}px`
  
  const parent = containerRef.value as HTMLElement
  const container = editorRef.value as HTMLElement
  
  parent.style.height = heightPx
  container.style.height = heightPx
  
  if (editor) {
    editor.resize()
  }
}

// Language mode mapping
const languageModeMap: Record<string, string> = {
  python: 'ace/mode/python',
  javascript: 'ace/mode/javascript',
  typescript: 'ace/mode/typescript',
  ruby: 'ace/mode/ruby',
  js: 'ace/mode/javascript',
  ts: 'ace/mode/typescript',
  py: 'ace/mode/python',
  rb: 'ace/mode/ruby',
}

// Initialize Ace Editor
const initEditor = async () => {
  if (!editorRef.value) {
    if (import.meta.env.DEV) {
      console.log('[AceCodeBlock] No editorRef available')
    }
    return
  }

  // Ensure the editor container has explicit dimensions before creating the editor
  const container = editorRef.value as HTMLElement
  const parentContainer = containerRef.value as HTMLElement

  // Calculate dynamic height based on content
  const dynamicHeight = calculateEditorHeight(props.code)
  const heightPx = `${dynamicHeight}px`

  // Force dimensions on both containers
  parentContainer.style.width = '100%'
  parentContainer.style.height = heightPx
  parentContainer.style.minHeight = `${MIN_HEIGHT}px`
  parentContainer.style.maxHeight = `${MAX_HEIGHT}px`
  parentContainer.style.display = 'block'

  container.style.width = '100%'
  container.style.height = heightPx
  container.style.minHeight = `${MIN_HEIGHT}px`
  container.style.maxHeight = `${MAX_HEIGHT}px`
  container.style.display = 'block'

  if (import.meta.env.DEV) {
    console.log('[AceCodeBlock] Parent container dimensions:', {
      width: parentContainer.offsetWidth,
      height: parentContainer.offsetHeight,
    })
  }

  try {
    await waitForVisibleSize(container)
    if (import.meta.env.DEV) {
      console.log('[AceCodeBlock] Container size before init:', {
        width: container.offsetWidth,
        height: container.offsetHeight,
      })
    }

    if (import.meta.env.DEV) {
      console.log('[AceCodeBlock] Loading Ace Editor from CDN...')
    }
    // Dynamically load Ace Editor from CDN
    const ace = await loadAceEditor()
    if (import.meta.env.DEV) {
      console.log('[AceCodeBlock] Ace Editor loaded successfully')
    }

    // Create editor instance
    editor = ace.edit(editorRef.value as HTMLElement) as AceEditor

    if (import.meta.env.DEV) {
      console.log('[AceCodeBlock] Editor container dimensions:', {
        width: editorRef.value.offsetWidth,
        height: editorRef.value.offsetHeight,
        clientWidth: editorRef.value.clientWidth,
        clientHeight: editorRef.value.clientHeight,
      })
    }

    // set keyboard shortcuts (if available)
    try {
      if (editor && typeof editor.setKeyboardHandler === 'function') {
        editor.setKeyboardHandler('ace/keyboard/vscode')
      }
    } catch {}

    // Set theme and mode
    editor!.setTheme('ace/theme/chrome')
    const mode = languageModeMap[props.language.toLowerCase()] || 'ace/mode/text'
    editor!.session.setMode(mode)

    // Set initial content
    editor!.setValue(props.code, -1)

    // Ensure language tools are available
    try {
      ace.require('ace/ext/language_tools')
    } catch {}

    // Configure editor options
    editor!.setOptions({
      fontSize: '16px',
      showPrintMargin: false,
      showGutter: true,
      highlightActiveLine: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      useSoftTabs: true,
      tabSize: 2,
      wrap: false,
      scrollPastEnd: 0,
    })

    // Single resize after initialization
    setTimeout(() => {
      if (editor) {
        editor.resize()
      }
    }, 100)

    // Bypass all CSS and force absolute positioning
    const forceEditorVisibility = () => {
      const parent = containerRef.value as HTMLElement
      const editorContainer = editorRef.value as HTMLElement

      if (parent) {
        // Ensure parent remains sized/visible without altering classes
        // (Do not strip classes; they hold important styles)
        // Keep dimensions stable
        if (!parent.style.width) parent.style.width = '100%'
        if (!parent.style.height) parent.style.height = heightPx
        if (!parent.style.minHeight) parent.style.minHeight = `${MIN_HEIGHT}px`
        if (!parent.style.maxHeight) parent.style.maxHeight = `${MAX_HEIGHT}px`
        parent.style.display = 'block'
        parent.style.position = 'relative'

        if (import.meta.env.DEV) {
          console.log(
            '[AceCodeBlock] Parent forced absolute:',
            parent.offsetWidth,
            'x',
            parent.offsetHeight,
          )
        }
      }

      if (editorContainer) {
        // Ensure explicit dimensions without touching Ace's classes
        if (!editorContainer.style.width) editorContainer.style.width = '100%'
        if (!editorContainer.style.height) editorContainer.style.height = heightPx
        if (!editorContainer.style.minHeight) editorContainer.style.minHeight = `${MIN_HEIGHT}px`
        if (!editorContainer.style.maxHeight) editorContainer.style.maxHeight = `${MAX_HEIGHT}px`
        editorContainer.style.position = 'relative'
        editorContainer.style.display = 'block'
        editorContainer.style.overflow = 'visible'

        if (import.meta.env.DEV) {
          console.log(
            '[AceCodeBlock] Editor forced dimensions:',
            editorContainer.offsetWidth,
            'x',
            editorContainer.offsetHeight,
          )
        }

        if (editor) {
          editor.resize()
        }
      }
    }

    // Set up ResizeObserver with debouncing to prevent jitter
    if (containerRef.value) {
      let resizeTimeout: number | null = null
      resizeObserver = new ResizeObserver(() => {
        if (resizeTimeout) clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          if (editor) {
            editor.resize()
          }
        }, 150) as unknown as number
      })

      resizeObserver.observe(containerRef.value)
    }

    // Single visibility check
    forceEditorVisibility()

    // Add Ctrl+Enter key binding
    editor!.commands.addCommand({
      name: 'runCode',
      // Bind both Enter and Return aliases in case a keymap uses one or the other
      bindKey: {
        win: 'Ctrl-Enter|Ctrl-Return',
        mac: 'Cmd-Enter|Command-Enter|Cmd-Return|Command-Return',
      },
      exec: () => runCode(),
    })

    // Hard override: capture Ctrl/Cmd+Enter at the DOM level to avoid
    // keymap conflicts (e.g., VSCode handler using Ctrl+Enter)
    keydownHandlerRef = (e: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey
      const isEnter = e.key === 'Enter'
      if (ctrlOrCmd && isEnter) {
        e.preventDefault()
        e.stopPropagation()
        runCode()
      }
    }
    ;(editor as unknown as { container: HTMLElement }).container.addEventListener(
      'keydown',
      keydownHandlerRef,
      { capture: true },
    )

    // Focus event listener
    editor!.on('focus', () => {
      containerRef.value?.classList.add('focused')
    })

    editor!.on('blur', () => {
      containerRef.value?.classList.remove('focused')
    })

    // Listen for content changes to dynamically resize
    editor!.on('change', () => {
      if (editor) {
        const currentCode = editor.getValue()
        updateEditorHeight(currentCode)
      }
    })
  } catch (error) {
    console.error('Failed to initialize Ace Editor:', error)
  }
}

// Load Ace Editor from CDN
interface AceGlobal {
  edit: (el: string | HTMLElement) => AceEditor
  require: (path: string) => unknown
}

const loadAceEditor = (): Promise<AceGlobal> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    const winAce = (window as unknown as { ace?: AceGlobal }).ace
    if (winAce) {
      resolve(winAce)
      return
    }

    // Load Ace Editor from jsDelivr CDN
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/ace-builds@1.43.2/src-noconflict/ace.js'
    script.onload = () => {
      // Load modes, theme, and language tools extension
      const resources = [
        'mode-python',
        'mode-javascript',
        'mode-typescript',
        'mode-ruby',
        'theme-chrome',
        'ext-language_tools',
        'keybinding-vscode',
      ]

      const loadResource = (name: string) =>
        new Promise<void>((resolveRes) => {
          const resScript = document.createElement('script')
          resScript.src = `https://cdn.jsdelivr.net/npm/ace-builds@1.43.2/src-noconflict/${name}.js`
          resScript.onload = () => resolveRes()
          resScript.onerror = () => resolveRes()
          document.head.appendChild(resScript)
        })

      Promise.all(resources.map(loadResource)).then(() => {
        const loadedAce = (window as unknown as { ace?: AceGlobal }).ace
        if (loadedAce) resolve(loadedAce)
        else reject(new Error('Ace failed to load'))
      })
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Utility: wait until an element has a non-zero rendered size
const waitForVisibleSize = (el: HTMLElement, minW = 1, minH = 1, timeout = 1500): Promise<void> => {
  return new Promise((resolve) => {
    const start = performance.now()
    const check = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      const cs = window.getComputedStyle(el)
      const visible =
        cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity || '1') > 0
      if (w >= minW && h >= minH && visible) {
        resolve()
        return
      }
      if (performance.now() - start > timeout) {
        resolve()
        return
      }
      requestAnimationFrame(check)
    }
    check()
  })
}

// Run code function
const runCode = () => {
  if (editor) {
    const code = editor.getValue()
    props.onRunCode(code)
    // Restore focus to this editor after sending code
    requestAnimationFrame(() => {
      try {
        ;(editor as AceEditor).focus()
      } catch {
        // ignore
      }
    })
  }
}

// Watch for code changes
watch(
  () => props.code,
  (newCode) => {
    if (editor && newCode !== editor.getValue()) {
      editor.setValue(newCode, -1)
      updateEditorHeight(newCode)
    }
  },
)

// Lifecycle
onMounted(async () => {
  if (import.meta.env.DEV) {
    console.log('[AceCodeBlock] Component mounted, initializing editor...')
  }

  // Force immediate dimensions before any async operations
  if (containerRef.value && editorRef.value) {
    const parent = containerRef.value as HTMLElement
    const editorEl = editorRef.value as HTMLElement
    const dynamicHeight = calculateEditorHeight(props.code)

    parent.style.cssText =
      `width: 100% !important; height: ${dynamicHeight}px !important; min-height: ${MIN_HEIGHT}px !important; max-height: ${MAX_HEIGHT}px !important; display: block !important; position: relative !important; box-sizing: border-box !important;`
    editorEl.style.cssText =
      `width: 100% !important; height: ${dynamicHeight}px !important; min-height: ${MIN_HEIGHT}px !important; max-height: ${MAX_HEIGHT}px !important; display: block !important; position: relative !important; box-sizing: border-box !important;`
  }

  await nextTick()

  // Set up scroll-aware resize using VueUse
  try {
    const scrollParent = getScrollParent(containerRef.value || null)
    const { y: scrollY } = useScroll(scrollParent || window, { throttle: 16 })

    // Watch scroll position and resize editor when visible
    watch(scrollY, () => {
      try {
        const el = containerRef.value as HTMLElement | undefined
        if (!el || !editor) return
        const rect = el.getBoundingClientRect()
        const vpH = window.innerHeight || document.documentElement.clientHeight
        const visible = rect.bottom > 0 && rect.top < vpH
        if (visible) {
          editor.resize()
        }
      } catch {}
    })

    // Also observe intersection with the scroll root, to resize when entering viewport
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting && editor) {
          requestAnimationFrame(() => {
            try {
              if (editor) {
                editor.resize()
              }
            } catch {}
          })
        }
      },
      { root: scrollParent, threshold: 0.01 },
    )
    if (containerRef.value) intersectionObserver.observe(containerRef.value)
  } catch {}

  // Additional delay to ensure DOM is stable
  setTimeout(async () => {
    await initEditor()
    if (import.meta.env.DEV) {
      console.log('[AceCodeBlock] Editor initialization complete')
    }
  }, 50)
})

onUnmounted(() => {
  if (editor) {
    editor.destroy()
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (intersectionObserver) {
    try {
      intersectionObserver.disconnect()
    } catch {}
    intersectionObserver = null
  }
  try {
    const container = (editor as unknown as { container?: HTMLElement })?.container
    if (container && keydownHandlerRef) {
      container.removeEventListener('keydown', keydownHandlerRef, {
        capture: true,
      } as unknown as boolean)
    }
  } catch {}
})
</script>

<style scoped>
.ace-code-block {
  position: relative;
  background: transparent;
  border-radius: 0.5rem;
  margin: 1rem 0 1.5rem 0;
  width: 100%;
  min-height: 103px; /* ~4 lines */
  max-height: 2560px; /* ~100 lines */
  display: block;
  overflow: visible;
}

.ace-code-block.focused {
  outline: none;
}

.ace-run-button {
  position: absolute;
  top: 0.6rem;
  right: 0.75rem;
  z-index: 1000;
  background: #10b981;
  color: white;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ace-run-button:hover {
  background: #059669;
}

.ace-run-button:active {
  background: #047857;
}

.ace-editor-container {
  width: 100%;
  min-height: 103px; /* ~4 lines */
  max-height: 2560px; /* ~100 lines */
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  position: relative;
  display: block;
  overflow: visible;
}

/* Ace Editor custom styles */
:deep(.ace_editor) {
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
  font-size: 16px !important;
  line-height: 1.6 !important;
}

:deep(.ace_gutter) {
  background: #f8fafc !important;
  border-right: 1px solid #e5e7eb !important;
}

:deep(.ace_gutter-cell) {
  color: #6b7280 !important;
}

:deep(.ace_scroller) {
  background: #f3f4f6 !important;
}

:deep(.ace_cursor) {
  border-left: 2px solid #3b82f6 !important;
}

:deep(.ace_selection) {
  background: rgba(59, 130, 246, 0.2) !important;
}

:deep(.ace_active-line) {
  background: rgba(59, 130, 246, 0.05) !important;
}

/* Remove scrollbar overrides - let Ace handle scrolling internally */

/* Style the scrollbar track and thumb */
:deep(.ace_scrollbar-v::-webkit-scrollbar) {
  width: 14px;
}

:deep(.ace_scrollbar-v::-webkit-scrollbar-track) {
  background: #f1f5f9;
  border-radius: 4px;
}

:deep(.ace_scrollbar-v::-webkit-scrollbar-thumb) {
  background: #cbd5e1;
  border-radius: 4px;
  border: 2px solid #f1f5f9;
}

:deep(.ace_scrollbar-v::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8;
}

:deep(.ace_scrollbar-h::-webkit-scrollbar) {
  height: 14px;
}

:deep(.ace_scrollbar-h::-webkit-scrollbar-track) {
  background: #f1f5f9;
  border-radius: 4px;
}

:deep(.ace_scrollbar-h::-webkit-scrollbar-thumb) {
  background: #cbd5e1;
  border-radius: 4px;
  border: 2px solid #f1f5f9;
}

:deep(.ace_scrollbar-h::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8;
}
</style>
