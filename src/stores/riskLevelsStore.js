import api from '@/api'
import { defineStore } from 'pinia'
import { dt } from '@/utils'

function parseRiskLevel(riskLevel) {
  const createdAt = dt.parseServerDatetime(riskLevel.createdAt)

  return { ...riskLevel, createdAt }
}

export const useRiskLevelsStore = defineStore('riskLevels', {
  state: () => ({
    municipalities: [],
    riskLevels: [],
    riskColors: ['#43a047', '#ffb300', '#e53935'],
    riskNames: ['minor', 'moderate', 'severe'],
  }),
  getters: {
    blankRiskLevel: () => ({
      municipalities: [],
      level: 0,
    }),

    filteredMunicipalities() {
      const usedIds = this.riskLevels.flatMap((rl) => rl.municipalities).map((m) => m.id)
      return this.municipalities.filter((m) => !usedIds.includes(m.id))
    },

    mapRiskLevels() {
      return this.riskLevels.map((rl) => ({
        id: rl.id,
        level: rl.level,
        color: this.riskColors[rl.level],
        geoData: {
          type: 'FeatureCollection',
          features: rl.municipalities.flatMap((m) => m.geoData.features),
        },
      }))
    },
  },
  actions: {
    async fetchMunicipalities() {
      const { data } = await api.get('/admin/municipalities')
      this.municipalities = data
    },

    async fetchRiskLevels() {
      const { data } = await api.get('/riskLevels')
      this.riskLevels = data.map(parseRiskLevel)
    },

    async fetchAdminRiskLevels() {
      const { data } = await api.get('/admin/riskLevels')
      this.riskLevels = data.map(parseRiskLevel)
    },

    async createRiskLevel(newRiskLevel) {
      const { data } = await api.post(`/admin/riskLevels`, {
        level: newRiskLevel.level,
        municipalities: newRiskLevel.municipalities.map((m) => m.value),
      })
      const parsedRiskLevel = parseRiskLevel(data)
      this.riskLevels.unshift(parsedRiskLevel)
    },

    async deleteRiskLevel(riskLevel) {
      const response = await api.delete(`/admin/riskLevels/${riskLevel.id}`)
      if (response.status === 200) {
        this.riskLevels = this.riskLevels.filter((rl) => rl.id !== riskLevel.id)
      }
    },
  },
})
