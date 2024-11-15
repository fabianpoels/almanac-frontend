<template>
  <q-toggle
    v-model="model"
    :color="categoryOption.value"
    :label="categoryOption.label"
    :icon="categoryOption.icon"
    keep-color
  />
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  categoryOption: {
    type: Object,
    required: true,
  },
  toggledOn: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['toggle'])

const model = computed({
  get() {
    return props.toggledOn
  },
  set(val) {
    emit('toggle', val)
  },
})
</script>
