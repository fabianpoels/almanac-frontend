<template>
  <q-page>
    <q-table
      :title="$t('admin.news.newsItems')"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="color(props.value)" :label="$t(`admin.news.status.${props.value}`)" />
        </q-td>
      </template>
      <template #body-cell-actions="">
        <q-btn flat rounded color="primary">
          <q-icon icon="edit" color="primary" />
        </q-btn>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { alert } from '@/utils/alert'
import { useNewsStore } from '@/stores/newsStore'
const newsStore = useNewsStore()
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
import { dt } from 'src/utils'

import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

const loading = ref(false)

function onRowClick(val) {
  console.log(val)
}

const colors = {
  published: 'green',
  pending: 'orange',
  archived: 'red',
}

function color(status) {
  return colors[status]
}

const columns = computed(() => {
  return [
    {
      name: 'id',
      label: 'id',
      field: (row) => row.id,
      sortable: false,
    },
    {
      name: 'timestamp',
      label: 'timestamp',
      field: (row) => dt.long(row.timestamp),
      sortable: false,
    },
    {
      name: 'title',
      label: 'title',
      field: (row) => row.title[locale.value],
      sortable: false,
    },
    {
      name: 'channel',
      label: 'channel',
      field: (row) => row.provider,
      sortable: false,
    },
    {
      name: 'status',
      label: 'status',
      field: (row) => row.status,
      sortable: false,
    },
    {
      name: 'actions',
      label: 'actions',
      field: (row) => row,
      sortable: false,
    },
  ]
})

const rows = computed(() => {
  return newsStore.adminNewsItems
})

onMounted(async () => {
  loading.value = true
  try {
    await newsStore.fetchAdminNewsItems()
  } catch (e) {
    console.error(e)
    alert.error(e)
  }
  loading.value = false
})
</script>
