import api from '@/api'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { dt } from '@/utils'
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

const cookieString = 'AlmanacNewestSeen'

import { useAuthStore } from './authStore'
const authStore = useAuthStore()

import { useNewsStore } from './newsStore'

const defaultSeen = DateTime.fromFormat('2024/08/31', dt.quasarDateFormat) //the day the first item was parsed on PROD

export const useApplicationStore = defineStore('application', {
  state: () => ({
    newestSeen: defaultSeen,
    seenNewsItems: [],
  }),
  getters: {
    isNew: (state) => (newsItem) => !state.seenNewsItems.includes(newsItem.id),
    unseenNewsItemsCount() {
      const newsStore = useNewsStore()
      return newsStore.activeNewsItems.filter((ni) => this.isNew(ni)).length
    },
  },
  actions: {
    async loadHasSeen() {
      const newsStore = useNewsStore()
      const cookie = cookies.get(cookieString)
      if (!!cookie) {
        const parsed = dt.parseServerDatetime(cookie)
        if (parsed.isValid) this.newestSeen = parsed
      }
      this.seenNewsItems = newsStore.newsItems
        .filter((ni) => ni.timestamp <= this.newestSeen)
        .map((ni) => ni.id)
    },

    setHasSeen(timestamp) {
      if (!DateTime.isDateTime(timestamp) || !timestamp.isValid) return
      this.newestSeen = timestamp
      cookies.set(cookieString, dt.serializeDatetime(timestamp))
    },

    markAsSeen(newsItem) {
      this.seenNewsItems.push(newsItem.id)
      if (newsItem.timestamp > this.newestSeen) this.setHasSeen(newsItem.timestamp)
    },

    markAllActiveAsSeen() {
      const newsStore = useNewsStore()
      let newest = this.newestSeen
      newsStore.activeNewsItems
        .filter((ni) => this.isNew(ni))
        .forEach((ni) => {
          this.seenNewsItems.push(ni.id)
          if (ni.timestamp > newest) newest = ni.timestamp
        })
      this.setHasSeen(newest)
    },
  },
})
