import api from '@/api'
import { defineStore } from 'pinia'

export const usePoisStore = defineStore('pois', {
  state: () => ({
    pois: [],
  }),
  getters: {},
  actions: {
    async fetchPois() {
      const { data } = await api.get('/pois')
      this.pois = data
    },
  },
})
