<template>
  <q-dialog v-model="showDialog" :persistent="loggingIn">
    <q-card class="q-pa-xl">
      <div id="formHeader"><h4>Almanac</h4></div>
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
  </q-dialog>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
import { alert } from '@/utils/alert'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const showDialog = defineModel()

defineOptions({
  name: 'LoginDialog',
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
#formHeader {
  width: 100%;
  text-align: center;
}

#loginForm {
  width: 300px;
}

#loginButton {
  width: 100%;
}
</style>
