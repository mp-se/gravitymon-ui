import { defineStore } from 'pinia'
import { global } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

export const useStatusStore = defineStore('status', {
  state: () => {
    return {
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
      board: '',
      app_ver: '',
      app_build: '',
      mdns: '',
      platform: '',
      hardware: '',
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
    }
  },
  getters: {
    needsCalibration() {
      return this.gyro_family == 'MPU6050' || this.gyro_family == 'MPU6500' ? true : false
    },
    allowGyroSwapXY() {
      return this.gyro_family != 'MPU6050' && this.gyro_family != 'MPU6500' ? true : false
    }
  },
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
          this.temp_unit = json.temp_unit
          this.gravity = json.gravity
          this.gravity_unit = json.gravity_unit
          this.temp = json.temp
          this.sleep_mode = json.sleep_mode
          this.battery = json.battery
          this.rssi = json.rssi
          this.board = json.board
          this.app_ver = json.app_ver
          this.app_build = json.app_build
          this.mdns = json.mdns
          this.platform = json.platform.toUpperCase()
          this.hardware = json.hardware
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
          this.gyro_family = json.gyro_family
          this.total_heap = json.total_heap
          this.free_heap = json.free_heap
          this.wifi_setup = json.wifi_setup

          this.total_heap = Math.round(this.total_heap / 1024).toFixed(0)
          this.free_heap = Math.round(this.free_heap / 1024).toFixed(0)

          this.battery = (Math.round(this.battery * 100) / 100).toFixed(2)
          this.angle = (Math.round(this.angle * 100) / 100).toFixed(2)
          this.temp = (Math.round(this.temp * 100) / 100).toFixed(2) // C or F

          if (this.gravity_unit === 'G')
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
    },
    getGyro(callback) {
      logInfo('statusStore.getGyro()', 'Fetching /api/gyro')
      fetch(global.baseURL + 'api/gyro', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logInfo('statusStore.getGyro()', 'Fetching /api/gyro completed', json)
          callback(true, json)
        })
        .catch((err) => {
          logError('statusStore.getGyro()', err)
          callback(false)
        })
    }
  }
})
