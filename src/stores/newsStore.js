import api from '@/api'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { dt } from '@/utils'
import { useApplicationStore } from './applicationStore'

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
    categoryFilter: [],
    showUnread: true,
    timespan: '24hr',
    customRange: { from: '', to: '' },
  }),
  getters: {
    categoryOptions: (state) => {
      return (t) =>
        Object.keys(state.categories).map((key) => ({
          label: t(`category.${key}`),
          value: key,
        }))
    },
    blankNewsItem: () => ({
      title: { en: '', ar: '' },
      category: '',
      description: { en: '', ar: '' },
      timestamp: DateTime.now(),
      status: 'published',
      geoData: {},
    }),
    activeNewsItems() {
      const applicationStore = useApplicationStore()

      return this.newsItems.filter((ni) => {
        if (!this.showUnread && !applicationStore.isNew(ni)) return false
        return ni.status === 'published' && this.categoryFilter.includes(ni.category)
      })
    },
    activeCategories() {
      return [...new Set(this.newsItems.map((i) => i.category))]
    },
  },
  actions: {
    async fetchNewsItems() {
      const { data } = await api.post('/news', {
        span: this.timespan,
        from: this.customRange.from,
        to: this.customRange.to,
      })
      this.newsItems = data.map(parseNewsItem)
      this.categoryFilter = Object.keys(this.categories)
    },

    async fetchAdminNewsItems() {
      const { data } = await api.get('/admin/news')
      this.adminNewsItems = data.map(parseNewsItem)
    },

    async fetchCategories() {
      const { data } = await api.get('/categories')
      this.categoryFilter = []
      data.forEach((c) => {
        this.categoryFilter.push(c.key)
        this.categories[c.key] = {
          color: c.color,
          icon: c.icon,
          active: c.active,
        }
      })
    },

    async createNewsItem(newsItem) {
      const { data } = await api.post(`/admin/news`, serializeForApi(newsItem))
      const parsedNewsItem = parseNewsItem(data)
      this.adminNewsItems.unshift(parsedNewsItem)
    },

    async updateNewsItem(newsItem) {
      const { data } = await api.put(`/admin/news/${newsItem.id}`, serializeForApi(newsItem))
      const parsedNewsItem = parseNewsItem(data)
      const index = this.adminNewsItems.findIndex((ni) => ni.id === parsedNewsItem.id)
      if (index > -1) this.adminNewsItems[index] = parsedNewsItem
    },
  },
})
