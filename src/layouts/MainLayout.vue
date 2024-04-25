<template>
  <q-layout view="hHh lpr fFf">
    <q-header v-model="mapStore.showHeader">
      <q-toolbar>
        <q-btn flat round dense icon="list" @click="toggleLeftDrawer">
          <q-badge v-if="reportStore.reports.length > 0" color="red" floating>
            {{ reportStore.reports.length }}
          </q-badge>
        </q-btn>
        <q-toolbar-title>
          {{ $t('header.almanac') }}
        </q-toolbar-title>
        <admin-controls />
        <q-toggle
          v-model="darkMode"
          checked-icon="dark_mode"
          unchecked-icon="light_mode"
          color="grey-4"
        />
        <q-btn flat round dense icon="account_circle">
          <q-menu fit>
            <q-list>
              <q-item clickable @click="logout" v-close-popup>
                <q-item-section>{{ $t('header.logout') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer side="left" v-model="mapStore.leftDrawerOpen" bordered>
      <report-list />
    </q-drawer>

    <add-report />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useReportStore } from '@/stores/reportStore'
import { useAuthStore } from '@/stores/authStore'
const mapStore = useMapStore()
const reportStore = useReportStore()
const authStore = useAuthStore()
const $q = useQuasar()

import ReportList from '@/components/ReportList.vue'
import AdminControls from '@/components/admin/AdminControls.vue'
import AddReport from '@/components/admin/AddReport.vue'

defineOptions({
  name: 'MainLayout',
})

function toggleLeftDrawer() {
  mapStore.leftDrawerOpen = !mapStore.leftDrawerOpen
}

const darkMode = computed({
  get() {
    return $q.dark.isActive
  },
  set(val) {
    $q.dark.set(val)
  },
})

function logout() {
  authStore.logout()
}
</script>
