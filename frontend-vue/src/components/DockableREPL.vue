<template>
  <div
    ref="replContainer"
    :class="[
      'dockable-repl',
      {
        'as-pane': asPane,
        'pane-mode': asPane,
        'position-bottom': position === 'bottom',
        'position-right': position === 'right',
      },
    ]"
  >
    <!-- Resize handle -->
    <div class="resize-handle" :class="`resize-handle--${position}`" @mousedown="startResize"></div>

    <div class="repl-header">
      <div class="repl-title">{{ language?.name || 'Python' }} REPL</div>
      <div class="repl-controls">
        <!-- Size control buttons -->
        <div class="size-control-group">
          <button
            class="size-button"
            :class="{ active: currentSizeRatio === 0.5 }"
            @click="setSizeRatio(0.5)"
            title="Half size"
          >
            ½
          </button>
          <button
            class="size-button"
            :class="{ active: currentSizeRatio === 0.33 }"
            @click="setSizeRatio(0.33)"
            title="Third size"
          >
            ⅓
          </button>
          <button
            class="size-button"
            :class="{ active: currentSizeRatio === 0.25 }"
            @click="setSizeRatio(0.25)"
            title="Quarter size"
          >
            ¼
          </button>
        </div>
        <button
          class="control-button position-toggle"
          @click="togglePosition"
          :title="`Dock to ${position === 'bottom' ? 'right' : 'bottom'}`"
        >
          {{ position === 'bottom' ? '→' : '↓' }}
        </button>
        <button
          class="control-button close-button"
          @click="$emit('toggle-visibility')"
          title="Hide REPL"
        >
          ✕
        </button>
      </div>
    </div>

    <div class="repl-content">
      <div class="repl-history" ref="historyContainer">
        <div v-if="!isSessionReady" class="repl-banner">
          <div class="banner-text">Preparing runtime… please wait.</div>
        </div>
        <!-- Language banner -->
        <div v-if="history.length === 0" class="repl-banner">
          <div class="banner-text">
            <span v-if="props.language?.id === 'python'">
              Python 3.13.5 (main, Jun 12 2025, 12:40:22) [Clang 20.1.4 ] on linux<br />
              Type "help", "copyright", "credits" or "license" for more information.
            </span>
            <span v-else-if="props.language?.id === 'javascript'">
              JavaScript REPL with MathJS v{{ mathJSVersion }}<br />
              Type "help" for available functions, or try: sin(PI/2), mean([1,2,3,4,5])
            </span>
            <span v-else-if="props.language?.id === 'ruby' || props.language?.id === 'ruby-wasm'">
              Ruby (CRuby WASM) REPL<br />
              Larger download, initializing in-browser CRuby…
            </span>
            <span v-else>
              {{ props.language?.name || 'Unknown' }} REPL<br />
              Ready for code execution.
            </span>
          </div>
        </div>

        <div v-for="record in history" :key="record.id" class="repl-record">
          <div
            v-for="(line, lineIndex) in record.inputLines || []"
            :key="lineIndex"
            class="repl-input-line"
          >
            <span class="repl-prompt">{{ line.prompt }}</span>
            <span class="repl-input-text">{{ line.text }}</span>
          </div>
          <div v-if="record.output" class="repl-output">
            <pre>{{ record.output }}</pre>
          </div>
          <div v-if="record.error" class="repl-error">
            <pre>{{ record.error }}</pre>
          </div>
        </div>
      </div>

      <div class="repl-input-section">
        <div class="input-line">
          <span class="repl-prompt">{{ currentPrompt }}</span>
          <textarea
            ref="inputTextarea"
            v-model="currentInput"
            @keydown="handleKeydown"
            @input="autoResize"
            @focus="() => console.log(`[${instanceId}] REPL input focused`)"
            @blur="() => console.log(`[${instanceId}] REPL input blurred`)"
            placeholder="Enter an expression or statement..."
            class="repl-input"
            :disabled="isExecuting || !isSessionReady"
            rows="1"
          ></textarea>
          <button
            @click="executeCode"
            class="run-button"
            :disabled="isExecuting || !currentInput || !isSessionReady"
            :title="isSessionReady ? 'Run code (Ctrl+Enter)' : 'Runtime not ready'"
          >
            Run
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, onMounted, onUnmounted } from 'vue'
import { globalSharedHistoryArray, addToSharedHistory } from '@/utils/globalREPLHistory'

