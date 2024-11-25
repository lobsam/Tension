import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArticleBooksView from '@/views/ArticleBooksView.vue'
import ArtView from '@/views/ArtView.vue'
import SelfPublishArticles from '@/components/SelfPublishArticles.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticleBooksView
    },
    {
      path: '/art',
      name: 'art',
      component: ArtView
    },
    {
      path: '/articles/:id',
      name: 'id',
      props: (route) => ({ query: route.query.id }),
      component: SelfPublishArticles
    }
  ]
})

export default router
