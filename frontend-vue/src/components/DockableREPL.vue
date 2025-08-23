<template>
  <div
    class="dockable-repl"
    :class="[`docked-${position}`, { 'pane-mode': asPane }]"
    :style="replStyle"
    ref="replContainer"
  >
    <!-- Resize handle -->
    <div
      class="resize-handle"
      :class="`resize-handle--${position}`"
      @mousedown="startResize"
    ></div>

    <div class="repl-header">
      <div class="repl-title">
        {{ language?.name || 'Python' }} REPL
      </div>
      <div class="repl-controls">
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
              Python 3.13.5 (main, Jun 12 2025, 12:40:22) [Clang 20.1.4 ] on linux<br>
              Type "help", "copyright", "credits" or "license" for more information.
            </span>
            <span v-else-if="props.language?.id === 'javascript'">
              JavaScript REPL with MathJS v{{ mathJSVersion }}<br>
              Type "help" for available functions, or try: sin(PI/2), mean([1,2,3,4,5])
            </span>
            <span v-else-if="props.language?.id === 'ruby' || props.language?.id === 'ruby-wasm'">
              Ruby (CRuby WASM) REPL<br>
              Larger download, initializing in-browser CRuby…
            </span>
            <span v-else>
              {{ props.language?.name || 'Unknown' }} REPL<br>
              Ready for code execution.
            </span>
          </div>
        </div>

        <div v-for="record in history" :key="record.id" class="repl-record">
          <div v-for="(line, lineIndex) in record.inputLines" :key="lineIndex" class="repl-input-line">
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
            class="repl-input"
            :placeholder="isSessionReady ? '' : 'Initializing runtime…'"
            @keydown="handleKeydown"
            @input="autoResize"
            :disabled="isExecuting || !isSessionReady"
            rows="1"
          ></textarea>
          <button
            @click="executeCode"
            class="run-button"
            :disabled="isExecuting || !currentInput.trim() || !isSessionReady"
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
import { ref, nextTick, computed, watch, onMounted } from 'vue'
import type { Language, ExecutionRecord } from '@/types'

