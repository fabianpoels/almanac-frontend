import api from '@/api'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

function parseUser(user) {
  // const activeFrom = dt.parseSimpleDateString(user.activeFrom)
  // const activeUntil = dt.parseSimpleDateString(user.activeUntil)
  // return { ...user, activeFrom, activeUntil }
  return { ...user }
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
  }),
  // getters: {
  //   users: (state) => state.users,
  // },
  actions: {
    async fetchUsers() {
      console.log('fetching')
      const { data } = await api.get('/admin/users')
      this.users = data
    },
  },
})
