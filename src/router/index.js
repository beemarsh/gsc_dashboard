import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/views/LandingPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import AboutPage from '@/views/AboutPage.vue';
import RegisterPage from '@/views/RegisterPage.vue'; // Import RegisterPage
import DashboardView from '../views/DashboardView.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/login', component: LoginPage },
  { path: '/about', component: AboutPage },
  { path: '/register', component: RegisterPage }, // Add RegisterPage route
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Add navigation guard to check authentication
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!localStorage.getItem('token')) {
//       next('/login')
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// });

export default router;
