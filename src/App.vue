<template>
  <router-view />
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
import { onBeforeMount } from 'vue'

defineOptions({
  name: 'App',
})

// onBeforeMount(async () => {
//   try {
//     if (authStore.authenticated) router.push({ name: 'map' })
//   } catch (e) {}
// })
</script>
