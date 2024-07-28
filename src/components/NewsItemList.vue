<template>
  <q-list separator>
    <q-item v-for="newsItem in newsStore.newsItems" :key="newsItem.id">
      <q-item-section>
        <q-item-label>{{ newsItem.title }}</q-item-label>
        <q-item-label caption>{{ newsItem.description }}</q-item-label>
      </q-item-section>
      <q-item-section side top>
        <q-item-label caption>{{ dt.short(newsItem.activeFrom) }}</q-item-label>
        <q-btn
          v-if="newsItem.geoData"
          @click="moveToLocation(newsItem)"
          round
          class="icon"
          size="xs"
          icon="my_location"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup>
import { dt } from '@/utils'
import { mapUtils } from '@/utils/map'
import { useMapStore } from '@/stores/mapStore'
import { useNewsStore } from '@/stores/newsStore'
const mapStore = useMapStore()
const newsStore = useNewsStore()
function moveToLocation(newsItem) {
  mapUtils.moveMapToNewsItem({ newsItem, map: mapStore.map })
}
</script>
<style scoped>
.icon {
  margin-top: 10px;
}
</style>
