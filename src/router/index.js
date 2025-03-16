import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import Partners from '../views/Partners.vue'
import EventsPage from '../views/EventsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/dashboard',
      component: DashboardPage,
      children: [
        {
          path: '',
          redirect: '/dashboard/partners'
        },
        {
          path: 'partners',
          component: Partners
        },
        {
          path: 'events',
          component: EventsPage
        }
        // {
        //   path: 'training',
        //   component: () => import('../views/Training.vue')
        // }
      ]
    }
  ]
})

// Add navigation guard to check for auth
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('token')
//   if (to.path !== '/login' && !isAuthenticated) {
//     next('/login')
//   } else {
//     next()
//   }
// })

export default router
