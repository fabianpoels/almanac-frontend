<template>
  <q-card class="municipalities-card q-pa-sm">
    <q-tabs v-model="tab" dense align="justify" @update:model-value="(val) => tabChanged(val)">
      <q-tab name="edit" :label="$t('forms.edit')" />
      <q-tab name="new" :label="$t('forms.new')" :disable="municipalitySelected" />
    </q-tabs>
    <q-tab-panels v-model="tab">
      <!-- EDIT -->
      <q-tab-panel name="edit">
        <q-select
          :disable="saving"
          :clearable="!saving"
          :label="$t('admin.municipalities.municipalities')"
          :options="selectOptions"
          @filter="filterFn"
          v-model="selectedMunicipality"
          :use-input="!municipalitySelected"
          :option-value="(m) => m.id || ''"
          :option-label="(m) => m.name[locale] || ''"
          map-options
          @update:model-value="(val) => updateSelectedMunicipality(val)"
        />
        <div v-if="municipalitySelected">
          <risk-level-select
            class="q-mt-sm"
            :disable="saving"
            v-model="editMunicipality.riskLevel"
          />
          <div class="flex flex-row justify-end">
            <q-btn
              flat
              color="primary"
              class="q-mt-lg"
              :label="$t('forms.cancel')"
              :disable="saving"
              @click="selectedMunicipality = null"
            />
            <q-btn
              v-if="!editMunicipality.osmId"
              color="negative"
              class="q-mt-lg"
              :label="$t('forms.delete')"
              :disable="saving"
              @click="showDelete = true"
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
        </div>
      </q-tab-panel>

      <!-- NEW -->
      <q-tab-panel name="new">
        <q-input
          v-model="newMunicipality.name.en"
          :label="`${$t('admin.municipalities.name')} - ${$t('language.english')}`"
          :disable="saving"
        />
        <q-input
          v-model="newMunicipality.name.ar"
          :label="`${$t('admin.municipalities.name')} - ${$t('language.arabic')}`"
          :disable="saving"
        />
        <risk-level-select class="q-mt-sm" :disable="saving" v-model="newMunicipality.riskLevel" />
        <div class="flex flex-row justify-end">
          <q-btn
            class="q-mt-lg q-ml-sm"
            color="secondary"
            :label="$t('forms.save')"
            :loading="saving"
            :disable="!validNewMunicipality"
            @click="create"
          />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
  <delete-municipality
    v-if="selectedMunicipality?.id"
    v-model="showDelete"
    :municipality="selectedMunicipality"
    @delete="deleted"
  />
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore()
import { useRiskLevelsStore } from '@/stores/riskLevelsStore'
const riskLevelsStore = useRiskLevelsStore()
import { alert } from '@/utils/alert'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
import RiskLevelSelect from './_RiskLevelSelect.vue'
import DeleteMunicipality from './DeleteMunicipality.vue'

const saving = ref(false)
const selectOptions = ref([])
const selectedMunicipality = defineModel()
const editMunicipality = ref(null)
const newMunicipality = ref(null)
const tab = ref('edit')
const showDelete = ref(false)

const filterFn = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    selectOptions.value = municipalities.value.filter(
      (m) => m.name[locale.value]?.toLowerCase().indexOf(needle) > -1
    )
  })
}

const municipalities = computed(() => riskLevelsStore.sortedMunicipalities(locale.value))

const municipalitySelected = computed(() => !!selectedMunicipality.value?.id)

watch(
  () => riskLevelsStore.sortedMunicipalities(locale.value),
  (val) => {
    selectOptions.value = val
  },
  { immediate: true }
)

async function save() {
  saving.value = true
  try {
    await riskLevelsStore.updateMunicipality(editMunicipality.value)
    await riskLevelsStore.fetchRiskLevels()
    selectedMunicipality.value = null
    editMunicipality.value = null
    alert.success(t('forms.saved'))
    saving.value = false
  } catch (e) {
    saving.value = false
    console.log(e)
    alert.error(t('forms.errorSaving'))
  }
}

async function create() {
  saving.value = true
  try {
    await riskLevelsStore.createMunicipality(newMunicipality.value)
    await riskLevelsStore.fetchRiskLevels()
    mapStore.deactiveDrawingMode()
    tab.value = 'edit'
    alert.success(t('forms.saved'))
    saving.value = false
  } catch (e) {
    saving.value = false
    console.log(e)
    alert.error(t('forms.errorSaving'))
  }
}

function updateSelectedMunicipality(val) {
  if (val && val.id) {
    editMunicipality.value = { ...val }
  } else {
    editMunicipality.value = null
  }
}

const touched = computed(() => {
  if (!selectedMunicipality.value) return false
  if (!editMunicipality.value) return false
  return selectedMunicipality.value.riskLevel !== editMunicipality.value.riskLevel
})

function tabChanged(val) {
  if (val === 'new') {
    newMunicipality.value = riskLevelsStore.blankMunicipality
    mapStore.activateDrawingMode()
    mapStore.map.on('draw.create', updateGeoJson)
    mapStore.map.on('draw.delete', updateGeoJson)
    mapStore.map.on('draw.update', updateGeoJson)
  } else {
    mapStore.deactiveDrawingMode()
  }
}

function updateGeoJson() {
  newMunicipality.value.geoData = { ...mapStore.draw.getAll() }
}

const validNewMunicipality = computed(() => {
  if (!newMunicipality.value.name) return false
  if (!newMunicipality.value.name.en) return false
  if (!newMunicipality.value.name.ar) return false
  if (newMunicipality.value.name.en.length < 3) return false
  if (newMunicipality.value.name.ar.length < 3) return false
  if (!newMunicipality.value.geoData.features) return false
  return newMunicipality.value.geoData.features.length === 1
})

function deleted() {
  selectedMunicipality.value = null
  editMunicipality.value = null
}
</script>
<style scoped>
.municipalities-card {
  width: 400px;
}
</style>
