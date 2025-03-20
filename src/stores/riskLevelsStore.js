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
    governorates: [],
    publicRiskLevels: {},
    riskColors: ['#43a047', '#ffb300', '#e53935'],
    publicRiskColors: {
      minor: '#43a047',
      moderate: '#ffb300',
      severe: '#e53935',
    },
    riskNames: ['minor', 'moderate', 'severe'],
  }),
  getters: {
    blankRiskLevel: () => ({
      municipalities: [],
      level: 0,
    }),

    blankMunicipality: () => ({
      name: {
        en: '',
        ar: '',
      },
      geoData: {},
      riskLevel: -1,
    }),

    filteredMunicipalities() {
      const usedIds = this.riskLevels.flatMap((rl) => rl.municipalities).map((m) => m.id)
      return this.municipalities.filter((m) => !usedIds.includes(m.id))
    },

    sortedMunicipalities() {
      return this.municipalities.sort((a, b) => {
        const name_a = !!a.name ? a.name.en || '' : ''
        const name_b = !!b.name ? b.name.en || '' : ''
        return name_a.localeCompare(name_b)
      })
    },

    sortedGovernorates() {
      return this.governorates.sort((a, b) => {
        const name_a = !!a.name ? a.name.en || '' : ''
        const name_b = !!b.name ? b.name.en || '' : ''
        return name_a.localeCompare(name_b)
      })
    },

    locationOptions() {
      let remainingMunicipalities = [...this.sortedMunicipalities]
      const result = []
      this.sortedGovernorates.forEach(g => {
        result.push({
          ...g,
          isGovernorate: true
        })
        let municipalities = [...remainingMunicipalities]
        remainingMunicipalities = []
        municipalities.forEach(m => {
          if (m.governorateOsmId && m.governorateOsmId === g.osmId) {
            result.push(m)
          } else {
            remainingMunicipalities.push(m)
          }
        })
      })
      return result
    }
  },
  actions: {
    riskLevelColor(index) {
      if (Number.isNaN(index) || index < 0) return '#00b0ff'
      return this.riskColors[index]
    },

    async fetchMunicipalities() {
      const { data } = await api.get('/admin/municipalities')
      this.municipalities = data
    },

    async fetchGovernorates() {
      const { data } = await api.get('/admin/governorates')
      this.governorates = data
    },

    async createMunicipality(municipality) {
      const { data } = await api.post(`/admin/municipalities`, municipality)
      const newMunicipality = data
      this.municipalities.push(newMunicipality)
    },

    async updateMunicipality(municipality) {
      const { data } = await api.put(`/admin/municipalities/${municipality.id}`, municipality)
      const updatedMunicipality = data
      const index = this.municipalities.findIndex((m) => m.id === updatedMunicipality.id)
      if (index > -1) this.municipalities[index] = updatedMunicipality
    },

    async updateGovernorate(governorate) {
      const { data } = await api.put(`/admin/governorates/${governorate.id}`, governorate)
      const updatedGovernorate = data
      const index = this.governorates.findIndex((m) => m.id === updatedGovernorate.id)
      if (index > -1) this.governorates[index] = updatedGovernorate
    },

    async deleteMunicipality(municipality) {
      const response = await api.delete(`/admin/municipalities/${municipality.id}`)
      if (response.status === 200) {
        this.municipalities = this.municipalities.filter((m) => m.id !== municipality.id)
      }
    },

    async fetchRiskLevels() {
      const { data } = await api.get('/riskLevels')
      this.publicRiskLevels = data
    },
  },
})
