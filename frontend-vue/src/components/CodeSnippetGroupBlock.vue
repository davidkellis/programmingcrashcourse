<template>
  <div class="code-example is-group">
    <div class="code-toolbar group-toolbar">
      <div class="group-header">
        <span class="code-context"
          ><strong>{{ group.title }}</strong></span
        >
        <span v-if="group.description" class="group-description">{{ group.description }}</span>
      </div>
      <span class="toolbar-spacer"></span>
      <button @click="runGroup" class="run-button run-group-button">Run Group</button>
    </div>

    <!-- Compact, scannable list -->
    <div class="group-snippets compact">
      <div v-for="snippet in group.snippets" :key="snippet.id" class="snippet-row">
        <div class="snippet-main">
          <code class="snippet-code-preview" :title="composeTitle(snippet)">{{
            composePreview(snippet)
          }}</code>
        </div>
        <button @click="runSnippet(snippet.code)" class="run-button run-micro">Run</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CodeSnippetGroup } from '@/types'

interface Props {
  group: CodeSnippetGroup
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'run-code': [code: string]
  'run-code-sequence': [
    payload: { codes: string[]; continueOnError?: boolean; groupId?: string; title?: string },
  ]
}>()

const runSnippet = (code: string) => emit('run-code', code)
const runGroup = () => {
  const codes = props.group.snippets.map((s) => s.code)
  emit('run-code-sequence', {
    codes,
    continueOnError: props.group.continueOnError ?? false,
    groupId: props.group.id,
    title: props.group.title,
  })
}

// One-line, trimmed preview for scanning
const preview = (code: string) => {
  const oneLine = code.replace(/\s+/g, ' ').trim()
  const max = 90
  return oneLine.length > max ? oneLine.slice(0, max) + '…' : oneLine
}

const commentPrefixFor = (lang: string | undefined) => {
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

type Snippet = { code: string; language?: string; context?: string; explanation?: string }
const composePreview = (snippet: Snippet) => {
  const code = preview(snippet.code)
  const desc = (snippet.context || snippet.explanation || '').trim()
  if (!desc) return code
  const prefix = commentPrefixFor(snippet.language)
  return `${code}  ${prefix} ${desc}`
}

const composeTitle = (snippet: Snippet) => {
  const desc = (snippet.context || snippet.explanation || '').trim()
  if (!desc) return snippet.code
  const prefix = commentPrefixFor(snippet.language)
  return `${snippet.code}  ${prefix} ${desc}`
}
</script>

<style scoped>
.code-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 1rem 0.55rem 0.8rem;
  background: #e3f2fd;
  border-bottom: 1px solid #e5e7eb;
}

.group-toolbar .toolbar-spacer {
  flex: 1 1 auto;
}

.group-header {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.code-context {
  font-size: 1rem;
  color: #0b5ed7;
  font-weight: 600;
}

.code-pre {
  background: #f3f4f6;
  color: #111827;
  padding: 1rem;
  margin: 0;
  border-radius: 0 0 0.5rem 0.5rem;
  overflow-x: auto;
}

.code-explanation {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}
.code-explanation.compact-desc {
  font-size: 0.95rem;
  padding: 0.5rem 0.8rem;
}

.group-description {
  margin: 0 !important;
  padding: 0;
  display: block;
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.25;
}

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
.run-button:hover {
  background: #059669;
}
.run-micro {
  padding: 0.25rem 0.6rem;
  font-size: 0.9rem;
}

/* Compact list styles */
.group-snippets.compact {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 0;
}
.snippet-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.2rem 0.8rem;
  background: transparent;
  border: none;
  border-radius: 0;
}
/* Remove the adjacent sibling selector since we now add borders to all rows */
.snippet-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1 1 auto;
  min-width: 0;
}
.snippet-code-preview {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  background: transparent;
  color: #111827;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1 1 auto;
  min-width: 0;
}

.code-example {
  margin: 0.75rem 0;
}
</style>
