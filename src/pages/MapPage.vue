<template>
  <q-page>
    <div ref="mapContainer" class="map-container"></div>
  </q-page>
</template>

<script setup>
import "@/../node_modules/mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from 'mapbox-gl'
import { useMapStore } from '@/stores/map-store'
import { ref, onMounted } from 'vue'

const mapStore = useMapStore()
const mapContainer = ref(null)

mapboxgl.accessToken = mapStore.mapboxApiKey

defineOptions({
  name: 'MapPage'
})

onMounted(() => {
  // CREATE THE MAP
  const map = new mapboxgl.Map({
    container: mapContainer.value,
    style: "mapbox://styles/mapbox/outdoors-v12", // Replace with your preferred map style
    center: [35.4903, 33.8964],
    zoom: 13,
  })

  // ADD ZOOM BUTTONS
  const nav = new mapboxgl.NavigationControl({
    showCompass: false
  })
  map.addControl(nav, 'bottom-right')

  // ADD SCALE
  const scale = new mapboxgl.ScaleControl({
    maxWidth: 100,
    unit: 'metric'
  })
  map.addControl(scale)

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
