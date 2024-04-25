import { boot } from 'quasar/wrappers'
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  try {
    await authStore.refreshToken()
  } catch (e) {}
})
