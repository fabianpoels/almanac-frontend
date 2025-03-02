<template>
  <q-select
    :disable="props.disable"
    class="q-mt-sm"
    v-model="riskLevel"
    :label="$t('admin.riskLevels.riskLevel')"
    :options="levelOptions"
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
</template>
<script setup>
import { ref, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const riskLevel = defineModel()

const props = defineProps({
  disable: {
    type: Boolean,
    default: false,
  },
})

const levelOptions = ref([
  { label: 'none', value: -1, color: 'white' },
  { label: 'minor', value: 0, color: 'green-7' },
  { label: 'moderate', value: 1, color: 'amber-7' },
  { label: 'severe', value: 2, color: 'red-7' },
])
</script>
