<template>
  <router-view />
</template>

<script setup>
defineOptions({
  name: 'App',
})

import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
const { availableLocales, locale } = useI18n({ useScope: 'global' })
import { useRoute } from 'vue-router'
const route = useRoute()

//
import mapboxgl from 'mapbox-gl'
mapboxgl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.3.0/mapbox-gl-rtl-text.js',
  null,
  true // Lazy load the plugin
)

watch(
  () => route.params.lang,
  (lang) => {
    if (availableLocales.includes(lang)) {
      locale.value = lang
    }
  }
)
</script>
