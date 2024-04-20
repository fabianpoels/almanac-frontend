<template>
  <q-page>
    <div ref="mapContainer" class="map-container"></div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useReportStore } from '@/stores/reportStore'
import { mapUtils } from '@/utils/map'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// mapbox + plugins
import mapboxgl from 'mapbox-gl'
import StylesControl from '@mapbox-controls/styles'

// mapbox + plugins css
import '@/../node_modules/mapbox-gl/dist/mapbox-gl.css'
import '@mapbox-controls/styles/src/index.css'

const mapStore = useMapStore()
const reportStore = useReportStore()
const mapContainer = ref(null)

mapboxgl.accessToken = mapStore.mapboxApiKey

defineOptions({
  name: 'MapPage',
})

let map

onMounted(() => {
  // CREATE THE MAP
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/light-v11',
    center: [35.4903, 33.8964],
    zoom: 13,
    pitchWithRotate: false,
  })

  map.on('load', async () => {
    mapStore.map = map
    await reportStore.fetchReports()
    await reportStore.fetchCategories()
    reportStore.reports.forEach((report) => mapUtils.drawReport({ map, report }))
  })

  map.on('style.load', () => {
    reportStore.reports.forEach((report) => mapUtils.drawReport({ map, report }))
  })

  map.addControl(
    new StylesControl({
      styles: [
        {
          label: t('map.styles.standard'),
          styleName: 'Mapbox Light',
          styleUrl: 'mapbox://styles/mapbox/light-v11',
        },
        {
          label: t('map.styles.terrain'),
          styleName: 'Mapbox Outdoors',
          styleUrl: 'mapbox://styles/mapbox/outdoors-v12',
        },
        {
          label: t('map.styles.satellite'),
          styleName: 'Mapbox Satellite Streets',
          styleUrl: 'mapbox://styles/mapbox/satellite-streets-v12',
        },
        {
          label: t('map.styles.traffic'),
          styleName: 'Mapbox Navigation Day',
          styleUrl: 'mapbox://styles/mapbox/navigation-day-v1',
        },
      ],
    }),
    'bottom-right'
  )

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
