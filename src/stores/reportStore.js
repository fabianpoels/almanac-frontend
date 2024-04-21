import api from '@/api'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { dt } from '@/utils'
import { mapUtils } from '@/utils/map'
import { useMapStore } from '@/stores/mapStore'

function parseReport(report) {
  const activeFrom = dt.parseSimpleDateString(report.activeFrom)
  const activeUntil = dt.parseSimpleDateString(report.activeUntil)
  return { ...report, activeFrom, activeUntil }
}

function serializeForApi(report) {
  const activeFrom = DateTime.isDateTime(report.activeFrom)
    ? report.activeFrom.toFormat(dt.simpleDateFormat)
    : null
  const activeUntil = DateTime.isDateTime(report.activeUntil)
    ? report.activeUntil.toFormat(dt.simpleDateFormat)
    : null
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
      const { data } = await api.post('admin/reports', { report: serializeForApi(newReport) })
      const parsedReport = parseReport(data)
      this.reports.push(parsedReport)
      const mapStore = useMapStore()
      mapUtils.drawReport({ map: mapStore.map, report: parsedReport, categories: this.categories })
    },
  },
})
