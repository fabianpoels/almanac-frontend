<template>
  <q-layout view="hHr lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          {{ $t('header.almanac') }}
        </q-toolbar-title>
        <q-btn flat round dense icon="account_circle" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      overlay
    >

    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'


defineOptions({
  name: 'MainLayout'
})


const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
