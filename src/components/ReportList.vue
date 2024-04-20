<template>
  <q-list separator>
    <q-item v-for="report in mapStore.reports" :key="report.id">
      <q-item-section>
        <q-item-label>{{ report.title }}</q-item-label>
        <q-item-label caption>{{ report.description }}</q-item-label>
      </q-item-section>
      <q-item-section side top>
        <q-item-label caption>{{ dt.short(report.activeFrom) }}</q-item-label>
        <q-btn @click="moveToLocation(report)" round class="icon" size="xs" icon="my_location" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup>
import { dt } from '@/utils'
import { mapUtils } from '@/utils/map'
import { useMapStore } from '@/stores/map-store'
const mapStore = useMapStore()

function moveToLocation(report) {
  mapUtils.moveMapToReport({ report, map: mapStore.map })
}
</script>
<style scoped>
.icon {
  margin-top: 10px;
}
</style>
