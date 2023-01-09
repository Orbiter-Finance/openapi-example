import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'OpenApi',
    meta: { navHide: true },
    component: () => import('../views/OpenApi.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
