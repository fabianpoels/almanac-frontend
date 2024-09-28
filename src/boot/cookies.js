import { boot } from 'quasar/wrappers'
import { globalCookiesConfig } from 'vue3-cookies'

export default boot(async ({ app, router }) => {
  const isProd = process.env.PROD
  const sameSite = isProd ? 'Strict' : 'None'
  const domain = import.meta.env.VITE_DOMAIN
  globalCookiesConfig({
    expireTimes: -1,
    path: '/',
    domain: domain,
    secure: isProd,
    sameSite: sameSite,
  })
})
