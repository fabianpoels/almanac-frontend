import api from '@/api'
import { defineStore } from 'pinia'

export const useRiskLevelsStore = defineStore('riskLevels', {
  state: () => ({
    municipalities: [],
    riskLevels: [],
  }),
  getters: {},
  actions: {
    async fetchMunicipalities() {
      const { data } = await api.get('/admin/municipalities')
      this.municipalities = data
    },
  },
})
