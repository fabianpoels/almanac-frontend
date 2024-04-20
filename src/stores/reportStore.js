import api from '@/api'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { dt } from '@/utils'

function parseReport(report) {
  const activeFrom = dt.parseSimpleDateString(report.activeFrom)
  const activeUntil = dt.parseSimpleDateString(report.activeUntil)
  return { ...report, activeFrom, activeUntil }
}

export const useReportStore = defineStore('report', {
  state: () => ({
    reports: [],
    categories: {},
  }),
  getters: {
    categoryOptions: (state) =>
      Object.entries(state.categories).map(([key, category]) => ({
        label: category.title,
        value: key,
        icon: category.icon,
      })),
    blankReport: () => {
      return {
        title: '',
        category: '',
        description: '',
        activeFrom: DateTime.now(),
        activeUntil: '',
        status: 'published',
        geoData: {},
      }
    },
  },
  actions: {
    async fetchReports() {
      const { data } = await api.get('/reports')
      this.reports = data.map(parseReport)
    },

    async fetchCategories() {
      const { data } = await api.get('/categories')
      data.forEach(
        (c) =>
          (this.categories[c.key] = {
            title: c.title,
            color: c.color,
            icon: c.icon,
            active: c.active,
          })
      )
    },

    async addReport(newReport) {
      const preparedReport = {
        ...newReport,
        activeFrom: newReport.activeFrom.toFormat(dt.simpleDateFormat),
        activeUntil: newReport.activeUntil.toFormat(dt.simpleDateFormat) || '',
      }
      const { data } = await api.post('/reports', { report: preparedReport })
    },
  },
})
