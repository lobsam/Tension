import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArticleBooksView from '@/views/ArticleBooksView.vue'
import ArtView from '@/views/ArtView.vue'
import ArtDetailView from '@/views/ArtDetailView.vue'
import ExhibitionView from '@/views/ExhibitionView.vue'
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
      path: '/art/:id',
      name: 'art-detail',
      props: (route) => ({ id: route.params.id }),
      component: ArtDetailView
    },
    {
      path: '/exhibition',
      name: 'exhibition',
      component: ExhibitionView
    },
    {
      path: '/articles/:id',
      name: 'article-detail',
      props: (route) => ({ id: route.params.id }),
      component: SelfPublishArticles
    }
  ]
})

export default router
