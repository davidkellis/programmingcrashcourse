<template>
  <div class="language-selector" role="group" aria-label="Language selector">
    <div class="segmented">
      <button
        v-for="language in languages"
        :key="language.id"
        type="button"
        class="segment"
        :class="{ active: selectedLanguage && selectedLanguage.id === language.id }"
        :disabled="disabled"
        @click="handleSelect(language)"
      >
        {{ language.name }}
      </button>
    </div>
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
  'language-change': [language: Language | null]
}>()

const handleSelect = (language: Language) => {
  // Toggle off if already selected
  if (props.selectedLanguage && props.selectedLanguage.id === language.id) {
    emit('language-change', null)
    return
  }
  emit('language-change', language)
}
</script>

<style scoped>
.language-selector { display: flex; align-items: center; }

.segmented { display: inline-flex; border: 1px solid #d1d5db; border-radius: 0.5rem; overflow: hidden; background: #fff; }
.segment {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  color: #374151;
  background: #ffffff;
  border: none;
  border-right: 1px solid #e5e7eb;
  cursor: pointer;
  line-height: 1.2;
}
.segment:last-child { border-right: none; }
.segment:hover:not(:disabled) { background: #f3f4f6; }
.segment:disabled { color: #9ca3af; cursor: not-allowed; }
.segment.active {
  background: #e3f2fd;
  color: #0b5ed7;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.08);
  font-weight: 600;
}
</style>
