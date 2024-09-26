<template>
  <blank-layout>
    <q-page class="page">
      <div id="header"></div>
      <div class="q-pa-lg">{{ $t('about.p1') }}</div>
      <div class="q-pa-lg">{{ $t('about.p2') }}</div>
      <q-btn class="q-ma-lg" icon="map" color="primary" :label="$t('about.goToMap')" />
    </q-page>
  </blank-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
import { alert } from '@/utils/alert'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import BlankLayout from '@/layouts/BlankLayout.vue'

defineOptions({
  name: 'LoginPage',
})

const email = ref('')
const password = ref('')
const loggingIn = ref(false)

const formValid = computed(() => {
  if (!email.value || email.value.length < 10) return false
  if (!password.value || password.value.length < 9) return false
  return true
})

const login = async function () {
  loggingIn.value = true
  try {
    await authStore.login({ email: email.value, password: password.value })
  } catch (e) {
    loggingIn.value = false
    console.log(e)
    alert.error(t('login.wrong_email_or_password'))
  }
}
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
