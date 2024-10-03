<template>
  <q-btn-group flat class="q-mr-md">
    <q-btn
      padding="xs sm"
      flat
      label="English"
      style="border-right: 1px solid #fff"
      @click="$router.push({ name: $route.name, params: { lang: 'en' } })"
    />
    <q-btn
      padding="xs sm"
      flat
      label="عربي"
      @click="$router.push({ name: $route.name, params: { lang: 'ar' } })"
    />
  </q-btn-group>
</template>
<script setup></script>
