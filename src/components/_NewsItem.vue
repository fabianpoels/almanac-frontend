<template>
  <q-item>
    <div v-if="applicationStore.isNew(newsItem)" class="red-dot" />
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ description }}</q-item-label>
    </q-item-section>
    <q-item-section side top>
      <q-item-label caption>{{ dt.short(newsItem.timestamp) }}</q-item-label>
      <q-item-label caption>{{ dt.time(newsItem.timestamp) }}</q-item-label>
      <q-btn
        v-if="hasLocationData"
        @click="clicked()"
        round
        class="icon"
        size="xs"
        icon="my_location"
      />
      <q-badge class="q-mt-md" :style="{ backgroundColor: color }">{{
        $t(`category.${newsItem.category}`)
      }}</q-badge>
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
import { useApplicationStore } from '@/stores/applicationStore'
const applicationStore = useApplicationStore()

const props = defineProps({
  newsItem: {
    type: Object,
    required: true,
  },
})

function clicked() {
  mapUtils.moveMapToNewsItem({ newsItem: props.newsItem, map: mapStore.map })
  applicationStore.markAsSeen(props.newsItem)
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

const hasLocationData = computed(() => {
  const d = props.newsItem
  if (!d.geoData) return false
  if (!d.geoData.features) return false
  if (!d.geoData.type) return false
  if (d.geoData.features.length < 1) return false
  return true
})
</script>
<style lang="scss" scoped>
.icon {
  margin-top: 10px;
}
.red-dot {
  position: absolute;
  top: 10px;
  left: 1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: $red;
}
</style>
