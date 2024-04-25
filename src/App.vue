<template>
  <router-view />
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
import { onMounted } from 'vue'

defineOptions({
  name: 'App',
})

onMounted(async () => {
  try {
    await authStore.refreshToken()
  } catch (e) {}
})
</script>
