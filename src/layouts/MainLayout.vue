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
        <q-btn
          color="negative"
          icon="phone"
          label="SOS"
          @click="showSos = true"
          v-if="authStore.authenticated"
        />
        <sos-dialog v-model="showSos" />
        <user-button v-if="authStore.authenticated" />
        <!-- <q-btn v-else @click="showLogin = true" flat>{{ $t('login.login') }}</q-btn> -->
        <q-btn icon="info" flat round @click="$router.push({ name: 'about' })" />
      </q-toolbar>
    </q-header>

    <q-drawer
      side="left"
      v-model="mapStore.leftDrawerOpen"
      overlay
      bordered
      class="q-pa-sm"
      style="width: 400px"
    >
      <news-item-list />
      <div class="q-drawer-hide absolute" style="top: 15px; right: -17px">
        <q-btn
          dense
          round
          unelevated
          color="primary"
          icon="chevron_left"
          @click="mapStore.leftDrawerOpen = false"
        />
      </div>
    </q-drawer>

    <login-dialog v-model="showLogin" />

    <q-page-container>
      <map-page />
      <q-page-sticky position="top-left" :offset="[18, 18]" v-if="!mapStore.leftDrawerOpen">
        <q-btn round size="md" icon="feed" color="primary" @click="toggleLeftDrawer">
          <q-badge v-if="newsStore.newsItems.length > 0" color="red" floating>
            {{ newsStore.newsItems.length }}
          </q-badge>
        </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useNewsStore } from '@/stores/newsStore'
import { useAuthStore } from '@/stores/authStore'

const mapStore = useMapStore()
const newsStore = useNewsStore()
const authStore = useAuthStore()

import UserButton from '@/components/_UserButton.vue'
import LogoRound from '@/components/LogoRound.vue'
import MapPage from '@/pages/MapPage.vue'
import NewsItemList from '@/components/NewsItemList.vue'
import AdminControls from '@/components/admin/AdminControls.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import SosDialog from '@/components/SosDialog.vue'

defineOptions({
  name: 'MainLayout',
})

function toggleLeftDrawer() {
  mapStore.leftDrawerOpen = !mapStore.leftDrawerOpen
}

const showLogin = ref(false)
const showSos = ref(false)
</script>
<style scoped>
.title {
  display: flex;
  align-items: center;
}
</style>
