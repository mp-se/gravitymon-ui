import { defineStore } from 'pinia'
import { logInfo, logDebug, logError } from '@mp-se/espframework-ui-components'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      platform: '',

      board: '',
      app_ver: '',
      app_build: '',
      hardware: '',
      firmware_file: '',

      ui: {
        enableVoltageFragment: true,
        enableManualWifiEntry: true,
        enableScanForStrongestAp: true,
      },

      feature: {
        ble: false,
        velocity: false,
        filter: false,
        charging: false
      },

      initialized: false,
      disabled: false,
      configChanged: false,

      messageError: '',
      messageWarning: '',
      messageSuccess: '',
      messageInfo: ''
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
    uiVersion() {
      logDebug('globalStore.uiVersion()', import.meta.env.VITE_APP_VERSION)
      return import.meta.env.VITE_APP_VERSION
    },
    uiBuild() {
      logDebug('globalStore.uiBuild()', import.meta.env.VITE_APP_BUILD)
      return import.meta.env.VITE_APP_BUILD
    },
    isEsp8266() {
      return this.platform === 'ESP8266'
    },
    disabled32() {
      if (this.disabled) return true

      if (this.platform !== 'ESP8266') return false

      return true
    }
  },
  actions: {
    clearMessages() {
      this.messageError = ''
      this.messageWarning = ''
      this.messageSuccess = ''
      this.messageInfo = ''
    },
    async load() {
      try {
        logInfo('globalStore.load()', 'Fetching /api/feature')
        const json = await http.getJson('api/feature')
        logDebug('globalStore.load()', json)

        this.board = json.board.toUpperCase()
        this.app_ver = json.app_ver
        this.app_build = json.app_build
        this.platform = json.platform.toUpperCase()
        this.hardware = json.hardware.toUpperCase()
        this.firmware_file = json.firmware_file.toLowerCase()

        this.feature.ble = json.ble
        this.feature.velocity = json.velocity
        this.feature.filter = json.filter
        this.feature.charging = json.charging

        logInfo('globalStore.load()', 'Fetching /api/feature completed')
        return true
      } catch (err) {
        logError('globalStore.load()', err)
        return false
      }
    }
  }
})
