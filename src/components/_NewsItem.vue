<template>
  <q-item>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ description }}</q-item-label>
    </q-item-section>
    <q-item-section side top>
      <q-item-label caption>{{ dt.short(newsItem.timestamp) }}</q-item-label>
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
</template>
<script setup>
import { computed } from 'vue'
import { mapUtils } from '@/utils/map'
import { dt } from '@/utils'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore()

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
</script>
<style scoped>
.icon {
  margin-top: 10px;
}
</style>
