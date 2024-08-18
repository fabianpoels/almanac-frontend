<template>
  <q-layout view="hHh lpr fFf">
    <q-header>
      <q-toolbar>
        <admin-controls v-if="authStore.isAdmin" />
        <q-toolbar-title>
          {{ $t('header.almanac') }}
        </q-toolbar-title>
        <!-- <q-toggle
          v-model="darkMode"
          checked-icon="dark_mode"
          unchecked-icon="light_mode"
          color="grey-4"
        /> -->
        <q-btn flat round icon="account_circle">
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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
const authStore = useAuthStore()
const $q = useQuasar()
const router = useRouter()

import AdminControls from '@/components/admin/AdminControls.vue'

defineOptions({
  name: 'AdminLayout',
})

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
