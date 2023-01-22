import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BrowseView from '../views/BrowseView.vue'
import BookmarkView from '../views/BookmarkView.vue'
import HistoryView from '../views/HistoryView.vue'
import KomikView from '../views/KomikView.vue'
import GenresView from '../views/GenresView.vue'
import TypesView from '../views/TypesView.vue'

// const komik = {
//   displayName: 'Komik',
  
// }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: {
        title: 'Home - The Ultimate Destination for Manga Fans'
      }
    },
    {
      path: '/browse',
      name: 'Browse',
      component: BrowseView,
      meta: {
        title: 'MangaApp - The Ultimate Destination for Manga Fans'
      }
    },
    {
      path: '/bookmarks',
      name: 'My Bookmarks',
      component: BookmarkView,
      meta: {
        title: 'My Bookmarks - The Ultimate Destination for Manga Fans'
      }
    },
    {
      path: '/history',
      name: 'My Histories',
      component: HistoryView,
      meta: {
        title: 'My Histories - The Ultimate Destination for Manga Fans'
      }
    },
    {
      path: '/komik/:slug',
      name: 'Komik',
      component: KomikView,
      meta: {
        title: 'Komik - The Ultimate Destination for Manga Fans',
      }
    },
    {
      path: '/genres/:genre',
      name: 'Genres',
      component: GenresView,
      meta: {
        title: 'Genres - The Ultimate Destination for Manga Fans',
      }
    },
    {
      path: '/type/:type',
      name: 'Type',
      component: TypesView,
      meta: {
        title: 'Type - The Ultimate Destination for Manga Fans',
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
