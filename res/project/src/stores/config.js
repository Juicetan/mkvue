import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    HOST: '',
    res: {}
  }),
  getters: {},
  actions: {}
})