import api from '@/api'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { dt } from '@/utils'

export const useAuthStore = defineStore('report', {
  state: () => ({
    user: null,
    refreshTokenTimeout: null,
  }),
  getters: {},
  actions: {},
})
