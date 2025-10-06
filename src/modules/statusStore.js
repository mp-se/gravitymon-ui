import { defineStore } from 'pinia'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components/src/modules/httpClient'
import { logDebug, logError, logInfo } from '@mp-se/espframework-ui-components'

// Removed the previous http client instantiation

export const useStatusStore = defineStore('status', {
  state: () => ({
    id: '',
    angle: 0,
    gravity: 0,
    gravity_unit: '',
    temp: 0,
    temp_unit: '',
    sleep_interval: 0,
    battery: 0,
    sleep_mode: false,
    rssi: 0,
    mdns: '',
    wifi_ssid: '',
    ip: '',
    total_heap: 0,
    free_heap: 0,
    ispindel_config: false,
    self_check: {
      gyro_connected: true,
      gyro_moving: true,
      gyro_calibration: true,
      temp_connected: true,
      gravity_formula: true,
      battery_level: true,
      push_targets: true
    },
    ble_supported: true,
    gyro_family: '',
    wifi_setup: false,
    connected: true
  }),
  actions: {
    // Helper to update store state from API JSON
    updateFromJson(json) {
      logDebug('statusStore.updateFromJson()', json)
      this.id = json.id
      this.angle = json.angle
      this.temp_unit = json.temp_unit
      this.gravity = json.gravity
      this.gravity_unit = json.gravity_unit
      this.temp = json.temp
      this.sleep_mode = json.sleep_mode
      this.battery = json.battery
      this.rssi = json.rssi
      this.mdns = json.mdns
      this.wifi_ssid = json.wifi_ssid
      this.ip = json.ip
      this.ispindel_config = json.ispindel_config
      this.self_check.gyro_connected = json.self_check.gyro_connected
      this.self_check.gyro_moving = json.self_check.gyro_moving
      this.self_check.gyro_calibration = json.self_check.gyro_calibration
      this.self_check.temp_connected = json.self_check.temp_connected
      this.self_check.gravity_formula = json.self_check.gravity_formula
      this.self_check.battery_level = json.self_check.battery_level
      this.self_check.push_targets = json.self_check.push_targets
      this.ble_supported = json.ble_supported
      this.gyro_family = json.gyro_family ? json.gyro_family.toUpperCase() : ''
      this.total_heap = json.total_heap
      this.free_heap = json.free_heap
      this.wifi_setup = json.wifi_setup

      this.total_heap = Math.round(this.total_heap / 1024).toFixed(0)
      this.free_heap = Math.round(this.free_heap / 1024).toFixed(0)

      this.battery = (Math.round(this.battery * 100) / 100).toFixed(2)
      this.angle = (Math.round(this.angle * 100) / 100).toFixed(2)
      this.temp = (Math.round(this.temp * 100) / 100).toFixed(2)

      if (this.gravity_unit === 'G')
        this.gravity = (Math.round(this.gravity * 10000) / 10000).toFixed(4)
      else this.gravity = (Math.round(this.gravity * 100) / 100).toFixed(2)
    },

    async load() {
      try {
        logInfo('statusStore.load()', 'Fetching /api/status')
        const json = await http.getJson('api/status')
        this.updateFromJson(json)
        logInfo('statusStore.load()', 'Fetching /api/status completed')
        return true
      } catch (err) {
        logError('statusStore.load()', err)
        return false
      }
    },

    async getGyro() {
      try {
        logInfo('statusStore.getGyro()', 'Fetching /api/gyro')
        const json = await http.getJson('api/gyro')
        logInfo('statusStore.getGyro()', 'Fetching /api/gyro completed', json)
        return { success: true, data: json }
      } catch (err) {
        logError('statusStore.getGyro()', err)
        return { success: false, error: err }
      }
    }
  }
})
