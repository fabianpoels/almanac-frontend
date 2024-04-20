import api from '@/api'
import { defineStore } from 'pinia'
import { dt } from '@/utils'

function parseReport(report) {
  const activeFrom = dt.parseSimpleDateString(report.activeFrom)
  const activeUntil = dt.parseSimpleDateString(report.activeUntil)
  return { ...report, activeFrom, activeUntil }
}

export const useMapStore = defineStore('map', {
  state: () => ({
    mapboxApiKey:
      'pk.eyJ1IjoiZmFiaWFucG9lbHMiLCJhIjoiY2x2NDJuZjVvMDQ0OTJqbjFvMTdkMHRzZiJ9.CkgoSJz5vC_P9WBsQfIeBw',
    mapStyle: 'mapbox://styles/mapbox/standard',
    reports: [],
    categories: {},
    map: null,
  }),
  getters: {},
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
  },
})
