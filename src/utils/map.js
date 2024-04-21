import mapboxgl from 'mapbox-gl'
import center from '@turf/center'

const mapUtils = {
  drawReport: function ({ map, report, categories }) {
    // set color
    const color = categories[report.category]?.color
    if (!color) return
    if (!report.geoData) return
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
        if (!map.getSource(id)) map.addSource(id, { type: 'geojson', data: gd })
        if (!map.getLayer(`${report.id}-fill`)) {
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
        }
        if (!map.getLayer(`${report.id}-line`)) {
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
        const marker = new mapboxgl.Marker({
          color: color,
          className: id,
        })
        marker.setLngLat(center(gd).geometry.coordinates)
        marker.addTo(map)
      }
    })
  },

  moveMapToReport: function ({ map, report }) {
    const coords = center(report.geoData).geometry.coordinates
    map.easeTo({ center: coords, duration: 1000 })
  },
}

export { mapUtils }
