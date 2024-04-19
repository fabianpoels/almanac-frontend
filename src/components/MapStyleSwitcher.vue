<template>
  <q-dialog v-model="model" position="bottom">
    <q-card style="width: auto; padding-right: 18px">
      <q-option-group
        :options="styleOptions"
        :modelValue="props.selectedStyle"
        @update:modelValue="(val) => $emit('switchStyle', val)"
      />
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { computed } from 'vue'
const model = defineModel()
const props = defineProps({ selectedStyle: String })

const styleOptions = [
  {
    label: t('map.styles.standard'),
    value: 'mapbox://styles/mapbox/standard',
  },
  {
    label: t('map.styles.satellite'),
    value: 'mapbox://sprites/mapbox/satellite-streets-v12',
  },
  {
    label: t('map.styles.traffic'),
    value: 'mapbox://styles/mapbox/navigation-day-v1',
  },
]
</script>
