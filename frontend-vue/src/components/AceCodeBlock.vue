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
}

let editor: AceEditor | null = null
let keydownHandlerRef: ((e: KeyboardEvent) => void) | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null

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

  // Force dimensions on both containers
  parentContainer.style.width = '100%'
  parentContainer.style.height = '200px'
  parentContainer.style.minHeight = '200px'
  parentContainer.style.display = 'block'

  container.style.width = '100%'
  container.style.height = '200px'
  container.style.minHeight = '200px'
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
      wrap: true,
      maxLines: Infinity,
      minLines: 5,
    })

    // Force resize after initialization with multiple attempts
    setTimeout(() => {
      if (editor) {
        editor.resize()
        if (import.meta.env.DEV) {
          console.log('[AceCodeBlock] Editor resized after timeout')
          console.log('[AceCodeBlock] Post-resize dimensions:', {
            width: editorRef.value?.offsetWidth,
            height: editorRef.value?.offsetHeight,
          })
        }
      }
    }, 100)

    // Additional resize attempt after longer delay
    setTimeout(() => {
      if (editor) {
        editor.resize()
        if (import.meta.env.DEV) {
          console.log('[AceCodeBlock] Second resize attempt')
        }
      }
    }, 300)

    // Bypass all CSS and force absolute positioning
    const forceEditorVisibility = () => {
      const parent = containerRef.value as HTMLElement
      const editorContainer = editorRef.value as HTMLElement

      if (parent) {
        // Ensure parent remains sized/visible without altering classes
        // (Do not strip classes; they hold important styles)
        // Keep dimensions stable
        if (!parent.style.width) parent.style.width = '100%'
        if (!parent.style.height) parent.style.height = '200px'
        if (!parent.style.minHeight) parent.style.minHeight = '200px'
        parent.style.display = 'block'

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
        if (!editorContainer.style.height) editorContainer.style.height = '200px'
        if (!editorContainer.style.minHeight) editorContainer.style.minHeight = '200px'
        editorContainer.style.position = 'relative'
        editorContainer.style.display = 'block'

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

    // Set up ResizeObserver to detect size changes (throttled)
    if (containerRef.value) {
      let roScheduled = false
      resizeObserver = new ResizeObserver(() => {
        if (roScheduled) return
        roScheduled = true
        requestAnimationFrame(() => {
          roScheduled = false
          forceEditorVisibility()
        })
      })

      resizeObserver.observe(containerRef.value)
      if (editorRef.value) {
        resizeObserver.observe(editorRef.value)
      }
    }

    // Force visibility immediately and repeatedly
    forceEditorVisibility()
    setTimeout(forceEditorVisibility, 100)
    setTimeout(forceEditorVisibility, 300)
    setTimeout(forceEditorVisibility, 500)

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

    parent.style.cssText =
      'width: 100% !important; height: 200px !important; display: block !important; position: relative !important; box-sizing: border-box !important;'
    editorEl.style.cssText =
      'width: 100% !important; height: 200px !important; display: block !important; position: relative !important; box-sizing: border-box !important;'
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
    try { intersectionObserver.disconnect() } catch {}
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
  overflow: hidden;
  width: 100% !important;
  height: 200px !important;
  min-height: 200px !important;
  display: block !important;
  /* Paint stability hints */
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.ace-code-block.focused {
  outline: none;
}

.ace-run-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  background: #10b981;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ace-run-button:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.ace-run-button:active {
  transform: translateY(0);
}

.ace-editor-container {
  width: 100% !important;
  height: 200px !important;
  min-height: 200px !important;
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  display: block !important;
  position: relative !important;
  /* Paint stability hints */
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
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
</style>
