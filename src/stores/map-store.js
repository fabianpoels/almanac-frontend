import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
  state: () => ({
    mapboxApiKey: '',
    mapStyle: 'mapbox://styles/mapbox/standard',
  }),
  getters: {},
  actions: {},
})
