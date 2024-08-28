<template>
  <q-btn flat round dense icon="menu">
    <q-menu>
      <q-list class="admin-menu-list">
        <q-item v-if="showMap" clickable @click="router.push({ name: 'root' })">
          <q-item-section avatar>
            <q-avatar icon="map" />
          </q-item-section>
          <q-item-section>{{ $t('admin.menu.map') }}</q-item-section>
        </q-item>
        <q-separator />
        <template v-if="showAddNewsItem">
          <q-item clickable @click="addNewsItem" v-close-popup>
            <q-item-section avatar>
              <q-avatar icon="add" />
            </q-item-section>
            <q-item-section>{{ $t('admin.menu.addNewsItem') }}</q-item-section>
          </q-item>
          <q-separator />
        </template>
        <q-item clickable v-close-popup @click="router.push({ name: 'adminNewsItems' })">
          <q-item-section avatar>
            <q-avatar icon="feed" />
          </q-item-section>
          <q-item-section>{{ $t('admin.menu.newsItems') }}</q-item-section>
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

function addNewsItem() {
  mapStore.rightDrawerOpen = 'addNewsItem'
}

const showAddNewsItem = computed(() => {
  return route.name === 'root'
})

const showMap = computed(() => {
  return route.name !== 'root'
})
</script>
