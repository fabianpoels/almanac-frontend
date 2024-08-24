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

watch(
  () => route.params.lang,
  (lang) => {
    if (availableLocales.includes(lang)) {
      locale.value = lang
    }
  }
)
</script>
