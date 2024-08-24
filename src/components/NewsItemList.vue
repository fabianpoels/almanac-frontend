<template>
  <q-list separator>
    <news-item v-for="newsItem in newsStore.newsItems" :key="newsItem.id" :newsItem="newsItem" />
  </q-list>
</template>
<script setup>
import { useNewsStore } from '@/stores/newsStore'
const newsStore = useNewsStore()

import NewsItem from './_NewsItem.vue'
</script>
