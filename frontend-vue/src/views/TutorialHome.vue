<template>
  <div class="tutorial-home">
    <div class="welcome-section">
      <h1>Welcome to the Interactive Programming Tutorial</h1>
      <p class="welcome-description">
        Learn programming concepts through hands-on examples and interactive code execution.
        Choose your preferred programming language and start exploring!
      </p>





      <div class="tutorial-sections">
        <h2>Tutorial Sections</h2>
        <div v-if="isLoading" class="loading-message">
          Loading tutorial content...
        </div>
        <div v-else-if="error" class="error-message">
          <p>{{ error }}</p>
          <button @click="loadSections" class="retry-button">Try Again</button>
        </div>
        <div v-else class="sections-grid">
          <div
            v-for="section in orderedSections"
            :key="section.id"
            class="section-card"
            @click="navigateToSection(section.id)"
          >
            <div class="section-number">{{ section.order }}</div>
            <div class="section-content">
              <h3 class="section-title">{{ section.title }}</h3>
              <p class="section-preview">
                {{ getSectionPreview(section.content) }}
              </p>
              <div class="section-meta">
                <span v-if="section.codeSnippets.length > 0" class="code-count">
                  {{ section.codeSnippets.length }} code example{{ section.codeSnippets.length !== 1 ? 's' : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-section">
        <button
          class="start-button"
          @click="startTutorial"
        >
          Start Learning
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { localContentService } from '@/services/localContentService'
import { DEFAULT_LANGUAGE } from '@/constants'
import type { TutorialSection } from '@/types'

const router = useRouter()
const route = useRoute()

// No props needed - component works independently

// State for tutorial sections
const sections = ref<TutorialSection[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)



const startTutorial = () => {
  const lang = (route.params.language as string) || DEFAULT_LANGUAGE.id
  router.push({ name: 'section', params: { language: lang, sectionId: 'introduction' } })
}

const navigateToSection = (sectionId: string) => {
  const lang = (route.params.language as string) || DEFAULT_LANGUAGE.id
  router.push({ name: 'section', params: { language: lang, sectionId } })
}

const loadSections = async () => {
  try {
    isLoading.value = true
    error.value = null

    const lang = (route.params.language as string) || DEFAULT_LANGUAGE.id
    const sectionsData = await localContentService.getAllSections(lang)
    sections.value = sectionsData

  } catch (err) {
    console.error('Failed to load sections:', err)
    error.value = 'Failed to load tutorial content. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const orderedSections = computed(() => {
  return [...sections.value].sort((a, b) => a.order - b.order)
})

const getSectionPreview = (content: string): string => {
  // Remove markdown formatting and get first 150 characters
  const plainText = content
    .replace(/^#+\s*/gm, '') // Remove headers
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()

  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
}



// Load sections on component mount
onMounted(() => {
  loadSections()
})
</script>

<style scoped>
.tutorial-home {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  position: relative;
}

.welcome-section {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0 1rem;
  position: relative;
}

.welcome-section h1 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
}

.welcome-description {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: #6b7280;
  margin-bottom: 3rem;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  hyphens: auto;
  padding: 0 0.5rem;
}





.tutorial-sections {
  margin-bottom: 3rem;
  width: 100%;
}

.tutorial-sections h2 {
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.loading-message {
  text-align: center;
  color: #6b7280;
  font-size: 1.125rem;
  padding: 2rem;
}

.no-sections {
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
  padding: 2rem;
  grid-column: 1 / -1;
}

.error-message {
  text-align: center;
  color: #dc2626;
  padding: 2rem;
}

.error-message p {
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
}

.retry-button:hover {
  background: #2563eb;
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0 0.5rem;
}

.section-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

.section-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #10b981;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  flex-shrink: 0;
}

.section-content {
  flex: 1;
  min-width: 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.section-preview {
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 0.875rem;
}

.section-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.code-count {
  background: #eff6ff;
  color: #3b82f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.action-section {
  margin-top: 2rem;
  width: 100%;
}

.start-button {
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.start-button:hover:not(:disabled) {
  background: #2563eb;
}

.start-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .tutorial-home {
    padding: 1rem;
  }

  .welcome-section h1 {
    font-size: 2rem;
  }

  .language-grid {
    grid-template-columns: 1fr;
  }

  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
