import { defineStore } from 'pinia'
import { dt } from '@/utils'

export const useMapStore = defineStore('map', {
  state: () => ({
    mapboxApiKey:
      'pk.eyJ1IjoiZmFiaWFucG9lbHMiLCJhIjoiY2x2NDJuZjVvMDQ0OTJqbjFvMTdkMHRzZiJ9.CkgoSJz5vC_P9WBsQfIeBw',
    mapStyle: 'mapbox://styles/mapbox/standard',
    map: null,
    leftDrawerOpen: false,
    rightDrawerOpen: null,
    showHeader: true,
  }),
  getters: {},
  actions: {},
})
