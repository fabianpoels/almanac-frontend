import { defineStore } from 'pinia'

// mapboxgl
import mapboxgl from 'mapbox-gl'
import StylesControl from '@mapbox-controls/styles'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import MapboxLanguage from '@mapbox/mapbox-gl-language'

const defaultCenter = [35.4903, 33.8964]

export const useMapStore = defineStore('map', {
  state: () => ({
    mapboxApiKey: import.meta.env.VITE_MAPBOX_API_KEY,
    mapStyle: 'mapbox://styles/mapbox/standard',
    map: null,
    mapLanguage: null,
    editMap: null,
    draw: null,
    loadingMap: false,
  }),
  getters: {},
  actions: {
    async initializeMap({ map, t, locale }) {
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

      // language control
      const language = new MapboxLanguage({
        defaultLanguage: locale.value,
      })
      map.addControl(language)
      this.mapLanguage = language

      // ADD SCALE
      // apparently this plugin breaks the map
      // const scale = new mapboxgl.ScaleControl({
      //   maxWidth: 100,
      //   unit: 'metric',
      // })
      // map.addControl(scale, 'bottom-left')

      this.map = map
    },

    initializeEditMap({ element, center, t, geoData }) {
      console.log('initializing edit map')
      if (!this.mapboxApiKey) return
      if (this.editMap) {
        this.editMap.remove()
        this.editMap = null
      }
      mapboxgl.accessToken = this.mapboxApiKey
      const map = new mapboxgl.Map({
        container: element,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center instanceof Array && center.length === 2 ? center : defaultCenter,
        zoom: 8,
        pitchWithRotate: false,
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

      const draw = new MapboxDraw({
        controls: {
          point: true,
          polygon: true,
          trash: true,
        },
        displayControlsDefault: false,
      })

      map.addControl(draw, 'top-right')

      this.editMap = map
      this.draw = draw

      map.once('load', () => {
        map.resize()
      })
    },

    clearMap() {
      console.log('clearing map')
      if (this.map) {
        this.map.remove()
        this.map = null
      }
    },

    clearEditMap() {
      console.log('clearing edit map')
      if (this.editMap) {
        this.editMap.remove()
        this.editMap = null
        this.draw = null
      }
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
