<template>
  <q-page>
    <div ref="mapContainer" class="map-container"></div>
    <map-style-switcher
      v-model="showStyleSwitcher"
      :selectedStyle="selectedStyle"
      @switchStyle="(val) => switchStyle(val)"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMapStore } from '@/stores/map-store'

// mapbox + plugins
import mapboxgl from 'mapbox-gl'
// import StylesControl from '@mapbox-controls/styles'

// mapbox + plugins css
import '@/../node_modules/mapbox-gl/dist/mapbox-gl.css'
// import '@mapbox-controls/styles/src/index.css'

import MapStyleSwitcher from './../components/MapStyleSwitcher.vue'

const mapStore = useMapStore()
const mapContainer = ref(null)

const showStyleSwitcher = ref(false)
const selectedStyle = ref('mapbox://styles/mapbox/standard')

mapboxgl.accessToken = mapStore.mapboxApiKey

defineOptions({
  name: 'MapPage',
})

let map

onMounted(() => {
  // CREATE THE MAP
  map = new mapboxgl.Map({
    container: mapContainer.value,

    center: [35.4903, 33.8964],
    zoom: 13,
    pitchWithRotate: false,
  })

  map.on('style.load', () => {})

  // CONTROL STYLES
  // const mapStyles = new StylesControl({
  //   compact: true,
  //   styles: [
  //     {
  //       label: t('map.styles.standard'),
  //       styleName: 'Mapbox Standard',
  //       styleUrl: 'mapbox://styles/mapbox/standard',
  //     },
  //     {
  //       label: t('map.styles.satellite'),
  //       styleName: 'Mapbox Satellite Streets',
  //       styleUrl: 'mapbox://sprites/mapbox/satellite-streets-v12',
  //     },
  //     {
  //       label: t('map.styles.traffic'),
  //       styleName: 'Mapbox Navigation',
  //       styleUrl: 'mapbox://styles/mapbox/navigation-day-v1',
  //     },
  //   ],
  // })
  // map.addControl(mapStyles, 'bottom-right')

  // CUSTOM STYLE SWITCHER
  class LayerButton {
    onAdd(map) {
      const div = document.createElement('div')
      div.className = 'mapboxgl-ctrl mapboxgl-ctrl-group'
      div.innerHTML = `<button><svg viewBox="0 0 48 48" style="font-size: 20px;" fill="currentColor"><path d="m24 41.5-18-14 2.5-1.85L24 37.7l15.5-12.05L42 27.5Zm0-7.6-18-14 18-14 18 14Zm0-15.05Zm0 11.25 13.1-10.2L24 9.7 10.9 19.9Z"/></svg></button>`
      div.addEventListener('contextmenu', (e) => e.preventDefault())
      div.addEventListener('click', () => (showStyleSwitcher.value = true))

      return div
    }
  }
  const layerButton = new LayerButton()
  map.addControl(layerButton, 'bottom-right')

  // ADD ZOOM BUTTONS
  const nav = new mapboxgl.NavigationControl({
    showCompass: true,
  })
  map.addControl(nav, 'bottom-right')

  // ADD SCALE
  const scale = new mapboxgl.ScaleControl({
    maxWidth: 100,
    unit: 'metric',
  })
  map.addControl(scale)
})

function switchStyle(style) {
  selectedStyle.value = style
  map.setStyle(style)
}
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
