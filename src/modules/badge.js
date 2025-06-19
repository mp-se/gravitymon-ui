import { config, status } from '@/modules/pinia'
import { isGyroCalibrated } from '@/modules/utils'

/**
 * Used in menybar to show the total amount of items that require user action.
 *
 * @returns number of items that needs attention
 */
export function deviceBadge() {
  return deviceSettingBadge() + deviceHardwareBadge() + deviceGyroBadge() + deviceWifiBadge()
}

export function deviceSettingBadge() {
  return deviceMdnsBadge()
}

export function deviceMdnsBadge() {
  return config.mdns === '' ? 1 : 0
}

export function deviceHardwareBadge() {
  return 0
}

export function deviceGyroBadge() {
  return deviceGyroCalibratedBadge() + deviceMigrateIspindelBadge()
}

export function deviceMigrateIspindelBadge() {
  return status.ispindel_config ? 1 : 0
}

export function deviceGyroCalibratedBadge() {
  if (!status.needsCalibration) return 0

  return isGyroCalibrated() ? 0 : 1
}

export function deviceWifiBadge() {
  return deviceWifi1Badge() | deviceWifi2Badge() ? 1 : 0
}

export function deviceWifi1Badge() {
  if (config.wifi_ssid === '') return 1
  return 0
}

export function deviceWifi2Badge() {
  if (config.wifi_ssid2 === '' && config.wifi_ssid === '') return 1
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
  if (config.gravity_formula === '') return 1
  return 0
}

/**
 * Used in menybar to show the total amount of items that require user action.
 *
 * @returns number of items that needs attention
 */
export function pushBadge() {
  return (
    pushSettingBadge() +
    pushHttpPost1Badge() +
    pushHttpPost2Badge() +
    pushHttpGetBadge() +
    pushInfluxdb2Badge() +
    pushMqttBadge() +
    pushBluetoothBadge()
  )
}

function pushTargetCount() {
  var cnt = 0
  cnt += config.http_post_target === '' ? 0 : 1
  cnt += config.http_post2_target === '' ? 0 : 1
  cnt += config.http_get_target === '' ? 0 : 1
  cnt += config.influxdb2_target === '' ? 0 : 1
  cnt += config.mqtt_target === '' ? 0 : 1
  cnt += config.ble_format === 0 ? 0 : 1
  cnt += config.use_wifi_direct ? 1 : 0
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

export function pushInfluxdb2Badge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function pushMqttBadge() {
  return pushTargetCount() === 0 ? 1 : 0
}

export function pushBluetoothBadge() {
  return pushTargetCount() === 0 ? 1 : 0
}
