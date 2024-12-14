<template>
  <q-dialog v-model="showDialog">
    <q-card>
      <q-toolbar>
        <q-btn
          flat
          :label="dt.report(dt.parseQuasarDateString(date), locale)"
          :disable="loading"
          :icon-right="showDateMenu ? 'arrow_drop_up' : 'arrow_drop_down'"
        >
          <q-menu v-model="showDateMenu" fit>
            <q-date
              v-model="date"
              minimal
              :disable="loading"
              @update:model-value="(val) => fetchReport(val)"
              :options="(date) => selectableDate(date)"
            />
          </q-menu>
        </q-btn>
        <q-space />
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section v-if="report" class="scroll report-content">
        <template v-for="section in sections" :key="section">
          <div v-if="report.reportContent[section][locale]" class="q-mb-lg">
            <div class="text-h5">{{ $t(`reports.sections.${section}`) }}</div>
            <div>{{ report.reportContent[section][locale] }}</div>
          </div>
        </template>
      </q-card-section>
      <q-card-section v-else class="scroll report-content">
        <div class="flex justify-center">{{ $t('reports.no_report') }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useReportsStore } from '@/stores/reportsStore'
import { useI18n } from 'vue-i18n'
import { dt } from '@/utils'

const { locale } = useI18n()
const reportsStore = useReportsStore()
const showDialog = defineModel()
const loading = ref(false)
const showDateMenu = ref(false)
const date = ref(dt.todayAsQuasarDateString())

const report = computed(() => reportsStore.report)

async function fetchReport(dateString) {
  let date = dt.parseQuasarDateString(dateString)
  if (!date.isValid) {
    console.error('invalid date format')
    return
  }
  loading.value = true
  showDateMenu.value = false
  try {
    await reportsStore.fetchReport(date.toFormat('yyyyMMdd'))
  } catch (e) {
    console.error(e)
  }
  loading.value = false
}

function selectableDate(quasarDateString) {
  const date = dt.parseQuasarDateString(quasarDateString)

  return date <= dt.now() && date >= reportsStore.firstReportDate
}

const sections = [
  'overview',
  'security',
  'politics',
  'economy',
  'intelligence',
  'early_warning',
  'misc',
  'recommendations',
]
</script>
<style scoped>
.report-content {
  height: 80vh;
  /* min-width: 560px; */
}
</style>
