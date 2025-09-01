import { createRouter, createWebHistory } from 'vue-router'
import TutorialLayout from '@/components/TutorialLayout.vue'
import TutorialSection from '@/views/TutorialSection.vue'
import { DEFAULT_LANGUAGE } from '@/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: TutorialLayout,
      children: [
        {
          path: '',
          name: 'home',
          // Redirect to default language introduction
          redirect: () => `/${DEFAULT_LANGUAGE.id}/section/introduction`
        },
        {
          // Backward-compat: legacy URLs without language -> default language
          path: 'section/:sectionId',
          redirect: (to) => `/${DEFAULT_LANGUAGE.id}/section/${to.params.sectionId}`
        },
        {
          // Convenience: '/:language' -> that language's introduction
          path: ':language',
          redirect: (to) => `/${to.params.language}/section/introduction`
        },
        {
          // Primary route with language parameter
          path: ':language/section/:sectionId',
          name: 'section',
          component: TutorialSection,
          props: true
        }
      ]
    }
  ]
})

export default router
