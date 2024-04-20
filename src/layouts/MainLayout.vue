<template>
  <q-layout view="hHr lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="list" @click="toggleLeftDrawer">
          <q-badge v-if="mapStore.reports.length > 0" color="red" floating>
            {{ mapStore.reports.length }}
          </q-badge>
        </q-btn>
        <q-toolbar-title>
          {{ $t('header.almanac') }}
        </q-toolbar-title>
        <q-btn flat round dense icon="account_circle" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <report-list />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useMapStore } from '@/stores/map-store'
const mapStore = useMapStore()

import ReportList from '@/components/ReportList.vue'

defineOptions({
  name: 'MainLayout',
})

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