interface InputLine {
  prompt: string
  text: string
}

interface ExecutionRecord {
  id: string
  timestamp: Date
  input: string
  inputLines?: InputLine[]
  output: string
  error?: string
  executionTime?: number
}

interface Language {
  id: string
  name: string
}

interface Props {
  sessionId: string | null
  language: Language | null
  history: ExecutionRecord[]
  variables: Record<string, unknown>
  isExecuting: boolean
  asPane?: boolean
  lastExecutedCode?: string
}

const props = withDefaults(defineProps<Props>(), { asPane: false })
const isSessionReady = computed(() => !!props.sessionId)

const emit = defineEmits<{
  execute: [code: string]
  'toggle-visibility': []
  'position-change': [position: 'bottom' | 'right', size: { width: number; height: number }]
}>()

const position = ref<'bottom' | 'right'>('right')
const currentInput = ref('')
const historyContainer = ref<HTMLElement>()
const replContainer = ref<HTMLElement>()
const inputTextarea = ref<HTMLTextAreaElement>()

// REPL state
const currentPrompt = ref('>>> ')
const isMultiLine = ref(false)
const executedFromRepl = ref(false)

// Create a reactive ref that syncs with the global shared array
const globalCommandHistory = ref<string[]>([])

const addToGlobalHistory = (code: string) => {
  addToSharedHistory(code)
  // Sync the reactive ref with the global shared array
  globalCommandHistory.value = [...globalSharedHistoryArray]
}

// Initialize commandHistory from global history to ensure sync
const commandHistory = ref<string[]>([])
const historyIndex = ref(-1)

// Initialize histories (sync with global shared history)
onMounted(() => {
  commandHistory.value = []
  // Sync reactive ref with the global shared array
  globalCommandHistory.value = [...globalSharedHistoryArray]
  console.log(
    `[${instanceId}] Initialized histories - synced with global:`,
    globalCommandHistory.value,
  )

  // Test: Add a test command to verify global history works
  setTimeout(() => {
    console.log(
      `[${instanceId}] Testing global history - current state:`,
      globalCommandHistory.value,
    )
    console.log(`[${instanceId}] Global shared array state:`, globalSharedHistoryArray)
  }, 1000)
})

// Debug: Log when commandHistory changes but DON'T save to storage here
// (we save via addToGlobalHistory to avoid conflicts)
watch(
  commandHistory,
  (newHistory) => {
    console.log('commandHistory changed:', newHistory)
    // Don't save here - let addToGlobalHistory handle it
  },
  { deep: true },
)

// MathJS version for display
const mathJSVersion = ref('11.11.0')

// Resize state
const size = ref({ width: 350, height: 300 })
const isResizing = ref(false)
const startResizeData = ref({ x: 0, y: 0, startSize: { width: 0, height: 0 } })

const DEFAULT_PERCENT = 0.33
const currentSizeRatio = ref(DEFAULT_PERCENT)

const setDefaultSizeFromViewport = () => {
  if (position.value === 'right') {
    size.value.width = Math.max(300, Math.round(window.innerWidth * currentSizeRatio.value))
  } else {
    size.value.height = Math.max(240, Math.round(window.innerHeight * currentSizeRatio.value))
  }
}

const setSizeRatio = (ratio: number) => {
  currentSizeRatio.value = ratio
  setDefaultSizeFromViewport()
  emit('position-change', position.value, size.value)
}

const togglePosition = () => {
  position.value = position.value === 'bottom' ? 'right' : 'bottom'
  setDefaultSizeFromViewport()
  emit('position-change', position.value, size.value)
}

