<template>
  <q-dialog v-model="showDialog" :persistent="saving" maximized>
    <q-card class="q-pa-md">
      <q-form id="newsItemForm">
        <h6>{{ $t('admin.news.editNewsItem') }}</h6>
        <div ref="mapEditContainer" class="map-edit-container"></div>
        <q-select
          v-model="localNewsItem.status"
          :options="statusOptions"
          :label="$t('admin.news.status')"
          :disable="saving"
          class="q-mt-sm"
          @update:model-value="touched = true"
          emit-value
        />
        <div class="row justify-end">
          <q-btn
            flat
            color="primary"
            class="q-mt-lg"
            :label="$t('forms.cancel')"
            :disable="saving"
            @click="showDialog = false"
          />
          <q-btn
            class="q-mt-lg q-ml-sm"
            color="secondary"
            :label="$t('forms.save')"
            :loading="saving"
            :disable="!touched"
            @click="save"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, watch, nextTick } from 'vue'
import { useNewsStore } from '@/stores/newsStore'
const newsStore = useNewsStore()
import { alert } from '@/utils/alert'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// mapbox + plugins css
import '@/../node_modules/mapbox-gl/dist/mapbox-gl.css'
import '@mapbox-controls/styles/src/index.css'

import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore()
const mapEditContainer = ref(null)

const showDialog = defineModel()
const localNewsItem = ref({})
const touched = ref(false)
const saving = ref(false)
const statusOptions = ['pending', 'published', 'archived'].map((option) => ({
  label: t(`admin.news.statuses.${option}`),
  value: option,
}))

defineOptions({
  name: 'EditNewsItem',
})

const props = defineProps({
  newsItem: {
    type: Object,
    required: true,
  },
})

watch(showDialog, async (val) => {
  if (val === true) {
    touched.value = false
    saving.value = false
    localNewsItem.value = { ...props.newsItem }
    await nextTick()
    mapStore.initializeEditMap({ element: mapEditContainer.value, t })
    mapStore.editMap.on('draw.create', updateGeoJson)
    mapStore.editMap.on('draw.delete', updateGeoJson)
    mapStore.editMap.on('draw.update', updateGeoJson)
    mapStore.draw.set(localNewsItem.value.geoData)
  } else if (val === false) {
    mapStore.clearEditMap()
  }
})

function updateGeoJson() {
  touched.value = true
  localNewsItem.value.geoData = { ...mapStore.draw.getAll() }
}

const save = async function () {
  saving.value = true
  try {
    await newsStore.updateNewsItem({ ...localNewsItem.value })
    alert.success(t('forms.saved'))
    showDialog.value = false
  } catch (e) {
    saving.value = false
    console.log(e)
    alert.error(t('forms.errorSaving'))
  }
}
</script>
<style scoped>
.map-edit-container {
  width: 100%;
  min-height: 800px;
  padding: 0;
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
