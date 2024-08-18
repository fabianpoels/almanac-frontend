<template>
  <q-page>
    <q-table
      flat
      bordered
      :title="$t('admin.users.users')"
      :rows="rows"
      :columns="columns"
      :loading="loading"
    />
  </q-page>
</template>

<script setup>
import { watch, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/usersStore.js'
import { useI18n } from 'vue-i18n'
import { alert } from '@/utils/alert'
const { t } = useI18n()
const usersStore = useUsersStore()
const route = useRoute()

const loading = ref(false)

const columns = []

const rows = computed(() => {
  return usersStore.users || []
})

watch(
  () => route.name,
  (name) => {
    if (name === 'adminUsers') fetchUsers()
  },
  { immediate: true }
)

async function fetchUsers() {
  loading.value = true
  try {
    await usersStore.fetchUsers()
  } catch (e) {
    console.log(e)
    alert.error(t('admin.users.error_loading_users'))
  }
  loading.value = false
}
</script>
