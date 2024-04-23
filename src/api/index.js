import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const instance = axios.create({
  baseURL: import.meta.env.VITE_ALMANAC_API_URL,
})

instance.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.authenticated) {
    config.headers['Authorization'] = `Bearer ${authStore.jwt}`
  }
  return config
})

export default instance
