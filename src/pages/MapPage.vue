<template>
  <q-page>
    <!-- <div ref="mapContainer" class="map-container"></div> -->
    <MapboxMap
      class="map-container"
      :access-token="mapStore.mapboxApiKey"
      map-style="mapbox://styles/mapbox/light-v11"
      :center="defaultCenter"
      :zoom="8"
      @mb-created="mapLoaded"
      :attributionControl="false"
    >
      <MapboxNavigationControl position="bottom-right" visualizePitch />
      <template v-for="marker in markers" :key="marker.newsItem.id">
        <MapboxMarker :lng-lat="marker.coordinates">
          <CustomPin
            :icon="marker.icon"
            :color="marker.color"
            :isNew="applicationStore.isNew(marker.newsItem)"
            @click="applicationStore.markAsSeen(marker.newsItem)"
          />
          <template #popup>
            <CustomPopup :newsItem="marker.newsItem" :color="marker.color" />
          </template>
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
import { alert } from '@/utils/alert'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// MAP STUFF
// mapbox + plugins css
import { MapboxMap, MapboxMarker, MapboxNavigationControl } from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox-controls/styles/src/index.css'

import CustomPin from '@/components/map/CustomPin.vue'
import CustomPopup from '@/components/map/CustomPopup.vue'

const mapStore = useMapStore()
const newsStore = useNewsStore()
const applicationStore = useApplicationStore()

defineOptions({
  name: 'MapPage',
})

const defaultCenter = [35.4903, 33.8964]

async function mapLoaded(map) {
  Loading.show()
  try {
    await newsStore.fetchNewsItems()
    await newsStore.fetchCategories()
    await applicationStore.loadHasSeen()
    mapStore.initializeMap({ map, t })
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
    if (!newsItem.geoData.features[0].geometry.type === 'Point') return
    const color = newsStore.categories[newsItem.category]?.color
    const icon = newsStore.categories[newsItem.category]?.icon
    if (!color) return
    if (!icon) return
    result.push({
      coordinates: newsItem.geoData.features[0].geometry.coordinates,
      color,
      icon,
      newsItem,
    })
  })
  return result
})
</script>
<style>
.map-container {
  display: flex;
  min-height: inherit;
  padding: 0;
  flex: 1;
}
/* .mapboxgl-ctrl-bottom-left div:last-child {
  display: none !important;
}

.mapboxgl-ctrl-bottom-right div:last-child {
  display: none !important;
} */
</style>
