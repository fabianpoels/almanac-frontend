<template>
  <q-btn flat round dense icon="menu">
    <q-menu>
      <q-list class="admin-menu-list">
        <q-item clickable @click="router.push({ name: 'map' })">
          <q-item-section avatar>
            <q-avatar icon="map" />
          </q-item-section>
          <q-item-section>{{ $t('admin.menu.map') }}</q-item-section>
        </q-item>
        <q-separator />
        <template v-if="showAddReport">
          <q-item clickable @click="addReport" v-close-popup>
            <q-item-section avatar>
              <q-avatar icon="add" />
            </q-item-section>
            <q-item-section>{{ $t('admin.menu.addReport') }}</q-item-section>
          </q-item>
          <q-separator />
        </template>
        <q-item clickable v-close-popup @click="router.push({ name: 'adminReports' })">
          <q-item-section avatar>
            <q-avatar icon="feed" />
          </q-item-section>
          <q-item-section>{{ $t('admin.menu.reports') }}</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="router.push({ name: 'adminUsers' })">
          <q-item-section avatar>
            <q-avatar icon="people" />
          </q-item-section>
          <q-item-section>{{ $t('admin.menu.users') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore()
const route = useRoute()
const router = useRouter()

function addReport() {
  mapStore.rightDrawerOpen = 'addReport'
}

const showAddReport = computed(() => {
  return route.name === 'map'
})
</script>
