import mapboxgl from 'mapbox-gl'
import center from '@turf/center'

const mapUtils = {
  drawNewsItem: function ({ map, newsItem, categories, locale }) {
    // set color
    const color = categories[newsItem.category]?.color
    if (!color) return
    if (!newsItem.geoData) return

    // create popup
    const popup = new mapboxgl.Popup({ focusAfterOpen: false }) // add popups
      .setHTML(
        `<h6 class="popup-header">${newsItem.title[locale.value]}</h6><p>${newsItem.description[locale.value]}</p>`
      )

    newsItem.geoData.features.forEach((gd, index) => {
      // unique id
      const id = `${newsItem.id}-${index}`

      // point
      if (gd.geometry.type === 'Point') {
        const marker = new mapboxgl.Marker({
          color: color,
          className: id,
        })
        marker.setLngLat(gd.geometry.coordinates)
        marker.setPopup(popup)
        marker.addTo(map)
      }

      // polygon
      if (gd.geometry.type === 'Polygon') {
        if (!map.getSource(id)) map.addSource(id, { type: 'geojson', data: gd })
        if (!map.getLayer(`${newsItem.id}-fill`)) {
          map.addLayer({
            id: `${newsItem.id}-fill`,
            type: 'fill',
            source: id,
            layout: {},
            paint: {
              'fill-color': color,
              'fill-opacity': 0.5,
            },
          })
        }
        if (!map.getLayer(`${newsItem.id}-line`)) {
          map.addLayer({
            id: `${newsItem.id}-line`,
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
        marker.setPopup(popup)
        marker.addTo(map)
      }
    })
  },

  moveMapToNewsItem: function ({ map, newsItem }) {
    const coords = center(newsItem.geoData).geometry.coordinates
    map.easeTo({ center: coords, duration: 1000 })
  },
}

export { mapUtils }
