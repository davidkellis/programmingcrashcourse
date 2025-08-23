<template>
  <div class="ace-code-block" ref="containerRef">
    <!-- Floating Run button in top-right corner -->
    <button
      class="ace-run-button"
      @click="runCode"
      :title="`Run ${language} code (Ctrl+Enter)`"
    >
      Run
    </button>

    <!-- Ace Editor container -->
    <div
      :id="editorId"
      class="ace-editor-container"
      ref="editorRef"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

interface Props {
  code: string
  language: string
  onRunCode: (code: string) => void
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
  on: (event: string, cb: () => void) => void
  session: { setMode: (mode: string) => void }
  commands: { addCommand: (cmd: { name: string; bindKey: Record<string, string>; exec: () => void }) => void }
  setKeyboardHandler?: (handler: string) => void
}

let editor: AceEditor | null = null
let keydownHandlerRef: ((e: KeyboardEvent) => void) | null = null

// Language mode mapping
const languageModeMap: Record<string, string> = {
  'python': 'ace/mode/python',
  'javascript': 'ace/mode/javascript',
  'typescript': 'ace/mode/typescript',
  'ruby': 'ace/mode/ruby',
  'js': 'ace/mode/javascript',
  'ts': 'ace/mode/typescript',
  'py': 'ace/mode/python',
  'rb': 'ace/mode/ruby'
}

// Initialize Ace Editor
const initEditor = async () => {
  if (!editorRef.value) return

  try {
    // Dynamically load Ace Editor from CDN
    const ace = await loadAceEditor()

    // Create editor instance
    editor = ace.edit(editorRef.value as HTMLElement) as AceEditor

    // set keyboard shortcuts (if available)
    try {
      if (editor && typeof editor.setKeyboardHandler === 'function') {
        editor.setKeyboardHandler("ace/keyboard/vscode")
      }
    } catch {}

    // Set theme and mode
    editor!.setTheme('ace/theme/chrome')
    const mode = languageModeMap[props.language.toLowerCase()] || 'ace/mode/text'
    editor!.session.setMode(mode)

    // Set initial content
    editor!.setValue(props.code, -1)

    // Ensure language tools are available
    try { ace.require('ace/ext/language_tools') } catch {}

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
      maxLines: 20,
      minLines: 3
    })

    // Add Ctrl+Enter key binding
    editor!.commands.addCommand({
      name: 'runCode',
      // Bind both Enter and Return aliases in case a keymap uses one or the other
      bindKey: { win: 'Ctrl-Enter|Ctrl-Return', mac: 'Cmd-Enter|Command-Enter|Cmd-Return|Command-Return' },
      exec: () => runCode()
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
    ;(editor as unknown as { container: HTMLElement }).container.addEventListener('keydown', keydownHandlerRef, { capture: true })

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
        'keybinding-vscode'
      ]

      const loadResource = (name: string) => new Promise<void>((resolveRes) => {
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

// Run code function
const runCode = () => {
  if (editor) {
    const code = editor.getValue()
    props.onRunCode(code)
    // Restore focus to this editor after sending code
    requestAnimationFrame(() => {
      try { (editor as AceEditor).focus() } catch {
        // ignore
      }
    })
  }
}

// Watch for code changes
watch(() => props.code, (newCode) => {
  if (editor && newCode !== editor.getValue()) {
    editor.setValue(newCode, -1)
  }
})

// Lifecycle
onMounted(async () => {
  await nextTick()
  await initEditor()
})

onUnmounted(() => {
  if (editor) {
    editor.destroy()
  }
  try {
    const container = (editor as unknown as { container?: HTMLElement })?.container
    if (container && keydownHandlerRef) {
      container.removeEventListener('keydown', keydownHandlerRef, { capture: true } as unknown as boolean)
    }
  } catch {}
})
</script>

<style scoped>
.ace-code-block {
  position: relative;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 1px rgba(0,0,0,0.02);
  margin: 1rem 0 1.5rem 0;
  overflow: hidden;
}

.ace-code-block.focused {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  width: 100%;
  min-height: 120px;
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
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
