<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          icon="arrow_back"
          :label="$t('header.backToMap')"
          @click="$router.push({ name: 'root' })"
        />
        <q-toolbar-title class="title">
          <LogoRound class="q-mr-sm" />
          {{ $t('header.almanac') }}
        </q-toolbar-title>
        <user-button v-if="authStore.authenticated" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

import LogoRound from '@/components/LogoRound.vue'
import UserButton from '@/components/_UserButton.vue'

defineOptions({
  name: 'BlankLayout',
})
</script>
<style scoped>
.title {
  display: flex;
  align-items: center;
}
</style>
