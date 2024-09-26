<template>
  <q-btn v-if="authStore.authenticated" flat round icon="account_circle">
    <q-menu fit>
      <q-list>
        <q-item clickable @click="authStore.logout()" v-close-popup>
          <q-item-section>{{ $t('header.logout') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script setup>
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
</script>
