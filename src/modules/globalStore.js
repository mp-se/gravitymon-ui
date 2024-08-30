import { defineStore } from 'pinia'
import { logInfo, logDebug } from '@/modules/logger'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      id: '',
      platform: '',
      initialized: false,
      disabled: false,
      configChanged: false,

      messageError: '',
      messageWarning: '',
      messageSuccess: '',
      messageInfo: '',

      fetchTimout: 8000
    }
  },
  getters: {
    isError() {
      return this.messageError != '' ? true : false
    },
    isWarning() {
      return this.messageWarning != '' ? true : false
    },
    isSuccess() {
      return this.messageSuccess != '' ? true : false
    },
    isInfo() {
      return this.messageInfo != '' ? true : false
    },
    token() {
      return 'Bearer ' + this.id
    },
    baseURL() {
      logDebug('globalStore.baseURL()', import.meta.env.VITE_APP_HOST)
      if (import.meta.env.VITE_APP_HOST === undefined) return window.location.href

      logInfo('globalStore.baseURL()', 'Using base URL from env', import.meta.env.VITE_APP_HOST)
      return import.meta.env.VITE_APP_HOST
    },
    uiVersion() {
      logDebug('globalStore.uiVersion()', import.meta.env.VITE_APP_VERSION)
      return import.meta.env.VITE_APP_VERSION
    },
    uiBuild() {
      logDebug('globalStore.uiBuild()', import.meta.env.VITE_APP_BUILD)
      return import.meta.env.VITE_APP_BUILD
    },
    disabled32() {
      if (this.disabled) return true

      if (this.platform !== 'esp8266') return false

      return true
    }
  },
  actions: {
    clearMessages() {
      this.messageError = ''
      this.messageWarning = ''
      this.messageSuccess = ''
      this.messageInfo = ''
    }
  }
})
