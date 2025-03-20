<template>
  <q-page>
    <MapboxMap
      class="map-container"
      :access-token="mapStore.mapboxApiKey"
      map-style="mapbox://styles/mapbox/light-v11"
      :center="mapStore.defaultCenter"
      :zoom="8"
      @mb-created="mapLoaded"
      :attributionControl="false"
    >
      <MapboxNavigationControl position="bottom-right" visualizePitch />
      <template v-for="(poi, index) in pois" :key="`poi-${index}`">
        <MapboxMarker :lng-lat="poi.coordinates">
          <template #popup>
            <div>{{ poi.name }}</div>
          </template>
          <CustomPoi :icon="poi.icon" />
        </MapboxMarker>
      </template>
      <MapboxPopup
        :lng-lat="focusedMarker.coordinates"
        v-if="showFocusedNewsItemPopup"
        @mb-close="applicationStore.showFocusedNewsItemPopup = false"
      >
        <CustomPopup :newsItem="focusedMarker.newsItem" :color="focusedMarker.color" />
      </MapboxPopup>
      <template v-for="marker in markers" :key="marker.newsItem.id">
        <MapboxMarker :lng-lat="marker.coordinates">
          <template #popup>
            <CustomPopup :newsItem="marker.newsItem" :color="marker.color" />
          </template>
          <CustomPin
            :icon="marker.icon"
            :color="marker.color"
            :isNew="applicationStore.isNew(marker.newsItem)"
            @click="pinClicked(marker.newsItem)"
            :isDimmed="marker.dimmed"
          />
        </MapboxMarker>
      </template>
    </MapboxMap>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { Loading } from 'quasar'
import { useMapStore } from '@/stores/mapStore'
import { useNewsStore } from '@/stores/newsStore'
import { useApplicationStore } from '@/stores/applicationStore'
import { usePoisStore } from '@/stores/poisStore'
import { useRiskLevelsStore } from '@/stores/riskLevelsStore'
import { useReportsStore } from '@/stores/reportsStore'
import { alert } from '@/utils/alert'
import { dt } from '@/utils'

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// MAP STUFF
import {
  MapboxMap,
  MapboxMarker,
  MapboxNavigationControl,
  MapboxPopup,
} from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox-controls/styles/src/index.css'

import CustomPin from '@/components/map/CustomPin.vue'
import CustomPopup from '@/components/map/CustomPopup.vue'
import CustomPoi from '@/components/map/CustomPoi.vue'

const mapStore = useMapStore()
const newsStore = useNewsStore()
const applicationStore = useApplicationStore()
const poisStore = usePoisStore()
const riskLevelsStore = useRiskLevelsStore()
const reportsStore = useReportsStore()

defineOptions({
  name: 'MapPage',
})

async function mapLoaded(map) {
  Loading.show()
  try {
    await newsStore.fetchNewsItems()
    await newsStore.fetchCategories()
    await poisStore.fetchPois()
    await riskLevelsStore.fetchRiskLevels()
    await reportsStore.fetchReport(dt.todayAsSimpleDateString())
    await applicationStore.loadHasSeen()
    mapStore.initializeMap({ map, t, locale })
  } catch (e) {
    console.error(e)
    alert.error(t('map.errorLoading'))
  } finally {
    Loading.hide()
  }
}

const markers = computed(() => {
  const result = []
  newsStore.activeNewsItems.forEach((newsItem) => {
    if (!newsItem.geoData?.features) return
    if (!newsItem.geoData?.features[0]) return

    const color = newsStore.categories[newsItem.category]?.color
    const icon = newsStore.categories[newsItem.category]?.icon
    const dimmed =
      applicationStore.focusedNewsItem && applicationStore.focusedNewsItem.id !== newsItem.id
    if (!color) return
    if (!icon) return

    newsItem.geoData.features.forEach((feature) => {
      if (feature.geometry.type !== 'Point') return
      result.push({
        coordinates: feature.geometry.coordinates,
        color,
        icon,
        dimmed,
        newsItem,
      })
    })
  })
  return result
})

const pois = computed(() => {
  const result = []
  poisStore.pois.forEach((poi) => {
    if (!poi.geoData?.features) return
    if (!poi.geoData?.features[0]) return
    if (!poi.geoData.features[0].geometry.type === 'Point') return
    if (!poi.icon) return
    result.push({
      coordinates: poi.geoData.features[0].geometry.coordinates,
      name: poi.name,
      icon: poi.icon,
    })
  })
  return result
})

const showFocusedNewsItemPopup = computed(() => {
  return applicationStore.focusedNewsItem && applicationStore.showFocusedNewsItemPopup
})

const focusedMarker = computed(() => {
  const newsItem = applicationStore.focusedNewsItem
  if (!newsItem) return null
  if (!newsItem.geoData?.features) return
  if (!newsItem.geoData?.features[0]) return
  if (!newsItem.geoData.features[0].geometry.type === 'Point') return
  const color = newsStore.categories[newsItem.category]?.color

  return {
    coordinates: newsItem.geoData.features[0].geometry.coordinates,
    color,
    newsItem,
  }
})

function pinClicked(newsItem) {
  applicationStore.markAsSeen(newsItem)
  applicationStore.focusedNewsItem = null
  applicationStore.showFocusedNewsItemPopup = false
}
</script>
<style>
.map-container {
  display: flex;
  min-height: inherit;
  padding: 0;
  flex: 1;
}
.mapboxgl-ctrl-bottom-left div:last-child {
  display: none !important;
}

/* .mapboxgl-ctrl-bottom-right div:last-child {
  display: none !important;
} */
</style>
