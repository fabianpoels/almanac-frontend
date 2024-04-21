<template>
  <q-drawer
    side="right"
    :model-value="mapStore.rightDrawerOpen === 'addReport'"
    bordered
    class="q-pa-md"
    :width="322"
    @show="show()"
    @hide="hide()"
  >
    <q-form style="height: 100%">
      <div class="flex row content-between stretch-items" style="height: 100%">
        <div>
          <h5>{{ $t('admin.menu.addReport') }}</h5>
          <q-separator />
          <q-input
            v-model="blankReport.title"
            :label="$t('admin.addReport.title')"
            :disable="saving"
          />
          <q-select
            v-model="blankReport.category"
            :label="$t('admin.addReport.category')"
            :options="reportStore.categoryOptions"
            class="q-my-sm"
            :disable="saving"
            emit-value
            map-options
          >
          </q-select>
          <q-editor
            v-model="blankReport.description"
            min-height="5rem"
            class="q-my-sm"
            :placeholder="$t('admin.addReport.description')"
            :disable="saving"
          />
          <q-date v-model="dateRange" range class="q-my-sm" :disable="saving" />
        </div>
        <div class="q-mt-sm row stretch-items" style="width: 100%">
          <q-btn color="primary" class="col" :disable="saving || !isValid" @click="saveReport">
            {{ $t('admin.addReport.publish') }}
            <q-spinner size="xs" v-if="saving" class="q-ml-xs" />
          </q-btn>
          <q-btn color="grey-4" class="col q-ml-sm" :disable="saving" @click="cancel">
            {{ $t('shared.cancel') }}
          </q-btn>
        </div>
      </div>
    </q-form>
  </q-drawer>
</template>
<script setup>
import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { dt } from '@/utils'
import { alert } from '@/utils/alert'
import { ref, computed } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useReportStore } from '@/stores/reportStore'
const mapStore = useMapStore()
const reportStore = useReportStore()

const blankReport = ref({ ...reportStore.blankReport })

const saving = ref(false)

const isValid = computed(() => {
  if (!blankReport.value.title) return false
  if (!blankReport.value.category) return false

  return true
})

async function saveReport() {
  saving.value = true
  try {
    await reportStore.addReport(blankReport.value)
    alert.success(t('admin.addReport.reportAdded'))
    saving.value = false
    mapStore.rightDrawerOpen = null
  } catch (e) {
    saving.value = false
    alert.error(t('admin.addReport.error'))
  }
}

function show() {
  mapStore.activateDrawingMode()
  mapStore.map.on('draw.create', updateGeoJson)
  mapStore.map.on('draw.delete', updateGeoJson)
  mapStore.map.on('draw.update', updateGeoJson)
}

function hide() {
  mapStore.deactiveDrawingMode()
  mapStore.map.off('draw.create', updateGeoJson)
  mapStore.map.off('draw.delete', updateGeoJson)
  mapStore.map.off('draw.update', updateGeoJson)
  blankReport.value = { ...reportStore.blankReport }
}

function cancel() {
  mapStore.rightDrawerOpen = null
}

function updateGeoJson() {
  blankReport.value.geoData = { ...mapStore.draw.getAll() }
}

const touched = computed({})

const dateRange = computed({
  get() {
    if (DateTime.isDateTime(blankReport.value.activeUntil)) {
      return {
        from: dt.toQuasarDateString(blankReport.value.activeFrom),
        to: dt.toQuasarDateString(blankReport.value.activeUntil),
      }
    }
    return dt.toQuasarDateString(blankReport.value.activeFrom)
  },
  set(val) {
    if (val instanceof String) {
      blankReport.value.activeFrom = dt.parseQuasarDateString(val)
      blankReport.value.activeUntil = ''
    }

    if (val instanceof Object) {
      blankReport.value.activeFrom = dt.parseQuasarDateString(val.from)
      blankReport.value.activeUntil = dt.parseQuasarDateString(val.to)
    }
  },
})
</script>
