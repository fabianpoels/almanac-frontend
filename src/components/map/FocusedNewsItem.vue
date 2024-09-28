<template>
  <q-btn-group color="secondary" rounded class="q-ml-md grouped-button">
    <q-btn color="secondary" rounded padding="xs md" class="title" @click="togglePopup()">
      <div class="ellipsis">
        {{ title }}
      </div>
    </q-btn>
    <q-btn
      v-if="hasLocationData"
      color="secondary"
      rounded
      size="sm"
      icon="my_location"
      padding="xs md"
      @click="moveToLocation()"
    />
    <q-btn color="secondary" rounded size="sm" icon="close" padding="xs md" @click="clear()" />
  </q-btn-group>
</template>
<script setup>
import { computed } from 'vue'
import { useApplicationStore } from '@/stores/applicationStore'
const applicationStore = useApplicationStore()
import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore()
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
import { map } from '@/utils'

const props = defineProps({
  newsItem: {
    type: Object,
    required: true,
  },
})

const title = computed(() => {
  return props.newsItem.title[locale.value]
})

function clear() {
  applicationStore.focusedNewsItem = null
  applicationStore.showFocusedNewsItemPopup = false
}

function moveToLocation() {
  map.moveMapToNewsItem({ newsItem: props.newsItem, map: mapStore.map })
}

const hasLocationData = computed(() => {
  const d = props.newsItem
  if (!d.geoData) return false
  if (!d.geoData.features) return false
  if (!d.geoData.type) return false
  if (d.geoData.features.length < 1) return false
  return true
})

function togglePopup() {
  applicationStore.showFocusedNewsItemPopup = !applicationStore.showFocusedNewsItemPopup
}
</script>
<style scoped>
.title {
  max-width: 300px;
  max-height: 32px;
}

@media only screen and (max-width: 650px) {
  .title {
    max-width: 150px;
  }
}
</style>
