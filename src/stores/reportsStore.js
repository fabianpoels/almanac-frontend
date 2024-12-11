import api from '@/api'
import { defineStore } from 'pinia'
import { dt } from '@/utils'

function parseReport(report) {
  const date = dt.parseSimpleDate(report.date)

  return { ...report, date }
}

export const useReportsStore = defineStore('reports', {
  state: () => ({
    latestReport: null,
  }),
  getters: {},
  actions: {
    async fetchLatestReport() {
      const { data } = await api.get('/latestReport')
      this.latestReport = parseReport(data)
    },
  },
})
