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
      <template v-for="riskLevel in riskLevels" :key="riskLevel.id">
        <MapboxSource :id="riskLevel.id" :options="{ type: 'geojson', data: riskLevel.geoData }" />
        <MapboxLayer
          v-if="!selectedMunicipality?.id"
          :id="riskLevel.key"
          :options="{
            type: 'fill',
            source: riskLevel.id,
            paint: {
              'fill-color': riskLevel.color,
              'fill-opacity': 0.2,
            },
          }"
        />
      </template>
      <template v-if="selectedMunicipality?.id">
        <MapboxSource
          :id="`m-${selectedMunicipality.id}`"
          :options="{ type: 'geojson', data: selectedMunicipality.geoData }"
        />
        <MapboxLayer
          :id="selectedMunicipality.id"
          :options="{
            type: 'fill',
            source: `m-${selectedMunicipality.id}`,
            paint: {
              'fill-color': riskLevelsStore.riskLevelColor(selectedMunicipality.riskLevel),
              'fill-opacity': 0.2,
            },
          }"
        />
      </template>
    </MapboxMap>
    <q-page-sticky position="top-left" :offset="[18, 18]">
      <municipalities-card v-model="selectedMunicipality" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { alert } from '@/utils/alert'
import { Loading } from 'quasar'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
import { useRiskLevelsStore } from '@/stores/riskLevelsStore'
const riskLevelsStore = useRiskLevelsStore()
import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore()

import {
  MapboxMap,
  MapboxNavigationControl,
  MapboxSource,
  MapboxLayer,
} from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox-controls/styles/src/index.css'

import MunicipalitiesCard from '@/components/admin/MunicipalitiesCard.vue'

const selectedMunicipality = ref(null)

const riskLevels = computed(() => {
  const rls = riskLevelsStore.publicRiskLevels
  return Object.keys(rls).map((key) => ({
    key,
    id: `rl-${key}`,
    geoData: rls[key],
    color: riskLevelsStore.publicRiskColors[key],
  }))
})

async function mapLoaded(map) {
  Loading.show()
  try {
    await riskLevelsStore.fetchMunicipalities()
    await riskLevelsStore.fetchRiskLevels()
    mapStore.initializeRiskLevelsMap({ map, t, locale })
  } catch (e) {
    console.error(e)
    alert.error(t('map.errorLoading'))
  } finally {
    Loading.hide()
  }
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
</style>
