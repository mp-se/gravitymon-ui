import { defineStore } from 'pinia'
import { global } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

export const useStatusStore = defineStore('status', {
  state: () => {
    return {
      id: '',
      angle: 0,
      gravity: 0,
      gravity_format: '',
      temp: 0,
      temp_format: '',
      sleep_interval: 0,
      battery: 0,
      sleep_mode: false,
      rssi: 0,
      app_ver: '',
      app_build: '',
      mdns: '',
      platform: '',
      hardware: '',
      wifi_ssid: '',
      ip: '',
      runtime_average: 0,
      total_heap: 0,
      free_heap: 0,
      ispindel_config: false,
      self_check: {
        gyro_connected: true,
        gyro_calibration: true,
        temp_connected: true,
        gravity_formula: true,
        battery_level: true,
        push_targets: true
      },
      wifi_setup: false,
      connected: true
    }
  },
  getters: {},
  actions: {
    load(callback) {
      logInfo('statusStore.load()', 'Fetching /api/status')
      fetch(global.baseURL + 'api/status', {
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logDebug('statusStore.load()', json)
          this.id = json.id
          this.angle = json.angle
          this.temp_format = json.temp_format
          this.gravity = json.gravity
          this.gravity_format = json.gravity_format
          this.temp = json.temp
          this.sleep_mode = json.sleep_mode
          this.battery = json.battery
          this.rssi = json.rssi
          this.app_ver = json.app_ver
          this.app_build = json.app_build
          this.mdns = json.mdns
          this.platform = json.platform
          this.hardware = json.hardware
          this.wifi_ssid = json.wifi_ssid
          this.ip = json.ip
          this.runtime_average = json.runtime_average
          this.ispindel_config = json.ispindel_config
          this.self_check.gyro_connected = json.self_check.gyro_connected
          this.self_check.gyro_calibration = json.self_check.gyro_calibration
          this.self_check.temp_connected = json.self_check.temp_connected
          this.self_check.gravity_formula = json.self_check.gravity_formula
          this.self_check.battery_level = json.self_check.battery_level
          this.self_check.push_targets = json.self_check.push_targets
          this.total_heap = json.total_heap
          this.free_heap = json.free_heap
          this.wifi_setup = json.wifi_setup

          this.total_heap = Math.round(this.total_heap / 1024).toFixed(0)
          this.free_heap = Math.round(this.free_heap / 1024).toFixed(0)

          this.battery = (Math.round(this.battery * 100) / 100).toFixed(2)
          this.angle = (Math.round(this.angle * 100) / 100).toFixed(2)
          this.temp = (Math.round(this.temp * 100) / 100).toFixed(2) // C or F
          this.runtime_average = (Math.round(this.runtime_average * 100) / 100).toFixed(2)

          if (this.gravity_format === 'G')
            this.gravity = (Math.round(this.gravity * 10000) / 10000).toFixed(4)
          // SG
          else this.gravity = (Math.round(this.gravity * 100) / 100).toFixed(2) // Plato

          logInfo('statusStore.load()', 'Fetching /api/status completed')
          callback(true)
        })
        .catch((err) => {
          logError('statusStore.load()', err)
          callback(false)
        })
    },
    auth(callback) {
      logInfo('statusStore.auth()', 'Fetching /api/auth')
      var base = btoa('gravitymon:password')

      fetch(global.baseURL + 'api/auth', {
        method: 'GET',
        headers: { Authorization: 'Basic ' + base },
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logInfo('statusStore.auth()', 'Fetching /api/auth completed')
          callback(true, json)
        })
        .catch((err) => {
          logError('statusStore.auth()', err)
          callback(false)
        })
    },
    ping() {
      // logInfo("statusStore.ping()", "Fetching /api/ping")
      fetch(global.baseURL + 'api/ping', {
        method: 'GET',
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then(() => {
          // logInfo("statusStore.ping()", "Fetching /api/auth completed")
          this.connected = true
        })
        .catch((err) => {
          logError('statusStore.ping()', err)
          this.connected = false
        })
    },
    setSleepMode(val, callback) {
      logInfo('statusStore.setSleepMode()', 'Fetching /api/config/sleepmode')
      fetch(global.baseURL + 'api/sleepmode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: global.token
        },
        body: JSON.stringify({ sleep_mode: val }),
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logInfo('statusStore.setSleepMode()', 'Fetching /api/sleepmode completed', json)
          callback(true)
        })
        .catch((err) => {
          logError('statusStore.setSleepMode()', err)
          callback(false)
        })
    }
  }
})