const startResize = (e: MouseEvent) => {
  e.preventDefault()
  isResizing.value = true
  startResizeData.value = {
    x: e.clientX,
    y: e.clientY,
    startSize: { ...size.value },
  }

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return

  if (position.value === 'right') {
    const deltaX = startResizeData.value.x - e.clientX
    const newWidth = startResizeData.value.startSize.width + deltaX
    const maxWidth = Math.round(window.innerWidth * 0.9)
    size.value.width = Math.max(280, Math.min(maxWidth, newWidth))
  } else {
    const deltaY = startResizeData.value.y - e.clientY
    const newHeight = startResizeData.value.startSize.height + deltaY
    const maxHeight = Math.round(window.innerHeight * 0.9)
    size.value.height = Math.max(200, Math.min(maxHeight, newHeight))
  }

  emit('position-change', position.value, size.value)
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

const executeCode = async () => {
  if (!currentInput.value || !currentInput.value.trim() || props.isExecuting) return

  const code = currentInput.value

  // Add to command history if it's not empty and not the same as the last command
  if (
    code.trim() &&
    (globalCommandHistory.value.length === 0 ||
      globalCommandHistory.value[globalCommandHistory.value.length - 1] !== code)
  ) {
    addToGlobalHistory(code)
    // console.log('Added to history:', code, 'Total commands:', globalCommandHistory.value.length)
  }

  currentInput.value = ''
  currentPrompt.value = '>>> '
  isMultiLine.value = false
  executedFromRepl.value = true
  historyIndex.value = -1 // Reset history navigation

  emit('execute', code)

  await nextTick()
  if (historyContainer.value) {
    historyContainer.value.scrollTop = historyContainer.value.scrollHeight
  }

  requestAnimationFrame(() => {
    if (inputTextarea.value) inputTextarea.value.focus()
  })
}

// Helper function to check if cursor is on the first line
const isCursorOnFirstLine = (textarea: HTMLTextAreaElement): boolean => {
  const cursorPosition = textarea.selectionStart
  const textBeforeCursor = textarea.value.substring(0, cursorPosition)
  return !textBeforeCursor.includes('\n')
}

// Helper function to check if cursor is on the last line
const isCursorOnLastLine = (textarea: HTMLTextAreaElement): boolean => {
  const cursorPosition = textarea.selectionStart
  const textAfterCursor = textarea.value.substring(cursorPosition)
  return !textAfterCursor.includes('\n')
}

const handleKeydown = (event: KeyboardEvent) => {
  console.log(`[${instanceId}] ===== KEYDOWN EVENT =====`)
  console.log(
    `[${instanceId}] Keydown event:`,
    event.key,
    'Current input length:',
    currentInput.value.length,
    'Command history length:',
    commandHistory.value.length,
    'History:',
    commandHistory.value,
  )
  console.log(`[${instanceId}] Global command history length:`, globalCommandHistory.value.length)
  console.log(`[${instanceId}] Global shared array length:`, globalSharedHistoryArray.length)

  if (event.key === 'Enter' && event.ctrlKey) {
    event.preventDefault()
    if (isSessionReady.value) executeCode()
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const textarea = event.target as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    currentInput.value =
      currentInput.value.substring(0, start) + '\n' + currentInput.value.substring(end)
    nextTick(() => {
      if (textarea) textarea.selectionStart = textarea.selectionEnd = start + 1
    })
    if (currentInput.value.trim()) {
      currentPrompt.value = '... '
      isMultiLine.value = true
    }
  }

  console.log(`[${instanceId}] About to check ArrowUp, event.key:`, event.key)

  if (event.key === 'ArrowUp') {
    const textarea = event.target as HTMLTextAreaElement

    // Only navigate history if cursor is on the first line
    if (isCursorOnFirstLine(textarea)) {
      // Use global history directly for navigation
      console.log(`[${instanceId}] ===== UP ARROW PRESSED (FIRST LINE) =====`)
      console.log(`[${instanceId}] Up arrow - reactive global history:`, globalCommandHistory.value)
      console.log(`[${instanceId}] Up arrow - imported global array:`, globalSharedHistoryArray)
      console.log(`[${instanceId}] Current historyIndex:`, historyIndex.value)
      console.log(`[${instanceId}] Current input:`, currentInput.value)
      console.log(`[${instanceId}] Props history:`, props.history)

      // Force sync the reactive ref with the imported global array
      globalCommandHistory.value = [...globalSharedHistoryArray]
      console.log(
        `[${instanceId}] After sync - reactive global history:`,
        globalCommandHistory.value,
      )

      if (globalCommandHistory.value.length > 0) {
        // Navigate history when up arrow is pressed on first line
        event.preventDefault()
        if (historyIndex.value === -1) {
          // Start from the most recent command
          historyIndex.value = globalCommandHistory.value.length - 1
        } else if (historyIndex.value > 0) {
          // Go to previous command
          historyIndex.value--
        }
        if (historyIndex.value >= 0 && historyIndex.value < globalCommandHistory.value.length) {
          const command = globalCommandHistory.value[historyIndex.value] || ''
          console.log(
            `[${instanceId}] Loading command from history index`,
            historyIndex.value,
            ':',
            command,
          )
          currentInput.value = command
          nextTick(() => {
            if (textarea) {
              textarea.selectionStart = textarea.selectionEnd = currentInput.value.length
            }
          })
        }
      } else {
        console.log(`[${instanceId}] No command history available - globalCommandHistory is empty`)
      }
      console.log(`[${instanceId}] ===== END UP ARROW =====`)
    }
    // If not on first line, let the default behavior handle cursor movement
  } else if (event.key === 'ArrowDown') {
    const textarea = event.target as HTMLTextAreaElement

    // Only navigate history if cursor is on the last line
    if (isCursorOnLastLine(textarea)) {
      console.log(`[${instanceId}] Down arrow - global history:`, globalCommandHistory.value)
      console.log(`[${instanceId}] Current historyIndex:`, historyIndex.value)

      if (globalCommandHistory.value.length > 0 && historyIndex.value >= 0) {
        event.preventDefault()
        if (historyIndex.value < globalCommandHistory.value.length - 1) {
          historyIndex.value++
          currentInput.value = globalCommandHistory.value[historyIndex.value] || ''
        } else {
          // Reset to empty input when going past the end
          historyIndex.value = -1
          currentInput.value = ''
        }
        nextTick(() => {
          if (textarea) {
            textarea.selectionStart = textarea.selectionEnd = currentInput.value.length
          }
        })
      } else {
        // console.log('Not in history navigation mode')
      }
    }
    // If not on last line, let the default behavior handle cursor movement
  }
}

const autoResize = () => {
  if (inputTextarea.value) {
    inputTextarea.value.style.height = 'auto'
    const lineHeight = 20
    const lines = currentInput.value.split('\n').length
    const minHeight = lineHeight
    const maxHeight = lineHeight * 8
    const newHeight = Math.min(Math.max(lines * lineHeight, minHeight), maxHeight)
    inputTextarea.value.style.height = `${newHeight}px`
  }
}

watch(
  () => props.isExecuting,
  (isExecuting, wasExecuting) => {
    if (wasExecuting && !isExecuting) {
      if (executedFromRepl.value) {
        requestAnimationFrame(() => {
          if (inputTextarea.value) {
            inputTextarea.value.focus()
            autoResize()
          }
        })
      }
      executedFromRepl.value = false
    }
  },
)

watch(
  () => currentInput.value,
  () => {
    nextTick(() => autoResize())
  },
)

watch(currentInput, () => {
  if (
    historyIndex.value !== -1 &&
    currentInput.value !== globalCommandHistory.value[historyIndex.value]
  ) {
    historyIndex.value = -1
  }
})

// Auto-scroll history when new records are appended externally
watch(
  () => props.history.length,
  () => {
    nextTick(() => {
      if (historyContainer.value) {
        historyContainer.value.scrollTop = historyContainer.value.scrollHeight
      }
    })
  },
)

// Watch for new history records and add them to command history for up arrow functionality
watch(
  () => props.history,
  (newHistory, oldHistory) => {
    console.log(`[${instanceId}] ===== HISTORY WATCHER TRIGGERED =====`)
    console.log(`[${instanceId}] History watcher triggered:`, {
      newLength: newHistory.length,
      oldLength: oldHistory ? oldHistory.length : 0,
      latestRecord: newHistory[newHistory.length - 1],
      fullNewHistory: newHistory,
      fullOldHistory: oldHistory,
    })
    console.log(`[${instanceId}] Detailed history comparison:`)
    console.log(
      `[${instanceId}] - New history items:`,
      newHistory.map((item, i) => `${i}: ${JSON.stringify(item)}`),
    )
    console.log(
      `[${instanceId}] - Old history items:`,
      oldHistory ? oldHistory.map((item, i) => `${i}: ${JSON.stringify(item)}`) : 'null',
    )
    console.log(
      `[${instanceId}] Current global history before processing:`,
      globalCommandHistory.value,
    )

    // Check if we have new items by comparing lengths OR if there are more items than in global history
    const hasNewItems =
      newHistory.length > (oldHistory?.length || 0) ||
      newHistory.length > globalCommandHistory.value.length

    console.log(`[${instanceId}] Checking for new items:`, {
      newLength: newHistory.length,
      oldLength: oldHistory?.length || 0,
      globalHistoryLength: globalCommandHistory.value.length,
      hasNewItems,
    })

    if (hasNewItems) {
      const latestRecord = newHistory[newHistory.length - 1]
      console.log(`[${instanceId}] Processing new history record:`, latestRecord)

      if (latestRecord && latestRecord.input) {
        const code = latestRecord.input
        console.log(`[${instanceId}] Found input code:`, code)

        // Add to command history if it's not empty and not the same as the last command
        if (
          code.trim() &&
          (globalCommandHistory.value.length === 0 ||
            globalCommandHistory.value[globalCommandHistory.value.length - 1] !== code)
        ) {
          console.log(`[${instanceId}] Adding to history via addToGlobalHistory:`, code)
          console.log(`[${instanceId}] Global shared array before add:`, globalSharedHistoryArray)
          addToGlobalHistory(code)
          console.log(`[${instanceId}] Global shared array after add:`, globalSharedHistoryArray)
          console.log(
            `[${instanceId}] Added snippet to history:`,
            code,
            'Total commands:',
            globalCommandHistory.value.length,
            'Source:',
            executedFromRepl.value ? 'Manual REPL' : 'Run button',
          )
          console.log(`[${instanceId}] Global command history:`, globalCommandHistory.value)
        } else {
          console.log(`[${instanceId}] Skipped adding to history - duplicate or empty:`, code)
        }

        // Reset the flag after processing
        executedFromRepl.value = false
      } else {
        console.log(`[${instanceId}] No input found in latest record:`, latestRecord)
      }
    } else {
      console.log(`[${instanceId}] No new history entries detected`)
    }
    console.log(`[${instanceId}] Global history after processing:`, globalCommandHistory.value)
    console.log(`[${instanceId}] ===== END HISTORY WATCHER =====`)
  },
  { deep: true },
)

// Watch for sessionId changes that might reset the component
// Watch for sessionId changes - preserve command history across sessions
watch(
  () => props.sessionId,
  (newSessionId, oldSessionId) => {
    console.log('SessionId changed from', oldSessionId, 'to', newSessionId)
    console.log('Current commandHistory before sessionId change:', commandHistory.value)
    // Don't clear history on sessionId changes - preserve command history across sessions
  },
)

// Generate unique instance ID to track component instances
const instanceId = Math.random().toString(36).substr(2, 9)

onMounted(() => {
  console.log(`DockableREPL [${instanceId}] mounted - commandHistory:`, commandHistory.value)
  setDefaultSizeFromViewport()
  emit('position-change', position.value, size.value)
})

onUnmounted(() => {
  console.log(`DockableREPL [${instanceId}] unmounted - commandHistory was:`, commandHistory.value)
})
</script>

<style scoped>
.dockable-repl {
  background: #1f2937;
  color: #e5e7eb;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  position: fixed;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  z-index: 1500;
}

/* Pane mode removes fixed positioning and fills grid cell */
.pane-mode {
  position: relative !important;
  inset: auto !important;
  box-shadow: none;
  height: 100% !important;
  width: 100% !important;
}

/* Hide resize handle in pane mode */
.pane-mode .resize-handle {
  display: none;
}

/* Ensure REPL controls are visible in pane mode */
.pane-mode .repl-controls {
  display: flex !important;
  visibility: visible !important;
}

.pane-mode .control-button {
  display: flex !important;
  visibility: visible !important;
}

.resize-handle {
  position: absolute;
  background: #3b82f6;
  transition: all 0.2s;
  cursor: pointer;
  z-index: 1001;
  opacity: 0.7;
}

.resize-handle:hover {
  background: #2563eb;
  opacity: 1;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}

.resize-handle--bottom {
  top: -4px;
  left: 0;
  right: 0;
  height: 8px;
  cursor: ns-resize;
}
.resize-handle--right {
  left: -4px;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
}

.docked-bottom:not(.pane-mode) {
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #374151;
}
.docked-right:not(.pane-mode) {
  top: 0;
  right: 0;
  bottom: 0;
  border-left: 1px solid #374151;
  box-shadow: -4px 0 6px -1px rgba(0, 0, 0, 0.1);
}

/* Keep borders in pane-mode for visual separation */
.pane-mode.docked-right {
  border-left: 1px solid #374151;
}
.pane-mode.docked-bottom {
  border-top: 1px solid #374151;
}

.repl-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #111827;
  border-bottom: 1px solid #374151;
  min-height: 40px;
  position: relative;
  z-index: 10;
}
.repl-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #f3f4f6;
}
.repl-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  position: relative;
  z-index: 15;
}
.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0.5rem 1rem;
  background: #374151;
  border: 1px solid #6b7280;
  color: #e5e7eb;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  position: relative;
  z-index: 20;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1;
}
.control-button:hover {
  background: #4b5563;
}
.position-toggle {
  background: #3b82f6 !important;
  color: white !important;
  border-color: #2563eb !important;
  font-size: 16px !important;
  font-weight: bold !important;
}
.close-button:hover {
  background: #dc2626;
  color: white;
}

