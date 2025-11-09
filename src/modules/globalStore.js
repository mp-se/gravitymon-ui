import { defineStore } from 'pinia'
import { logInfo, logDebug, logError } from '@mp-se/espframework-ui-components'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      platform: '',

      chip_id: '',
      board: '',
      app_ver: '',
      app_build: '',
      hardware: '',
      firmware_file: '',
      registered: true,

      ui: {
        enableVoltageFragment: true,
        enableManualWifiEntry: true,
        enableScanForStrongestAp: true,
        enableRegistration: false
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
    registerApiKey() {
      // eslint-disable-next-line no-undef
      const encodedKey = __REGISTER_API_KEY__
      if (!encodedKey) {
        logError('globalStore.registerApiKey()', 'Encoded API key not defined')
        return null
      }
      const key = atob(encodedKey)
      logDebug('globalStore.registerApiKey()', 'Key decoded (length: ' + key.length + ')')
      return key
    },
    registerBaseUrl() {
      // eslint-disable-next-line no-undef
      const encodedUrl = __REGISTER_BASE_URL__
      if (!encodedUrl) {
        logError('globalStore.registerBaseUrl()', 'Encoded base URL not defined')
        return null
      }
      const url = atob(encodedUrl)
      logDebug('globalStore.registerBaseUrl()', 'URL decoded (length: ' + url.length + ')')
      return url
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
    // Helper function to anonymize chip_id using SHA-256 hash
    async anonymizeChipId() {
      if (!this.chip_id || this.chip_id === 'unknown') return 'unknown'

      try {
        const encoder = new TextEncoder()
        const data = encoder.encode(this.chip_id)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
        return hashHex
      } catch (error) {
        logError('globalStore.anonymizeChipId()', 'Failed to anonymize chip_id:', error)
        return 'unknown'
      }
    },
    async load() {
      try {
        logInfo('globalStore.load()', 'Fetching /api/feature')
        const json = await http.getJson('api/feature')
        logDebug('globalStore.load()', json)

        this.chip_id = json.chip_id.toLowerCase()
        this.board = json.board.toUpperCase()
        this.app_ver = json.app_ver
        this.app_build = json.app_build
        this.platform = json.platform.toUpperCase()
        this.hardware = json.hardware.toUpperCase()
        this.firmware_file = json.firmware_file.toLowerCase()
        this.registered = json.registered

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
