import api from '@/api'
import { defineStore } from 'pinia'
import { dt } from '@/utils'

function parseReport(report) {
  const date = dt.parseSimpleDate(report.date)

  return { ...report, date }
}

export const useReportsStore = defineStore('reports', {
  state: () => ({
    report: null,
    firstReportDate: dt.parseSimpleDate('20241211'),
  }),
  getters: {},
  actions: {
    async fetchReport(dateString) {
      try {
        const { data } = await api.get(`/report?date=${dateString}`)
        this.report = parseReport(data)
      } catch (e) {
        if (e.status === 404) {
          this.report = null
        } else {
          throw e
        }
      }
    },
  },
})
