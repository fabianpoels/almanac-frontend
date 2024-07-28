<template>
  <q-drawer
    side="right"
    :model-value="mapStore.rightDrawerOpen === 'addNewsItem'"
    bordered
    class="q-pa-md"
    :width="322"
    @show="show()"
    @hide="hide()"
  >
    <q-form style="height: 100%">
      <div class="flex row content-between stretch-items" style="height: 100%">
        <div>
          <h5>{{ $t('admin.menu.addNewsItem') }}</h5>
          <q-separator />
          <q-input
            v-model="blankNewsItem.title"
            :label="$t('admin.addNewsItem.title')"
            :disable="saving"
          />
          <q-select
            v-model="blankNewsItem.category"
            :label="$t('admin.addNewsItem.category')"
            :options="newsStore.categoryOptions"
            class="q-my-sm"
            :disable="saving"
            emit-value
            map-options
          >
          </q-select>
          <q-editor
            v-model="blankNewsItem.description"
            min-height="5rem"
            class="q-my-sm"
            :placeholder="$t('admin.addNewsItem.description')"
            :disable="saving"
          />
          <q-date v-model="dateRange" range class="q-my-sm" :disable="saving" />
        </div>
        <div class="q-mt-sm row stretch-items" style="width: 100%">
          <q-btn color="primary" class="col" :disable="saving || !isValid" @click="saveNewsItem">
            {{ $t('admin.addNewsItem.publish') }}
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
import { useNewsStore } from '@/stores/newsStore'
const mapStore = useMapStore()
const newsStore = useNewsStore()

const blankNewsItem = ref({ ...newsStore.blankNewsItem })

const saving = ref(false)

const isValid = computed(() => {
  if (!blankNewsItem.value.title) return false
  if (!blankNewsItem.value.category) return false

  return true
})

async function saveNewsItem() {
  saving.value = true
  try {
    await newsStore.addNewsItem(blankNewsItem.value)
    alert.success(t('admin.addNewsItem.newsItemAdded'))
    saving.value = false
    mapStore.rightDrawerOpen = null
  } catch (e) {
    saving.value = false
    alert.error(t('admin.addNewsItem.error'))
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
  blankNewsItem.value = { ...newsStore.blankNewsItem }
}

function cancel() {
  mapStore.rightDrawerOpen = null
}

function updateGeoJson() {
  blankNewsItem.value.geoData = { ...mapStore.draw.getAll() }
}

const touched = computed({})

const dateRange = computed({
  get() {
    if (DateTime.isDateTime(blankNewsItem.value.activeUntil)) {
      return {
        from: dt.toQuasarDateString(blankNewsItem.value.activeFrom),
        to: dt.toQuasarDateString(blankNewsItem.value.activeUntil),
      }
    }
    return dt.toQuasarDateString(blankNewsItem.value.activeFrom)
  },
  set(val) {
    if (val instanceof String) {
      blankNewsItem.value.activeFrom = dt.parseQuasarDateString(val)
      blankNewsItem.value.activeUntil = ''
    }

    if (val instanceof Object) {
      blankNewsItem.value.activeFrom = dt.parseQuasarDateString(val.from)
      blankNewsItem.value.activeUntil = dt.parseQuasarDateString(val.to)
    }
  },
})
</script>
