<template>
  <q-btn-group id="language-buttons" flat class="q-mr-md">
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
  <q-btn id="language-menu" flat round icon="language">
    <q-menu fit>
      <q-list>
        <q-item
          clickable
          @click="$router.push({ name: $route.name, params: { lang: 'en' } })"
          v-close-popup
        >
          <q-item-section>English</q-item-section>
        </q-item>
        <q-item
          clickable
          @click="$router.push({ name: $route.name, params: { lang: 'ar' } })"
          v-close-popup
        >
          <q-item-section>عربي</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script setup></script>
<style scoped>
#language-menu {
  display: none;
}
@media only screen and (max-width: 500px) {
  #language-buttons {
    display: none;
  }

  #language-menu {
    display: block;
  }
}
</style>
