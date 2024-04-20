import mapboxgl from 'mapbox-gl'
import center from '@turf/center'
import { useMapStore } from '@/stores/map-store'
const mapStore = useMapStore()

const mapUtils = {
  drawReport: function ({ map, report }) {
    // set color
    const color = mapStore.categories[report.category]?.color
    if (!color) return
    report.geoData.features.forEach((gd, index) => {
      // unique id
      const id = `${report.id}-${index}`

      // point
      if (gd.geometry.type === 'Point') {
        const marker = new mapboxgl.Marker({
          color: color,
          className: id,
        })
        marker.setLngLat(gd.geometry.coordinates)
        marker.addTo(map)
      }

      // polygon
      if (gd.geometry.type === 'Polygon') {
        map.addSource(id, { type: 'geojson', data: gd })
        map.addLayer({
          id: `${report.id}-fill`,
          type: 'fill',
          source: id,
          layout: {},
          paint: {
            'fill-color': color,
            'fill-opacity': 0.5,
          },
        })
        const marker = new mapboxgl.Marker({
          color: color,
          className: id,
        })
        marker.setLngLat(center(gd).geometry.coordinates)
        marker.addTo(map)
        map.addLayer({
          id: `${report.id}-line`,
          type: 'line',
          source: id,
          layout: {},
          paint: {
            'line-color': color,
            'line-width': 1,
          },
        })
      }
    })
  },

  moveMapToReport: function ({ map, report }) {
    const coords = center(report.geoData).geometry.coordinates
    map.easeTo({ center: coords, duration: 1000 })
  },
}

export { mapUtils }
