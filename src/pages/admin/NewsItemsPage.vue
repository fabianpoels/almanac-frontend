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
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:top>
        <h5 class="q-my-sm">{{ $t('admin.news.newsItems') }}</h5>
        <q-btn class="q-ml-md" @click="showAdd = true" flat round :disable="loading" icon="add" />
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="color(props.value)" :label="$t(`admin.news.statuses.${props.value}`)" />
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn @click="editItem(props.row)" flat rounded color="primary">
            {{ $t('forms.edit') }}
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <add-news-item v-model="showAdd" :newsItem="newsStore.blankNewsItem" />
    <edit-news-item v-model="showEdit" :newsItem="itemToEdit" />
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { alert } from '@/utils/alert'
import AddNewsItem from '@/components/admin/AddNewsItem.vue'
import EditNewsItem from '@/components/admin/EditNewsItem.vue'
import { useNewsStore } from '@/stores/newsStore'
const newsStore = useNewsStore()
import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore()
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
import { dt } from 'src/utils'

const loading = ref(false)
const showAdd = ref(false)
const showEdit = ref(false)
const itemToEdit = ref({})

function editItem(item) {
  itemToEdit.value = item
  showEdit.value = true
}

const colors = {
  published: 'green',
  pending: 'orange',
  archived: 'red',
}

function color(status) {
  return colors[status]
}

onBeforeRouteLeave(() => {
  mapStore.clearEditMap()
})

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
