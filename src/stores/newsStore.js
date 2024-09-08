import api from '@/api'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { dt } from '@/utils'
import { mapUtils } from '@/utils/map'
import { useMapStore } from '@/stores/mapStore'

function parseNewsItem(newsItem) {
  const timestamp = dt.parseServerDatetime(newsItem.timestamp)

  return { ...newsItem, timestamp }
}

function serializeForApi(newsItem) {
  const timestamp = dt.serializeDatetime(newsItem.timestamp)

  return { ...newsItem, timestamp }
}

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsItems: [],
    adminNewsItems: [],
    categories: {},
  }),
  getters: {
    categoryOptions: (state) =>
      Object.entries(state.categories).map(([key, category]) => ({
        label: category.title,
        value: key,
      })),
    blankNewsItem: () => ({
      title: { en: '', ar: '' },
      category: '',
      description: { en: '', ar: '' },
      timestamp: DateTime.now(),
      status: 'published',
      geoData: {},
    }),
    activeNewsItems: (state) => state.newsItems.filter((ni) => ni.status === 'published'),
  },
  actions: {
    async fetchNewsItems() {
      const { data } = await api.get('/news')
      this.newsItems = data.map(parseNewsItem)
    },

    async fetchAdminNewsItems() {
      const { data } = await api.get('/a/news')
      this.adminNewsItems = data.map(parseNewsItem)
    },

    async fetchCategories(t) {
      const { data } = await api.get('/categories')

      data.forEach(
        (c) =>
          (this.categories[c.key] = {
            title: t(`category.${c.key}`),
            color: c.color,
            icon: c.icon,
            active: c.active,
          })
      )
    },

    async updateNewsItem(newsItem) {
      const { data } = await api.put(`/a/news/${newsItem.id}`, serializeForApi(newsItem))
      const parsedNewsItem = parseNewsItem(data)
      const index = this.adminNewsItems.findIndex((ni) => ni.id === parsedNewsItem.id)
      if (index > -1) {
        this.adminNewsItems[index] = parsedNewsItem
      }

      // TODO: add updatenewsitem method in maputils
      //
      // const mapStore = useMapStore()
      // mapUtils.drawNewsItem({
      //   map: mapStore.map,
      //   newsItem: parsedNewsItem,
      //   categories: this.categories,
      // })
    },
  },
})
