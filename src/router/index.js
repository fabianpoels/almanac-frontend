import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from '@/stores/authStore'
const locales = ['en', 'ar']

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  router.beforeEach((to, from) => {
    // SET THE LANGUAGE
    if (!to.params.lang || !locales.includes(to.params.lang)) {
      // TODO: get locale from cookie
      return {
        name: to.name || 'root',
        params: { lang: 'en' },
        replace: true,
      }
    }

    // REDIRECT TO AUTH IF REQUIRED
    // const publicPages = ['root', 'login', 'about']
    const publicPages = ['login']
    const authRequired = !publicPages.includes(to.name)
    const authStore = useAuthStore()

    if (authRequired && !authStore.user) {
      return {
        name: 'login',
        params: { lang: to.params.lang },
      }
    }
  })

  return router
})
