import { boot } from 'quasar/wrappers'
import VueGtag from 'vue-gtag'

export default boot(async ({ app, router }) => {
  app.use(
    VueGtag,
    {
      enabled: process.env.PROD,
      config: {
        id: import.meta.env.VITE_GTAG_ID,
      },
    },
    router
  )
})
