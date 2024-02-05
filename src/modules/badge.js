import { config, status } from '@/modules/pinia'
import { isGyroCalibrated } from '@/modules/utils'

/**
 * Used in menybar to show the total amount of items that require user action.
 * 
 * @returns number of items that needs attention
 */
export function deviceBadge() {
  return deviceSettingBadge() + deviceHardwareBadge() + deviceWifiBadge()
}

export function deviceSettingBadge() {
  return deviceMdnsBadge()
}

export function deviceMdnsBadge() {
  return config.mdns === "" ? 1 : 0
}

export function deviceHardwareBadge() {
  return deviceGyroCalibratedBadge() + deviceMigrateIspindelBadge()
}

export function deviceMigrateIspindelBadge() {
  return status.ispindel_config ? 1 : 0
}

export function deviceGyroCalibratedBadge() {
  return isGyroCalibrated() ? 0 : 1
}

export function deviceWifiBadge() {
  return deviceWifi1Badge() | deviceWifi2Badge() ? 1 : 0
}

export function deviceWifi1Badge() {
  if (config.wifi_ssid === '')
      return 1
  return 0
}

export function deviceWifi2Badge() {
  if (config.wifi_ssid2 === '' && config.wifi_ssid === '')
      return 1
  return 0
}

/**
 * Used in menybar to show the total amount of items that require user action.
 * 
 * @returns number of items that needs attention
 */
export function gravityBadge() {
  return gravitySettingBadge() + gravityFormulaBadge()
}

export function gravitySettingBadge() {
  return 0
}

export function gravityFormulaBadge() {
  if (config.gravity_formula === '')
      return 1
  return 0
}

/**
 * Used in menybar to show the total amount of items that require user action.
 * 
 * @returns number of items that needs attention
 */
export function pushBadge() {
  return pushSettingBadge() + pushHttpPost1Badge() + pushHttpPost2Badge() + pushHttpGetBadge() + pushHttpInfluxdb2Badge() + pushHttpMqttBadge() + pushHttpBluetoothBadge()
}

function pushTargetCount() {
  var cnt = 0
  cnt += config.http_push === '' ? 0 : 1
  cnt += config.http_push2 === '' ? 0 : 1
  cnt += config.http_push3 === '' ? 0 : 1
  cnt += config.influxdb2_push === '' ? 0 : 1
  cnt += config.mqtt_push === '' ? 0 : 1
  cnt += config.ble_format === 0 ? 0 : 1
  return cnt
}

export function pushSettingBadge() {
  return 0
}

export function pushHttpPost1Badge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function pushHttpPost2Badge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function pushHttpGetBadge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function pushHttpInfluxdb2Badge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function pushHttpMqttBadge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function pushHttpBluetoothBadge() {
  return pushTargetCount() === 0 ? 1 : 0
}