interface Props {
  sessionId: string | null
  language: Language | null
  history: ExecutionRecord[]
  variables: Record<string, unknown>
  isExecuting: boolean
  asPane?: boolean
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

// MathJS version for display
const mathJSVersion = ref('11.11.0')

// Resize state
const size = ref({ width: 350, height: 300 })
const isResizing = ref(false)
const startResizeData = ref({ x: 0, y: 0, startSize: { width: 0, height: 0 } })

const DEFAULT_PERCENT = 0.3

// Computed style for the REPL
const replStyle = computed(() => {
  if (props.asPane) {
    return { width: '100%', height: '100%', position: 'relative' as const }
  }
  if (position.value === 'right') {
    return { width: `${size.value.width}px`, height: '100%' }
  } else {
    return { width: '100%', height: `${size.value.height}px` }
  }
})

const setDefaultSizeFromViewport = () => {
  if (position.value === 'right') {
    size.value.width = Math.max(300, Math.round(window.innerWidth * DEFAULT_PERCENT))
  } else {
    size.value.height = Math.max(240, Math.round(window.innerHeight * DEFAULT_PERCENT))
  }
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
    startSize: { ...size.value }
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
  if (!currentInput.value.trim() || props.isExecuting) return

  const code = currentInput.value.trim()
  currentInput.value = ''
  currentPrompt.value = '>>> '
  isMultiLine.value = false
  executedFromRepl.value = true

  emit('execute', code)

  await nextTick()
  if (historyContainer.value) {
    historyContainer.value.scrollTop = historyContainer.value.scrollHeight
  }

  requestAnimationFrame(() => {
    if (inputTextarea.value) inputTextarea.value.focus()
  })
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && event.ctrlKey) {
    event.preventDefault(); if (isSessionReady.value) executeCode()
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const textarea = event.target as HTMLTextAreaElement
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    currentInput.value = currentInput.value.substring(0, start) + '\n' + currentInput.value.substring(end)
    nextTick(() => { if (textarea) textarea.selectionStart = textarea.selectionEnd = start + 1 })
    if (currentInput.value.trim()) { currentPrompt.value = '... '; isMultiLine.value = true }
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

watch(() => props.isExecuting, (isExecuting, wasExecuting) => {
  if (wasExecuting && !isExecuting) {
    if (executedFromRepl.value) {
      requestAnimationFrame(() => { if (inputTextarea.value) { inputTextarea.value.focus(); autoResize() } })
    }
    executedFromRepl.value = false
  }
})

watch(() => currentInput.value, () => { nextTick(() => autoResize()) })

// Auto-scroll history when new records are appended externally
watch(() => props.history.length, () => {
  nextTick(() => {
    if (historyContainer.value) {
      historyContainer.value.scrollTop = historyContainer.value.scrollHeight
    }
  })
})

onMounted(() => {
  setDefaultSizeFromViewport()
  emit('position-change', position.value, size.value)
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
  z-index: 1000;
}

/* Pane mode removes fixed positioning and fills grid cell */
.pane-mode {
  position: relative !important;
  inset: auto !important;
  box-shadow: none;
}

.resize-handle {
  position: absolute;
  background: #3b82f6;
  transition: all 0.2s;
  cursor: pointer;
  z-index: 1001;
  opacity: 0.7;
}

.resize-handle:hover { background: #2563eb; opacity: 1; box-shadow: 0 0 8px rgba(59, 130, 246, 0.5); }

.resize-handle--bottom { top: -4px; left: 0; right: 0; height: 8px; cursor: ns-resize; }
.resize-handle--right { left: -4px; top: 0; bottom: 0; width: 8px; cursor: ew-resize; }

.docked-bottom:not(.pane-mode) { bottom: 0; left: 0; right: 0; border-top: 1px solid #374151; }
.docked-right:not(.pane-mode) { top: 0; right: 0; bottom: 0; border-left: 1px solid #374151; box-shadow: -4px 0 6px -1px rgba(0, 0, 0, 0.1); }

/* Keep borders in pane-mode for visual separation */
.pane-mode.docked-right { border-left: 1px solid #374151; }
.pane-mode.docked-bottom { border-top: 1px solid #374151; }

.repl-header { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; background: #111827; border-bottom: 1px solid #374151; min-height: 40px; position: relative; z-index: 10; }
.repl-title { font-weight: 600; font-size: 0.875rem; color: #f3f4f6; }
.repl-controls { display: flex; align-items: center; gap: 0.25rem; position: relative; z-index: 15; }
.control-button { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #374151; border: 1px solid #6b7280; color: #e5e7eb; cursor: pointer; border-radius: 0.25rem; transition: all 0.2s; position: relative; z-index: 20; }
.control-button:hover { background: #4b5563; }
.position-toggle { background: #3b82f6 !important; color: white !important; border-color: #2563eb !important; width: 40px !important; height: 32px !important; font-size: 16px !important; font-weight: bold !important; }
.close-button:hover { background: #dc2626; color: white; }

.repl-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.repl-history { flex: 1; overflow-y: auto; padding: 0.5rem; font-size: 0.875rem; line-height: 1.4; }
.repl-banner { color: #60a5fa; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 0.875rem; line-height: 1.4; margin-bottom: 1rem; padding: 0.5rem; border-bottom: 1px solid #374151; }
.banner-text { color: #9ca3af; }
.repl-record { margin-bottom: 0.75rem; }
.repl-input-line { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
.repl-prompt { color: #60a5fa; font-weight: bold; flex-shrink: 0; }
.repl-input-text { color: #e5e7eb; flex: 1; }
.repl-output { margin-left: 2rem; color: #d1d5db; }
.repl-output pre { margin: 0; white-space: pre-wrap; word-break: break-word; }
.repl-error { margin-left: 2rem; color: #f87171; }
.repl-error pre { margin: 0; white-space: pre-wrap; word-break: break-word; }
.repl-input-section { border-top: 1px solid #374151; background: #111827; padding: 0.5rem; }
.input-line { display: flex; align-items: flex-start; gap: 0.5rem; min-height: 20px; }
.repl-input { flex: 1; background: transparent; border: none; color: #e5e7eb; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 0.875rem; padding: 0; resize: none; outline: none; line-height: 1.4; min-height: 20px; max-height: 160px; overflow-y: auto; }
.repl-input:focus { outline: none; }
.run-button { background: #059669; color: white; border: none; padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: all 0.2s; flex-shrink: 0; align-self: flex-end; margin-top: 0.125rem; }
.run-button:hover:not(:disabled) { background: #047857; transform: translateY(-1px); }
.run-button:disabled { background: #374151; color: #6b7280; cursor: not-allowed; transform: none; }
.run-button:active:not(:disabled) { transform: translateY(0); }
</style>
