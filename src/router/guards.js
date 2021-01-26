import { getToken } from '@/utils'

// 注册全局前置守卫
function registerBeforeGuards(router) {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (!getToken()) {
        next({
          path: '/login'
          // query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    } else {
      next() // 确保一定要调用 next()
    }
  })
}

export default registerBeforeGuards
