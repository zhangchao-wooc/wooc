import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach((to, from) => {
//   // ...
//   // 返回 false 以取消导航
//   return false
// })

export default router
