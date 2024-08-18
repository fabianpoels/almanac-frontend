import api from '@/api'
import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

function parseUser(user) {
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
      const { data } = await api.get('/admin/users')
      this.users = data
    },
  },
})
