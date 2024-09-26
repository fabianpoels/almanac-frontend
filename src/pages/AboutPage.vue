<template>
  <blank-layout>
    <q-page class="page">
      <div id="header"></div>
      <div class="q-pa-lg">{{ $t('about.p1') }}</div>
      <div class="q-pa-lg">{{ $t('about.p2') }}</div>
      <q-btn
        class="q-ma-lg"
        icon="map"
        color="primary"
        :label="$t('about.goToMap')"
        @click="$router.push({ name: 'root' })"
      />
    </q-page>
  </blank-layout>
</template>

<script setup>
import BlankLayout from '@/layouts/BlankLayout.vue'

defineOptions({
  name: 'AboutPage',
})
</script>
<style scoped>
#header {
  width: 100%;
  height: 300px;
  text-align: center;
  background: url('/images/almanac_logo_full.png') center no-repeat;
  background-size: contain;
}

.page {
  width: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
}

@media only screen and (max-width: 650px) {
  .page {
    width: 100%;
  }
}
</style>
