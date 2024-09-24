<template>
  <q-item>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ description }}</q-item-label>
    </q-item-section>
    <q-item-section side top>
      <q-item-label caption>{{ dt.short(newsItem.timestamp) }}</q-item-label>
      <q-item-label caption>{{ dt.time(newsItem.timestamp) }}</q-item-label>
      <q-btn
        v-if="hasLocationData"
        @click="moveToLocation(newsItem)"
        round
        class="icon"
        size="xs"
        icon="my_location"
      />
      <q-badge class="q-mt-md" :style="{ backgroundColor: color }">{{ categoryTitle }}</q-badge>
    </q-item-section>
  </q-item>
</template>
<script setup>
import { computed } from 'vue'
import { mapUtils } from '@/utils/map'
import { dt } from '@/utils'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore()
import { useNewsStore } from '@/stores/newsStore'
const newsStore = useNewsStore()

const props = defineProps({
  newsItem: {
    type: Object,
    required: true,
  },
})

function moveToLocation(newsItem) {
  mapUtils.moveMapToNewsItem({ newsItem, map: mapStore.map })
}

const title = computed(() => {
  return props.newsItem.title[locale.value]
})

const description = computed(() => {
  return props.newsItem.description[locale.value]
})

const category = computed(() => {
  return newsStore.categories[props.newsItem.category]
})

const color = computed(() => {
  return category.value?.color || ''
})

const categoryTitle = computed(() => {
  return category.value?.title || ''
})

const hasLocationData = computed(() => {
  const d = props.newsItem.geoData
  if (!d.geoData) return false
  if (!d.geoData.features) return false
  if (!d.geoData.type) return false
  if (d.geoData.features.length < 1) return false
  return true
})
</script>
<style scoped>
.icon {
  margin-top: 10px;
}
</style>
