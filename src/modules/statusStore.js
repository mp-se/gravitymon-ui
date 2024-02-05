import { defineStore } from 'pinia'
import { global } from '@/modules/pinia'

export const useStatusStore = defineStore('status', {
    state: () => {
        return {
            id: "",
            angle: 0,
            gravity: 0,
            gravity_format: "",
            temp: 0,
            temp_format: "",
            sleep_interval: 0,
            battery: 0,
            sleep_mode: false,
            rssi: 0,
            app_ver: "",
            app_build: "",
            mdns: "",
            platform: "",
            hardware: "",
            wifi_ssid: "",
            ip: "",
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
                push_targets: true,
            },
            wifi_setup: false,          
        }
    },
    getters: {
    },
    actions: {
        load(callback) {
            console.log("Fetching /api/status")
            fetch(global.baseURL + 'api/status')
                .then(res => res.json())
                .then(json => {
                    console.log(json)

                    this.id = json.id,
                    this.angle = json.angle,
                    this.temp_format = json.temp_format,
                    this.gravity = json.gravity,
                    this.gravity_format = json.gravity_format,
                    this.temp = json.temp,
                    this.temp_format = json.temp_format,
                    this.sleep_mode = json.sleep_mode,
                    this.battery = json.battery,
                    this.rssi = json.rssi,
                    this.app_ver = json.app_ver,
                    this.app_build = json.app_build,
                    this.mdns = json.mdns,
                    this.platform = json.platform,
                    this.hardware = json.hardware,
                    this.wifi_ssid = json.wifi_ssid,
                    this.ip = json.ip,
                    this.runtime_average = json.runtime_average,
                    this.ispindel_config = json.ispindel_config,
                    this.self_check.gyro_connected = json.self_check.gyro_connected,
                    this.self_check.gyro_calibration = json.self_check.gyro_calibration,
                    this.self_check.temp_connected = json.self_check.temp_connected,
                    this.self_check.gravity_formula = json.self_check.gravity_formula,
                    this.self_check.battery_level = json.self_check.battery_level,
                    this.self_check.push_targets = json.self_check.push_targets,
                    this.total_heap = json.total_heap,
                    this.free_heap = json.free_heap,
                    this.wifi_setup = json.wifi_setup

                    this.total_heap = (Math.round(this.total_heap / 1024)).toFixed(0)
                    this.free_heap = (Math.round(this.free_heap / 1024)).toFixed(0)

                    this.battery = (Math.round(this.battery * 100) / 100).toFixed(2)
                    this.angle = (Math.round(this.angle * 100) / 100).toFixed(2)
                    this.temp = (Math.round(this.temp * 100) / 100).toFixed(2) // C or F
                    this.runtime_average = (Math.round(this.runtime_average * 100) / 100).toFixed(2)

                    if (this.gravity_format === 'G')
                        this.gravity = (Math.round(this.gravity * 10000) / 10000).toFixed(4) // SG
                    else
                        this.gravity = (Math.round(this.gravity * 100) / 100).toFixed(2) // Plato

                    console.log("Fetching /api/status completed")
                    callback(true)
                })
                .catch(err => {
                    console.log("Fetching /api/status failed")
                    console.log(err)
                    callback(false)
                })
        },
        auth(callback) {
            console.log("Fetching /api/auth")
            var base = btoa('gravitymon:password')

            fetch(global.baseURL + 'api/auth', {
                method: "GET",
                headers: { "Authorization": "Basic " + base }
            })
                .then(res => res.json())
                .then(json => {
                    console.log("Fetching /api/auth completed")
                    callback(true, json)
                })
                .catch(err => {
                    console.log("Fetching /api/auth failed")
                    console.log(err)
                    callback(false)
                })
        },
        setSleepMode(val, callback) {
            console.log("Fetching /api/config/sleepmode")
            fetch(global.baseURL + 'api/config/sleepmode', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify({ sleep_mode: val })
            })
                .then(res => res.json())
                .then(json => {
                    console.log("Fetching /api/config/sleepmode completed")
                    callback(true)
                })
                .catch(err => {
                    console.log("Fetching /api/config/sleepmode failed")
                    console.log(err)
                    callback(false)
                })
        }
    }
})