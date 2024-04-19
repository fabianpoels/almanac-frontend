import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
  state: () => ({
    mapboxApiKey:
      'pk.eyJ1IjoiZmFiaWFucG9lbHMiLCJhIjoiY2x2NDJuZjVvMDQ0OTJqbjFvMTdkMHRzZiJ9.CkgoSJz5vC_P9WBsQfIeBw',
    mapStyle: 'mapbox://styles/mapbox/standard',
  }),
  getters: {},
  actions: {},
})
