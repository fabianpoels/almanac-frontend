import { boot } from 'quasar/wrappers'
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

export default boot(async (/* { app, router, ... } */) => {
  try {
    await authStore.refreshToken()
  } catch (e) {
    console.log(e)
  }
})
