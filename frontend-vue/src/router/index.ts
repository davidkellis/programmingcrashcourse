import { createRouter, createWebHistory } from 'vue-router'
import TutorialLayout from '@/components/TutorialLayout.vue'
import TutorialHome from '@/views/TutorialHome.vue'
import TutorialSection from '@/views/TutorialSection.vue'

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
          redirect: '/section/introduction'
        },
        {
          path: 'section/:sectionId',
          name: 'section',
          component: TutorialSection,
          props: true
        }
      ]
    }
  ]
})

export default router
