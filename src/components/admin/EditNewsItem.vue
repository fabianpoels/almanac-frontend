<template>
  <q-dialog v-model="showDialog" :persistent="saving" maximized>
    <q-card class="q-pa-md">
      <q-form id="newsItemForm">
        <h6>{{ $t('admin.news.editNewsItem') }}</h6>
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="info" :label="$t('admin.news.info')" />
          <q-tab name="map" :label="$t('admin.news.map')" />
          <q-tab name="raw" :label="$t('admin.news.rawData')" />
        </q-tabs>
        <q-tab-panels v-model="tab">
          <q-tab-panel name="info">
            <div class="row q-my-md">
              <div class="col-6 q-pr-sm">
                <q-input
                  v-model="localNewsItem.title.en"
                  :label="`${$t('admin.news.title')} - ${$t('language.english')}`"
                  :disable="saving"
                  @update:model-value="touched = true"
                />
              </div>
              <div class="col-6 q-pl-sm">
                <q-input
                  v-model="localNewsItem.title.ar"
                  :label="`${$t('admin.news.title')} - ${$t('language.arabic')}`"
                  :disable="saving"
                  @update:model-value="touched = true"
                />
              </div>
            </div>
            <div class="row q-my-md">
              <div class="col-6 q-pr-sm">
                <q-input
                  type="textarea"
                  v-model="localNewsItem.description.en"
                  min-height="5rem"
                  class="q-my-sm"
                  :label="`${$t('admin.news.description')} - ${$t('language.english')}`"
                  :disable="saving"
                  @update:model-value="touched = true"
                />
              </div>
              <div class="col-6 q-pl-sm">
                <q-input
                  type="textarea"
                  v-model="localNewsItem.description.ar"
                  min-height="5rem"
                  class="q-my-sm"
                  :label="`${$t('admin.news.description')} - ${$t('language.arabic')}`"
                  :disable="saving"
                  @update:model-value="touched = true"
                />
              </div>
            </div>
            <q-select
              v-model="localNewsItem.status"
              :options="statusOptions"
              :label="$t('admin.news.status')"
              :disable="saving"
              class="q-mt-md"
              @update:model-value="touched = true"
              emit-value
            />
            <q-select
              v-model="localNewsItem.category"
              :options="categoryOptions"
              :label="$t('admin.news.category')"
              :disable="saving"
              class="q-mt-md"
              emit-value
            />
            <div class="row q-my-md">
              <q-date v-model="date" @update:model-value="touched = true" />
              <q-time
                v-model="time"
                format24h
                class="q-ml-md"
                @update:model-value="touched = true"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="map">
            <div ref="mapEditContainer" class="map-edit-container"></div>
          </q-tab-panel>
          <q-tab-panel name="raw">
            {{ localNewsItem }}
          </q-tab-panel>
        </q-tab-panels>
        <div class="flex flex-row">
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
import { ref, watch, nextTick, computed } from 'vue'
import { useNewsStore } from '@/stores/newsStore'
const newsStore = useNewsStore()
import { alert } from '@/utils/alert'
import { dt } from '@/utils'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

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
const categoryOptions = [
  'red_zone',
  'traffic_incident',
  'protest',
  'military',
  'weather',
  'misc',
].map((option) => ({
  label: t(`category.${option}`),
  value: option,
}))

defineOptions({
  name: 'EditNewsItem',
})

const tab = ref('info')

const props = defineProps({
  newsItem: {
    type: Object,
    required: true,
  },
})

const date = computed({
  get() {
    return dt.toQuasarDateString(localNewsItem.value.timestamp)
  },
  set(val) {
    let newDate = dt.parseQuasarDateString(val)
    let ts = localNewsItem.value.timestamp
    localNewsItem.value.timestamp = ts.set({
      year: newDate.year,
      month: newDate.month,
      day: newDate.day,
    })
  },
})

const time = computed({
  get() {
    return dt.toQuasarTimeString(localNewsItem.value.timestamp)
  },
  set(val) {
    let newDate = dt.parseQuasarTimeString(val)
    let ts = localNewsItem.value.timestamp
    localNewsItem.value.timestamp = ts.set({
      hour: newDate.hour,
      minute: newDate.minute,
    })
  },
})

watch(showDialog, (val) => {
  if (val === true) {
    touched.value = false
    saving.value = false
    tab.value = 'info'
    localNewsItem.value = { ...props.newsItem }
  } else if (val === false) {
    mapStore.clearEditMap()
  }
})

watch(tab, async (val) => {
  if (val === 'map') {
    await nextTick()
    mapStore.initializeEditMap({ element: mapEditContainer.value, t })
    mapStore.editMap.on('draw.create', updateGeoJson)
    mapStore.editMap.on('draw.delete', updateGeoJson)
    mapStore.editMap.on('draw.update', updateGeoJson)
    mapStore.draw.set(localNewsItem.value.geoData)
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
