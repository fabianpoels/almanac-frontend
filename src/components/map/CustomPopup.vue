<template>
  <h6 class="popup-header">{{ newsItem.title[locale] }}</h6>
  <div class="flex inline">
    <q-badge :style="{ backgroundColor: color }">
      {{ $t(`category.${newsItem.category}`) }}
    </q-badge>
    <div class="q-ml-sm">
      {{ dt.short(newsItem.timestamp) }} - {{ dt.time(newsItem.timestamp) }}
    </div>
  </div>
  <p class="q-mt-sm">{{ newsItem.description[locale] }}</p>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

import { dt } from '@/utils'

const props = defineProps({
  newsItem: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
})
</script>
<style scoped>
h6.popup-header {
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
  line-height: 1.35rem;
}
</style>
<style>
.mapboxgl-popup-content {
  border-radius: 5px;
}
</style>
