import api from '@/api'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { dt } from '@/utils'
import { mapUtils } from '@/utils/map'
import { useMapStore } from '@/stores/mapStore'

function parseNewsItem(newsItem) {
  const activeFrom = dt.parseSimpleDateString(newsItem.activeFrom)
  const activeUntil = dt.parseSimpleDateString(newsItem.activeUntil)
  return { ...newsItem, activeFrom, activeUntil }
}

function serializeForApi(newsItem) {
  const activeFrom = DateTime.isDateTime(newsItem.activeFrom)
    ? newsItem.activeFrom.toFormat(dt.simpleDateFormat)
    : null
  const activeUntil = DateTime.isDateTime(newsItem.activeUntil)
    ? newsItem.activeUntil.toFormat(dt.simpleDateFormat)
    : null
  return { ...newsItem, activeFrom, activeUntil }
}

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsItems: [],
    categories: {},
  }),
  getters: {
    categoryOptions: (state) =>
      Object.entries(state.categories).map(([key, category]) => ({
        label: category.title,
        value: key,
      })),
    blankNewsItem: () => ({
      title: '',
      category: '',
      description: '',
      activeFrom: DateTime.now(),
      activeUntil: '',
      status: 'published',
      geoData: {},
    }),
  },
  actions: {
    async fetchNewsItems() {
      const { data } = await api.get('/newsItems')
      this.newsItems = data.map(parseNewsItem)
    },

    async fetchAdminNewsItems() {
      const { data } = await api.get('/admin/newsItems')
      this.newsItems = data.map(parseNewsItem)
    },

    async fetchCategories() {
      const { data } = await api.get('/categories')
      data.forEach(
        (c) =>
          (this.categories[c.key] = {
            title: c.title,
            color: c.color,
            icon: c.icon,
            active: c.active,
          })
      )
    },

    async addNewsItem(newNewsItem) {
      const { data } = await api.post('/admin/newsItems', {
        newsItem: serializeForApi(newNewsItem),
      })
      const parsedNewsItem = parseNewsItem(data)
      this.newsItems.push(parsedNewsItem)
      const mapStore = useMapStore()
      mapUtils.drawNewsItem({
        map: mapStore.map,
        newsItem: parsedNewsItem,
        categories: this.categories,
      })
    },
  },
})
