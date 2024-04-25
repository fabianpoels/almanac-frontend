import { defineStore } from 'pinia'
import { Loading, QSpinnerGears } from 'quasar'

// mapboxgl
import mapboxgl from 'mapbox-gl'
import StylesControl from '@mapbox-controls/styles'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

// utilities
import { dt } from '@/utils'
import { mapUtils } from '@/utils/map'

// other stores
import { useReportStore } from '@/stores/reportStore'

const defaultCenter = [35.4903, 33.8964]

export const useMapStore = defineStore('map', {
  state: () => ({
    mapboxApiKey:
      'pk.eyJ1IjoiZmFiaWFucG9lbHMiLCJhIjoiY2x2NDJuZjVvMDQ0OTJqbjFvMTdkMHRzZiJ9.CkgoSJz5vC_P9WBsQfIeBw',
    mapStyle: 'mapbox://styles/mapbox/standard',
    map: null,
    leftDrawerOpen: false,
    rightDrawerOpen: null,
    showHeader: true,
    draw: null,
    loadingMap: false,
  }),
  getters: {},
  actions: {
    initializeMap({ element, center, t }) {
      Loading.show()
      const reportStore = useReportStore()
      if (!this.mapboxApiKey) return
      mapboxgl.accessToken = this.mapboxApiKey
      const map = new mapboxgl.Map({
        container: element,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center instanceof Array && center.length === 2 ? center : defaultCenter,
        zoom: 13,
        pitchWithRotate: false,
      })

      map.on('load', async () => {
        await reportStore.fetchReports()
        await reportStore.fetchCategories()
        reportStore.reports.forEach((report) =>
          mapUtils.drawReport({ map, report, categories: reportStore.categories })
        )
        Loading.hide()
      })

      map.on('style.load', () => {
        reportStore.reports.forEach((report) =>
          mapUtils.drawReport({ map, report, categories: reportStore.categories })
        )
      })

      map.addControl(
        new StylesControl({
          styles: [
            {
              label: t('map.styles.standard'),
              styleName: 'Mapbox Light',
              styleUrl: 'mapbox://styles/mapbox/light-v11',
            },
            {
              label: t('map.styles.terrain'),
              styleName: 'Mapbox Outdoors',
              styleUrl: 'mapbox://styles/mapbox/outdoors-v12',
            },
            {
              label: t('map.styles.satellite'),
              styleName: 'Mapbox Satellite Streets',
              styleUrl: 'mapbox://styles/mapbox/satellite-streets-v12',
            },
            {
              label: t('map.styles.traffic'),
              styleName: 'Mapbox Navigation Day',
              styleUrl: 'mapbox://styles/mapbox/navigation-day-v1',
            },
          ],
        }),
        'bottom-right'
      )

      // ADD ZOOM BUTTONS
      const nav = new mapboxgl.NavigationControl({
        showCompass: true,
      })
      map.addControl(nav, 'bottom-right')

      // ADD SCALE
      const scale = new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      })
      map.addControl(scale)

      this.map = map
    },

    activateDrawingMode() {
      if (!this.draw) {
        const draw = new MapboxDraw({
          controls: {
            point: true,
            polygon: true,
            trash: true,
          },
          displayControlsDefault: false,
        })
        this.draw = draw
      }
      this.map.addControl(this.draw, 'top-right')
    },

    deactiveDrawingMode() {
      if (!this.draw || !this.map) return
      this.draw.deleteAll()
      this.map.removeControl(this.draw)
    },
  },
})
