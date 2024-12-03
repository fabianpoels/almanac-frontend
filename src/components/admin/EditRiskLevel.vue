<template>
  <q-dialog v-model="showDialog" :persistent="saving">
    <q-card class="q-pa-md">
      <q-form>
        <h6>{{ $t('admin.riskLevels.editRiskLevel') }}</h6>
        <q-select
          :disable="saving"
          v-model="localRiskLevel.municipalities"
          :label="$t('admin.riskLevels.municipalities')"
          :options="selectOptions"
          @filter="filterFn"
          multiple
          input-debounce="0"
          use-input
          use-chips
        />
        <q-select
          :disable="saving"
          class="q-mt-sm"
          v-model="localRiskLevel.level"
          :label="$t('admin.riskLevels.riskLevel')"
          :options="riskOptions"
          emit-value
          map-options
        >
          <template #selected-item="scope">
            <q-badge :color="scope.opt.color" class="q-mr-sm" />
            {{ t(`admin.riskLevels.levels.${scope.opt.label}`) }}
          </template>
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-badge :color="scope.opt.color" rounded class="q-mr-sm" />
              {{ t(`admin.riskLevels.levels.${scope.opt.label}`) }}
            </q-item>
          </template>
        </q-select>
        <div class="flex flex-row justify-end">
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
            :disable="!valid"
            @click="save"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useRiskLevelsStore } from '@/stores/riskLevelsStore'
const riskLevelsStore = useRiskLevelsStore()
import { alert } from '@/utils/alert'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const showDialog = defineModel()
const localRiskLevel = ref({})
const saving = ref(false)

const valid = computed(() => {
  const rl = localRiskLevel.value
  if (rl.municipalities.length < 1) return false
  return true
})

const options = computed(() => {
  return riskLevelsStore.filteredMunicipalities.map((m) => ({
    label: m.name[locale.value],
    value: m.id,
  }))
})

const riskOptions = ref([
  { label: 'minor', value: 0, color: 'green-7' },
  { label: 'moderate', value: 1, color: 'amber-7' },
  { label: 'severe', value: 2, color: 'red-7' },
])

const selectOptions = ref([])

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    selectOptions.value = options.value.filter((o) => o.label?.toLowerCase().indexOf(needle) > -1)
  })
}

watch(
  () => riskLevelsStore.filteredMunicipalities,
  (val) => {
    selectOptions.value = val.map((m) => ({
      label: m.name[locale.value],
      value: m.id,
    }))
  }
)

const props = defineProps({
  riskLevel: {
    type: Object,
    required: true,
  },
})

watch(showDialog, (val) => {
  if (val === true) {
    saving.value = false
    localRiskLevel.value = { ...props.riskLevel }
    localRiskLevel.value.municipalities = props.riskLevel.municipalities.map((m) => ({
      label: m.name[locale.value],
      value: m.id,
    }))
  }
})

const save = async function () {
  saving.value = true
  try {
    await riskLevelsStore.updateRiskLevel({ ...localRiskLevel.value })
    alert.success(t('forms.saved'))
    showDialog.value = false
  } catch (e) {
    saving.value = false
    console.log(e)
    alert.error(t('forms.errorSaving'))
  }
}
</script>
<style scoped></style>
