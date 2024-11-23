<template>
  <q-page>
    <q-table
      :title="$t('admin.riskLevels.riskLevels')"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:top>
        <h5 class="q-my-sm">{{ $t('admin.riskLevels.riskLevels') }}</h5>
        <q-btn class="q-ml-md" @click="showAdd = true" flat round :disable="loading" icon="add" />
      </template>
      <template #body-cell-level="props">
        <q-td :props="props">
          <q-badge
            :style="{ 'background-color': riskLevelsStore.riskColors[props.value] }"
            :label="$t(`admin.riskLevels.levels.${riskLevelsStore.riskNames[props.value]}`)"
          />
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn @click="deleteLevel(props.row)" flat rounded color="primary">
            {{ $t('forms.delete') }}
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <add-risk-level v-model="showAdd" :riskLevel="riskLevelsStore.blankRiskLevel" />
    <delete-risk-level v-model="showDelete" :riskLevel="levelToDelete" />
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { alert } from '@/utils/alert'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
import { dt } from 'src/utils'
import { useRiskLevelsStore } from '@/stores/riskLevelsStore'
const riskLevelsStore = useRiskLevelsStore()

import AddRiskLevel from '@/components/admin/AddRiskLevel.vue'
import DeleteRiskLevel from '@/components/admin/DeleteRiskLevel.vue'

const loading = ref(false)
const showAdd = ref(false)
const showDelete = ref(false)
const levelToDelete = ref({})

function deleteLevel(level) {
  levelToDelete.value = level
  showDelete.value = true
}

onMounted(async () => {
  loading.value = true
  try {
    await riskLevelsStore.fetchMunicipalities()
    await riskLevelsStore.fetchAdminRiskLevels()
  } catch (e) {
    console.error(e)
    alert.error(e)
  }
  loading.value = false
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
      name: 'createdAt',
      label: 'createdAt',
      field: (row) => dt.long(row.createdAt),
      sortable: false,
    },
    {
      name: 'municipalities',
      label: 'municipalities',
      field: (row) => row.municipalities.map((m) => `${m.name[locale.value]},`),
      sortable: false,
    },
    {
      name: 'level',
      label: 'level',
      field: (row) => row.level,
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
  return riskLevelsStore.riskLevels
})
</script>
