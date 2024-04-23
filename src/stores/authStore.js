import api from '@/api'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { dt } from '@/utils'

export const useAuthStore = defineStore('report', {
  state: () => ({
    user: null,
    refreshTokenTimeout: null,
    jwt: null,
  }),
  getters: {
    authenticated: (state) => !!state.user && !!state.jwt,
  },
  actions: {
    async login({ email, password }) {
      const { data } = await api.post('/login', { email, password })
      this.user = data.user
      this.jwt = data.jwt
      this.startRefreshTokenTimer()
    },

    logout() {
      api.post('/logout')
      this.stopRefreshTokenTimer()
      this.user = null
      router.push('/login')
    },

    async refreshToken() {
      const { data } = await api.post(`/refresh-token`)

      this.startRefreshTokenTimer()
    },

    startRefreshTokenTimer() {
      // parse json object from base64 encoded jwt token
      const jwtBase64 = this.jwt.split('.')[1]
      const parsedJwt = JSON.parse(atob(jwtBase64))

      // set a timeout to refresh the token a minute before it expires
      const expires = new Date(parsedJwt.exp * 1000)
      const timeout = expires.getTime() - Date.now() - 60 * 1000
      this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout)
    },

    stopRefreshTokenTimer() {
      clearTimeout(this.refreshTokenTimeout)
    },
  },
})