.size-control-group {
  display: flex;
  background: #374151;
  border: 1px solid #6b7280;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 0.5rem;
}

.size-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0.1rem 0.3rem;
  background: transparent;
  border: none;
  border-right: 1px solid #6b7280;
  color: #e5e7eb;
  cursor: pointer;
  font-size: 1.6rem;
  font-weight: 600;
  transition: all 0.2s;
  position: relative;
  line-height: 1;
}

.size-button:last-child {
  border-right: none;
}

.size-button:hover {
  background: #4b5563;
}

.size-button.active {
  background: #3b82f6;
  color: white;
}

.size-button.active:hover {
  background: #2563eb;
}

.repl-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.repl-history {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.4;
}
.repl-banner {
  color: #60a5fa;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #374151;
}
.banner-text {
  color: #9ca3af;
}
.repl-record {
  margin-bottom: 0.75rem;
}
.repl-input-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}
.repl-prompt {
  color: #60a5fa;
  font-weight: bold;
  flex-shrink: 0;
}
.repl-input-text {
  color: #e5e7eb;
  flex: 1;
  white-space: pre;
}
.repl-output {
  padding-left: 2rem;
  color: #d1d5db;
  background: #111827;
}
.repl-output pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
.repl-error {
  margin-left: 2rem;
  color: #f87171;
}
.repl-error pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
.repl-input-section {
  border-top: 1px solid #374151;
  background: #111827;
  padding: 0.5rem;
}
.input-line {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  min-height: 20px;
}
.repl-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e5e7eb;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  padding: 0;
  resize: none;
  outline: none;
  line-height: 1.4;
  min-height: 20px;
  max-height: 160px;
  overflow-y: auto;
}
.repl-input:focus {
  outline: none;
}
.run-button {
  background: #059669;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  align-self: flex-end;
  margin-top: 0.125rem;
}
.run-button:hover:not(:disabled) {
  background: #047857;
  transform: translateY(-1px);
}
.run-button:disabled {
  background: #374151;
  color: #6b7280;
  cursor: not-allowed;
  transform: none;
}
.run-button:active:not(:disabled) {
  transform: translateY(0);
}
</style>
