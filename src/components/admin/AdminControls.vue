<template>
  <q-btn color="primary" icon="admin_panel_settings">
    <q-menu fit>
      <q-list class="admin-menu-list">
        <q-item clickable @click="addReport" v-close-popup>
          <q-item-section>{{ $t('admin.menu.addReport') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script setup>
import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore()
function addReport() {
  mapStore.leftDrawerOpen = false
  mapStore.showHeader = false
  mapStore.rightDrawerOpen = 'addReport'
}
</script>
