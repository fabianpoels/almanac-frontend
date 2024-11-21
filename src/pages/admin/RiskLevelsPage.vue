<template>
  <div></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import { useRiskLevelsStore } from '@/stores/riskLevelsStore'

const riskLevelsStore = useRiskLevelsStore()

const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    await riskLevelsStore.fetchMunicipalities()
  } catch (e) {
    console.error(e)
    alert.error(e)
  }
  loading.value = false
})
</script>
