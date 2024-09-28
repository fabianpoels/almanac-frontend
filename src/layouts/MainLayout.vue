<template>
  <q-layout view="hHh lpr fFf">
    <q-header v-model="mapStore.showHeader">
      <q-toolbar>
        <admin-controls v-if="authStore.isAdmin" />
        <q-toolbar-title class="title">
          <LogoRound class="q-mr-sm" />
          {{ $t('header.almanac') }}
        </q-toolbar-title>
        <!-- <q-toggle
          v-model="darkMode"
          checked-icon="dark_mode"
          unchecked-icon="light_mode"
          color="grey-4"
        /> -->
        <sos-button v-if="authStore.authenticated" />
        <language-selector />
        <q-btn icon="info" flat round @click="$router.push({ name: 'about' })" />
        <user-button v-if="authStore.authenticated" />
        <!-- <q-btn v-else @click="showLogin = true" flat>{{ $t('login.login') }}</q-btn> -->
      </q-toolbar>
    </q-header>

    <news-item-drawer />

    <login-dialog v-model="showLogin" />

    <q-page-container>
      <map-page />
      <q-page-sticky position="top-left" :offset="[18, 18]" v-if="!mapStore.leftDrawerOpen">
        <q-btn round size="md" icon="feed" color="primary" @click="toggleLeftDrawer">
          <q-badge v-if="applicationStore.unseenNewsItemsCount > 0" color="red" floating>
            {{ applicationStore.unseenNewsItemsCount }}
          </q-badge>
        </q-btn>
        <filter-buttons />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useAuthStore } from '@/stores/authStore'
import { useApplicationStore } from '@/stores/applicationStore'

const mapStore = useMapStore()
const authStore = useAuthStore()
const applicationStore = useApplicationStore()

import UserButton from '@/components/_UserButton.vue'
import LogoRound from '@/components/LogoRound.vue'
import MapPage from '@/pages/MapPage.vue'
import NewsItemDrawer from '@/components/NewsItemDrawer.vue'
import AdminControls from '@/components/admin/AdminControls.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import SosButton from '@/components/SosButton.vue'
import FilterButtons from '@/components/map/FilterButtons.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'

defineOptions({
  name: 'MainLayout',
})

function toggleLeftDrawer() {
  mapStore.leftDrawerOpen = !mapStore.leftDrawerOpen
}

const showLogin = ref(false)
</script>
<style scoped>
.title {
  display: flex;
  align-items: center;
}
</style>
