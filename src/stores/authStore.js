import api from '@/api'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { dt } from '@/utils'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    refreshTokenTimeout: null,
    jwt: null,
  }),
  getters: {
    authenticated: (state) => !!state.user && !!state.jwt,
    isAdmin: (state) => state.user && ['admin', 'superadmin'].includes(state.user.role),
  },
  actions: {
    async login({ email, password }) {
      const { data } = await api.post('/auth/login', { email, password }, { withCredentials: true })
      this.user = data.user
      this.jwt = data.jwt
      this.startRefreshTokenTimer()
    },

    async logout() {
      try {
        await api.post('/auth/logout')
      } catch (e) {
        console.log(e)
      }
      this.stopRefreshTokenTimer()
      this.user = null
      this.jwt = null
      this.router.push({ name: 'login' })
    },

    async refreshToken() {
      try {
        const response = await api.post(`/auth/refresh-token`, {}, { withCredentials: true })
        if (response.status === 200 && response.data.user && response.data.jwt) {
          this.user = response.data.user
          this.jwt = response.data.jwt
          this.startRefreshTokenTimer()
        }
      } catch (e) {
        // console.error(e)
        console.log('ALMANAC: error refreshing token, clearing session')
        this.stopRefreshTokenTimer()
        this.user = null
        this.jwt = null
        // this.router.push({ name: 'root' })
      }
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
