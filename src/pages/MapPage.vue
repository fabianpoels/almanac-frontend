<template>
  <q-page>
    <div ref="mapContainer" class="map-container"></div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMapStore } from '@/stores/mapStore'

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

import { useRoute } from 'vue-router'
const route = useRoute()

// mapbox + plugins css
import '@/../node_modules/mapbox-gl/dist/mapbox-gl.css'
import '@mapbox-controls/styles/src/index.css'

const mapStore = useMapStore()
const mapContainer = ref(null)

defineOptions({
  name: 'MapPage',
})

onMounted(() => {
  mapStore.initializeMap({ element: mapContainer.value, t, locale })
})
</script>
<style scoped>
.map-container {
  display: flex;
  min-height: inherit;
  padding: 0;
  flex: 1;
}
</style>
<style>
.mapboxgl-ctrl-bottom-left div:last-child {
  display: none !important;
}

.mapboxgl-ctrl-bottom-right div:last-child {
  display: none !important;
}
</style>
<style>
h6.popup-header {
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
}
</style>
