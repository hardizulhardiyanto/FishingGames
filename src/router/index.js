// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: "Home",
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/dashboard',
    name: "Dashboard",
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/play',
    name: "Play",
    component: () => import('@/views/Playing.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
