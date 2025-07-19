<template>
  <div class="language-selector">
    <select
      :value="selectedLanguage?.id || ''"
      @change="handleChange"
      :disabled="disabled"
      class="language-select"
    >
      <option value="">Select Language</option>
      <option
        v-for="language in languages"
        :key="language.id"
        :value="language.id"
      >
        {{ language.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { Language } from '@/types'

interface Props {
  languages: Language[]
  selectedLanguage: Language | null
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'language-change': [language: Language]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const languageId = target.value

  if (languageId) {
    const language = props.languages.find(lang => lang.id === languageId)
    if (language) {
      emit('language-change', language)
    }
  }
}
</script>

<style scoped>
.language-selector {
  display: flex;
  align-items: center;
}

.language-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  min-width: 150px;
}

.language-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.language-select:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}
</style>
