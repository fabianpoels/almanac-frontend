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
        <!-- <q-toggle
          v-model="darkMode"
          checked-icon="dark_mode"
          unchecked-icon="light_mode"
          color="grey-4"
        /> -->
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="row justify-center items-center">
        <q-card class="q-pa-xl">
          <div id="formHeader"></div>
          <q-form id="loginForm">
            <q-input
              v-model="email"
              name="email"
              type="email"
              :label="$t('login.email')"
              :disable="loggingIn"
            />
            <q-input
              class="q-mt-md"
              v-model="password"
              name="password"
              type="password"
              :label="$t('login.password')"
              :disable="loggingIn"
            />
            <q-btn
              id="loginButton"
              class="q-mt-lg"
              color="primary"
              :label="$t('login.login')"
              :loading="loggingIn"
              :disable="!formValid"
              @click="login"
            >
            </q-btn>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
import { alert } from '@/utils/alert'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import LogoRound from '@/components/LogoRound.vue'

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
.title {
  display: flex;
  align-items: center;
}

#formHeader {
  width: 100%;
  height: 300px;
  text-align: center;
  background: url('/images/almanac_logo_full.png') center no-repeat;
  background-size: contain;
}

#loginForm {
  width: 300px;
}

@media only screen and (max-width: 650px) {
  #loginForm {
    width: 250px;
  }
}

#loginButton {
  width: 100%;
}
</style>
