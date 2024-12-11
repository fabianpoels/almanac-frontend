<template>
  <q-dialog v-model="showDialog">
    <q-card class="q-pa-xl" v-if="report">
      <div class="text-h2">{{ report.date.toFormat('yyyy/MM/dd') }}</div>
      <template v-for="section in sections" :key="section">
        <div v-if="report.reportContent[section][locale]" class="q-mt-lg">
          <div class="text-h5">{{ $t(`reports.sections.${section}`) }}</div>
          <div>{{ report.reportContent[section][locale] }}</div>
        </div>
      </template>
    </q-card>
    <q-card class="q-pa-xl" v-else>
      {{ $t('reports.no_report') }}
    </q-card>
  </q-dialog>
</template>
<script setup>
import { defineModel, computed } from 'vue'
import { useReportsStore } from '@/stores/reportsStore'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const reportsStore = useReportsStore()
const showDialog = defineModel()

const report = computed(() => reportsStore.latestReport)

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
