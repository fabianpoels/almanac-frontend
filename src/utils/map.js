import mapboxgl from 'mapbox-gl'
import center from '@turf/center'
import { dt } from '@/utils'
import CustomPin from '@/components/map/CustomPin.vue'
import { render, h } from 'vue'

const mapUtils = {
  drawNewsItem: function ({ map, newsItem, categories, locale, t }) {
    // set color
    const color = categories[newsItem.category]?.color
    const icon = categories[newsItem.category]?.icon
    if (!color) return
    if (!icon) return
    if (!newsItem.geoData) return

    // create popup
    const popup = new mapboxgl.Popup({ focusAfterOpen: false }) // add popups
      .setHTML(
        `<h6 class="popup-header">${newsItem.title[locale.value]}</h6>
        <div class="flex inline">
          <div class="q-badge flex inline items-center no-wrap q-badge--single-line" role="status" style="background-color: ${color};">
            ${t(`category.${newsItem.category}`)}
          </div>
          <div class="q-ml-sm">${dt.short(newsItem.timestamp)} - ${dt.time(newsItem.timestamp)}</div>
        </div>
        <p class="q-mt-sm">${newsItem.description[locale.value]}</p>`
      )

    newsItem.geoData.features.forEach((gd, index) => {
      // unique id
      const id = `${newsItem.id}-${index}`

      // point
      if (gd.geometry.type === 'Point') {
        const el = document.createElement('div')
        el.className = 'marker'
        const vueComponent = h(CustomPin, { color, icon })
        render(vueComponent, el)
        const marker = new mapboxgl.Marker(el)
        marker.setLngLat(gd.geometry.coordinates)
        marker.setPopup(popup)
        marker.addTo(map)
      }
    })
  },

  drawRiskLevels: function ({ map, riskLevels, colors }) {
    // governorates
    const colorsArray = Object.values(colors)
    riskLevels.governorates.forEach(governorate => {
      const id = `g-${governorate.id}`
      if (!map.getSource(id)) map.addSource(id, { type: 'geojson', data: governorate.geoData })
      if (!map.getLayer(id)) {
        map.addLayer({
          id: id,
          type: 'fill',
          source: id,
          layout: {},
          paint: {
            'fill-color': colorsArray[governorate.riskLevel],
            'fill-opacity': 0.2,
          },
        })
      }
    })

    // municipalities
    const municipalities = riskLevels.municipalities
    for (const [key, value] of Object.entries(municipalities)) {
      const id = `rl-${key}`
      if (!map.getSource(id)) map.addSource(id, { type: 'geojson', data: value })
      if (!map.getLayer(id)) {
        map.addLayer({
          id: id,
          type: 'fill',
          source: id,
          layout: {},
          paint: {
            'fill-color': colors[key],
            'fill-opacity': 0.2,
          },
        })
      }
    }
  },

  moveMapToNewsItem: function ({ map, newsItem }) {
    const coords = center(newsItem.geoData).geometry.coordinates
    map.easeTo({ center: coords, duration: 1000, zoom: 12 })
  },

  resetZoom: function ({ map }) {
    map.easeTo({ duration: 1000, zoom })
  },
}

export default mapUtils
