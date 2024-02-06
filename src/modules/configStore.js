import { defineStore } from 'pinia'
import { global, saveConfigState, getConfigChanges } from '@/modules/pinia'
import { getErrorString } from '@/modules/utils'

// TODO: Add option to do NTP sync (will add a few seconds)

export const useConfigStore = defineStore('config', {
    state: () => {
        return {
            // Device
            id: "",
            mdns: "",
            temp_format: "",
            gravity_format: "",
            // Hardware
            ota_url: "",
            storage_sleep: false,
            voltage_factor: 0,
            voltage_config: 0,
            gyro_temp: false,
            battery_saving: false,
            tempsensor_resolution: 0,
            temp_adjustment_value: 0,
            // Wifi
            wifi_portal_timeout: 0,
            wifi_connect_timeout: 0,
            wifi_ssid: "",
            wifi_ssid2: "",
            wifi_pass: "",
            wifi_pass2: "",
            // Push - Generic
            token: "",
            token2: "",
            sleep_interval: 0,
            push_timeout: 0,
            skip_ssl_on_test: false,
            // Push - Http Post 1
            http_push: "",
            http_push_h1: "",
            http_push_h2: "",
            http_int: 0,
            http_format: "",
            // Push - Http Post 2
            http_push2: "",
            http_push2_h1: "",
            http_push2_h2: "",
            http_int2: "",
            http_format2: "",
            // Push - Http Get
            http_push3: "",
            http_push3_h1: "",
            http_push3_h2: "",
            http_int3: 0,
            http_format3: "",
            // Push - Influx
            influxdb2_push: "",
            influxdb2_org: "",
            influxdb2_bucket: "",
            influxdb2_auth: "",
            influxdb2_int: 0,
            influxdb2_format: "",
            // Push - MQTT
            mqtt_push: "",
            mqtt_port: "",
            mqtt_user: "",
            mqtt_pass: "",
            mqtt_int: 0,
            mqtt_format: "",
            // Push BLE
            ble_tilt_color: "",
            ble_format: 0,
            // Gravity formula
            gravity_formula: "",
            gravity_temp_adjustment: false,
            formula_calculation_data: [],
            gyro_read_count: 0,
            gyro_moving_threashold: 0,
            formula_max_deviation: 0,
            formula_calibration_temp: 0,
            ignore_low_angles: false,
            gyro_calibration_data: [],
            dark_mode: false
        }
    },
    actions: {
        load(callback) {
            global.disabled = true
            fetch(global.baseURL + 'api/config', {
                method: "GET",
                headers: { "Authorization": global.token }
            })
                .then(res => res.json())
                .then(json => {
                    global.disabled = false
                    this.id = json.id,
                        // Device
                        this.mdns = json.mdns,
                        this.temp_format = json.temp_format,
                        this.gravity_format = json.gravity_format,
                        // Hardware
                        this.ota_url = json.ota_url,
                        this.storage_sleep = json.storage_sleep,
                        this.voltage_factor = json.voltage_factor,
                        this.voltage_config = json.voltage_config,
                        this.gyro_temp = json.gyro_temp,
                        this.battery_saving = json.battery_saving,
                        this.tempsensor_resolution = json.tempsensor_resolution,
                        this.temp_adjustment_value = json.temp_adjustment_value,
                        // Wifi
                        this.wifi_portal_timeout = json.wifi_portal_timeout,
                        this.wifi_connect_timeout = json.wifi_connect_timeout,
                        this.wifi_ssid = json.wifi_ssid,
                        this.wifi_ssid2 = json.wifi_ssid2,
                        this.wifi_pass = json.wifi_pass,
                        this.wifi_pass2 = json.wifi_pass2,
                        // Push - Generic
                        this.token = json.token,
                        this.token2 = json.token2,
                        this.sleep_interval = json.sleep_interval,
                        this.push_timeout = json.push_timeout,
                        this.skip_ssl_on_test = json.skip_ssl_on_test,
                        // Push - Http Post 1
                        this.http_push = json.http_push,
                        this.http_push_h1 = json.http_push_h1,
                        this.http_push_h2 = json.http_push_h2,
                        this.http_int = json.http_int,
                        this.http_format = json.http_format,
                        // Push - Http Post 2
                        this.http_push2 = json.http_push2,
                        this.http_push2_h1 = json.http_push2_h1,
                        this.http_push2_h2 = json.http_push2_h2,
                        this.http_int2 = json.http_int2,
                        this.http_format2 = json.http_format2,
                        // Push - Http Get
                        this.http_push3 = json.http_push3,
                        this.http_push3_h1 = json.http_push3_h1,
                        this.http_push3_h2 = json.http_push3_h2,
                        this.http_int3 = json.http_int3,
                        this.http_format3 = json.http_format3,
                        // Push - Influx
                        this.influxdb2_push = json.influxdb2_push,
                        this.influxdb2_org = json.influxdb2_org,
                        this.influxdb2_bucket = json.influxdb2_bucket,
                        this.influxdb2_auth = json.influxdb2_auth,
                        this.influxdb2_int = json.influxdb2_int,
                        this.influxdb2_format = json.influxdb2_format,
                        // Push - MQTT
                        this.mqtt_push = json.mqtt_push,
                        this.mqtt_port = json.mqtt_port,
                        this.mqtt_user = json.mqtt_user,
                        this.mqtt_pass = json.mqtt_pass,
                        this.mqtt_int = json.mqtt_int,
                        this.mqtt_format = json.mqtt_format,
                        // Push BLE
                        this.ble_tilt_color = json.ble_tilt_color,
                        this.ble_format = json.ble_format,
                        // Gravity formula
                        this.gravity_formula = json.gravity_formula,
                        this.gravity_temp_adjustment = json.gravity_temp_adjustment,
                        this.gyro_read_count = json.gyro_read_count,
                        this.gyro_moving_threashold = json.gyro_moving_threashold,
                        this.formula_max_deviation = json.formula_max_deviation,
                        this.formula_calibration_temp = json.formula_calibration_temp,
                        this.ignore_low_angles = json.ignore_low_angles,
                        this.formula_calculation_data = json.formula_calculation_data,
                        this.gyro_calibration_data = json.gyro_calibration_data,
                        this.dark_mode = json.dark_mode,
                        callback(true)
                })
                .catch(err => {
                    global.disabled = false
                    console.log(err)
                    callback(false)
                })
        },
        loadFormat(callback) {
            global.disabled = true
            console.log("Fetching /api/config/format")
            fetch(global.baseURL + 'api/config/format', {
                method: "GET",
                headers: { "Authorization": global.token }
            })
                .then(res => res.json())
                .then(json => {
                    global.disabled = false
                    this.http_format = decodeURIComponent(json.http_format)
                    this.http_format2 = decodeURIComponent(json.http_format2)
                    this.http_format3 = decodeURIComponent(json.http_format3)
                    this.influxdb2_format = decodeURIComponent(json.influxdb2_format)
                    this.mqtt_format = decodeURIComponent(json.mqtt_format)
                    console.log("Fetching /api/config/format completed")
                    callback(true)
                })
                .catch(err => {
                    global.disabled = false
                    console.log("Fetching /api/config/format failed")
                    console.log(err)
                    callback(false)
                })
        },
        sendConfig(callback) {
            global.disabled = true
            console.log("Sending /api/config")

            var data = getConfigChanges()
            delete data.http_format
            delete data.http_format2
            delete data.http_format3
            delete data.influxdb2_format
            delete data.mqtt_format
            console.log(data)

            if (JSON.stringify(data).length == 2) {
                console.log("No config data to store, skipping step")
                callback(true)
                return
            }

            fetch(global.baseURL + 'api/config', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
            })
                .then(res => {
                    global.disabled = false
                    if (res.status != 200) {
                        console.log("Sending /api/config failed", res.status)
                        callback(false)
                    }
                    else {
                        console.log("Sending /api/config completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    console.log("Sending /api/config failed")
                    console.log(err)
                    callback(false)
                    global.disabled = false
                })
        },
        sendFormat(callback) {
            global.disabled = true
            console.log("Sending /api/config/format")

            var data2 = getConfigChanges()
            var data = {}
            var cnt = 0

            console.log(data)

            data = data2.http_format !== undefined ? { http_format: encodeURIComponent(data2.http_format) } : {}
            this.sendOneFormat(data, (success) => {
                if(success) cnt += 1
                data = data2.http_format2 !== undefined ? { http_format2: encodeURIComponent(data2.http_format2) } : {}
                this.sendOneFormat(data, (success) => {
                    if(success) cnt += 1
                    data = data2.http_format3 !== undefined ? { http_format3: encodeURIComponent(data2.http_format3) } : {}
                    this.sendOneFormat(data, (success) => {
                        if(success) cnt += 1
                        data = data2.influxdb2_format !== undefined ? { influxdb2_format: encodeURIComponent(data2.influxdb2_format) } : {}
                        this.sendOneFormat(data, (success) => {
                            if(success) cnt += 1
                            data = data2.mqtt_format !== undefined ? { mqtt_formatqtt_format: encodeURIComponent(data2.mqtt_format) } : {}
                            this.sendOneFormat(data, (success) => {
                                if(success) cnt += 1

                                if(cnt == 5)
                                    callback(true)
                                else 
                                    callback(false)
                            })
                        })
                    })
                })
            })
        },
        sendOneFormat(data, callback) {
            console.log("Sending /api/config/format")

            if (JSON.stringify(data).length == 2) {
                console.log("No format data to store, skipping step")
                callback(true)
                return
            }

            fetch(global.baseURL + 'api/config/format', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
            })
                .then(res => {
                    global.disabled = false
                    if (res.status != 200) {
                        console.log("Sending /api/config/format failed")
                        callback(false)
                    } else {
                        console.log("Sending /api/config/format completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    console.log("Sending /api/config/format failed")
                    console.log(err)
                    callback(false)
                })
        },
        sendPushTest(data, callback) {
            global.disabled = true
            console.log("Sending /api/test/push")
            fetch(global.baseURL + 'api/test/push', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
            })
                .then(res => {
                    if (res.status != 200) {
                        console.log("Sending /api/test/push failed")
                        callback(false)
                    } else {
                        console.log("Sending /api/test/push completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    console.log("Sending /api/test/push failed")
                    console.log(err)
                    callback(false)
                })
        },
        getPushTestStatus(callback) {
            console.log("Fetching /api/test/push/status")
            fetch(global.baseURL + 'api/test/push/status')
                .then(res => res.json())
                .then(json => {
                    console.log(json)
                    console.log("Fetching /api/test/push/status completed")
                    callback(true, json)
                })
                .catch(err => {
                    console.log("Fetching /api/test/push/status failed")
                    console.log(err)
                    callback(false, null)
                })
        },
        sendWifiScan(callback) {
            global.disabled = true
            console.log("Sending /api/wifi/scan")
            fetch(global.baseURL + 'api/wifi/scan', {
                headers: { "Authorization": global.token }
            })
                .then(res => {
                    if (res.status != 200) {
                        console.log("Sending /api/wifi/scan failed")
                        callback(false)
                    } else {
                        console.log("Sending /api/wifi/scan completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    console.log("Sending /api/wifi/scan failed")
                    console.log(err)
                    callback(false)
                })
        },
        getWifiScanStatus(callback) {
            console.log("Fetching /api/wifi/scan/status")
            fetch(global.baseURL + 'api/wifi/scan/status', { method: "GET", headers: { "Authorization": global.token } })
                .then(res => res.json())
                .then(json => {
                    console.log(json)
                    console.log("Fetching /api/wifi/scan/status completed")
                    callback(true, json)
                })
                .catch(err => {
                    console.log("Fetching /api/wifi/scan/status failed")
                    console.log(err)
                    callback(false, null)
                })
        },
        saveAll() {
            global.clearMessages()
            global.disabled = true
            this.sendConfig((success) => {
                if (!success) {
                    global.disabled = false
                    global.messageError = "Failed to store configuration to device"
                } else {
                    this.sendFormat((success) => {
                        global.disabled = false
                        if (!success) {
                            global.messageError = "Failed to store format to device"
                        } else {
                            global.messageSuccess = "Configuration has been saved to device"
                            saveConfigState()
                        }
                    })
                }
            })
        },
        sendFilesystemRequest(data, callback) {
            global.disabled = true
            console.log("Sending /api/filesystem")
            fetch(global.baseURL + 'api/filesystem', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
            })
                .then(res => res.text())
                .then(text => {
                    console.log(text)
                    callback(true, text)
                })
                .catch(err => {
                    console.log("Sending /api/filesystem failed")
                    console.log(err)
                    callback(false)
                })
        },
        runPushTest(data, callback) {
            global.disabled = true
            this.sendPushTest(data, (success) => {
                if (success) {
                    var check = setInterval(() => {
                        this.getPushTestStatus((success, data) => {
                            if (success) {
                                if (data.status) {
                                    // test is still running, just wait for next check
                                } else {
                                    global.disabled = false
                                    if (!data.enabled) {
                                        global.messageWarning = "No endpoint is defined for this target. Cannot run test."
                                    } else if (!data.success) {
                                        global.messageError = "Test failed with error code " + getErrorString(data.last_error)
                                    } else {
                                        global.messageSuccess = "Test was successful"
                                    }

                                    callback(true)
                                    clearInterval(check)
                                }
                            } else {
                                global.disabled = false
                                global.messageError = "Failed to get push test status"
                                callback(false)
                                clearInterval(check)
                            }
                        })
                    }, 2000)
                } else {
                    global.messageError = "Failed to start push test"
                    global.disabled = false
                    callback(false)
                }
            })
        },
        runWifiScan(callback) {
            global.disabled = true
            this.sendWifiScan((success) => {
                if (success) {
                    var check = setInterval(() => {
                        this.getWifiScanStatus((success, data) => {
                            if (success) {
                                if (data.status) {
                                    // test is still running, just wait for next check
                                } else {
                                    global.disabled = false
                                    callback(data.success, data)
                                    clearInterval(check)
                                }
                            } else {
                                global.disabled = false
                                global.messageError = "Failed to get wifi scan status"
                                callback(false)
                                clearInterval(check)
                            }
                        })
                    }, 2000)
                } else {
                    global.disabled = false
                    global.messageError = "Failed to start push test"
                    callback(false)
                }
            })
        }
    },
})