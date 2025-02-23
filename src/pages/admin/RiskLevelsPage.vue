<template>
  <q-page>
    <q-table
      :title="$t('admin.riskLevels.riskLevels')"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      flat
      bordered
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:top-left>
        <h5 class="q-my-sm">{{ $t('admin.riskLevels.riskLevels') }}</h5>
        <q-btn class="q-ml-md" @click="showAdd = true" flat round :disable="loading" icon="add" />
      </template>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template #body-cell-municipalities="props">
        <q-td :props="props">
          {{ props.value.length }}
        </q-td>
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
          <q-btn @click="editLevel(props.row)" flat rounded color="primary">
            {{ $t('forms.edit') }}
          </q-btn>
          <q-btn @click="deleteLevel(props.row)" flat rounded color="primary">
            {{ $t('forms.delete') }}
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <add-risk-level v-model="showAdd" :riskLevel="riskLevelsStore.blankRiskLevel" />
    <delete-risk-level v-model="showDelete" :riskLevel="levelToDelete" />
    <edit-risk-level v-model="showEdit" :riskLevel="levelToEdit" />
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
import EditRiskLevel from '@/components/admin/EditRiskLevel.vue'

const loading = ref(false)
const showAdd = ref(false)
const showEdit = ref(false)
const showDelete = ref(false)
const levelToEdit = ref({})
const levelToDelete = ref({})
const filter = ref('')

function editLevel(level) {
  levelToEdit.value = level
  showEdit.value = true
}

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
