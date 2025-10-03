<template>
  <div class="container">
    <p></p>
    <p class="h3">Device - Gyro</p>
    <hr />

    <BsMessage
      v-if="!isGyroCalibrated() && config.gyro_type == 1"
      dismissable="true"
      message=""
      alert="warning"
    >
      You need to calibrate the gyro at 90 degrees
    </BsMessage>

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-12">
          <BsInputRadio
            v-model="config.gyro_type"
            :options="gyroOptions"
            label="Gyro options"
            help="Select the gyro type used for this board."
            :disabled="global.disabled"
          ></BsInputRadio>
        </div>

        <div class="col-md-12">
          <hr />
        </div>

        <div class="col-md-6">
          <BsInputSwitch
            v-model="config.gyro_filter"
            label="Filter gyro data"
            help="When active the gyro data will be filtered through a lowpass filter to remove noise ans spikes, applies to ESP32"
            :disabled="global.disabled || !global.feature.filter"
          ></BsInputSwitch>
        </div>
        <div class="col-md-6">
          <BsInputSwitch
            v-model="config.gyro_swap_xy"
            label="Swap X and Y axis"
            :disabled="global.disabled || config.gyro_type != 2"
            help="Normally the X asis is used for tilt but some boards have a different orientation and use Y axis instead, applies to ICM42670-p"
          ></BsInputSwitch>
        </div>
        <div class="col-md-6">
          <BsInputReadonly
            v-model="calibrationValues"
            label="Gyro calibration"
            help="Shows the current gyro calibraton values, applies to MPU-6050/6500"
          ></BsInputReadonly>
        </div>
      </div>
      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-12">
          <button
            type="submit"
            class="btn btn-primary w-2"
            :disabled="global.disabled || !global.configChanged"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Save</button
          >&nbsp;

          <button
            @click="restart()"
            type="button"
            class="btn btn-secondary"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Restart device</button
          >&nbsp;

          <button
            @click="calibrate"
            type="button"
            class="btn btn-secondary"
            :disabled="
              global.disabled ||
              !status.self_check.gyro_connected ||
              status.wifi_setup ||
              config.gyro_type == 2
            "
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Calibrate gyro&nbsp;<span
              v-if="badge.deviceGyroCalibratedBadge()"
              class="badge text-bg-danger rounded-circle"
              >1</span
            ></button
          >&nbsp;

          <template v-if="status.ispindel_config">
            <button
              @click="ispindel"
              type="button"
              class="btn btn-secondary"
              :disabled="global.disabled"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                :hidden="!global.disabled"
              ></span>
              &nbsp;Import iSpindel config&nbsp;<span
                v-if="badge.deviceMigrateIspindelBadge()"
                class="badge text-bg-danger rounded-circle"
                >1</span
              >
            </button>
          </template>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { isGyroCalibrated, validateCurrentForm, restart } from '@/modules/utils'
import { global, config, status } from '@/modules/pinia'
import * as badge from '@/modules/badge'
import { logDebug, logError, logInfo } from '@mp-se/espframework-ui-components'
import { storeToRefs } from 'pinia'

const gyroOptions = ref([
  // value 0 is used internally at startup to check if gyro has been defined.
  { label: 'MPU 6050/6500', value: 1 },
  { label: 'ICM42670-p', value: 2 }
])

const calibrationValues = computed(() => {
  if (config.gyro_type == 1) return JSON.stringify(config.gyro_calibration_data)

  return 'Calibration not needed for this gyro'
})

const { gyro_type } = storeToRefs(config)

watch(gyro_type, () => {
  if (config.gyro_type == 1) config.gyro_swap_xy = false
})

const ispindel = () => {
  const data = {
    command: 'get',
    file: '/config.json'
  }

  config.sendFilesystemRequest(data, (success, text) => {
    if (success) {
      const json = JSON.parse(text)
      logDebug('DeviceHardwareView.ispindel()', json)

      config.gyro_calibration_data.ax = json.Offset[0]
      config.gyro_calibration_data.ay = json.Offset[1]
      config.gyro_calibration_data.az = json.Offset[2]
      config.gyro_calibration_data.gx = json.Offset[3]
      config.gyro_calibration_data.gy = json.Offset[4]
      config.gyro_calibration_data.gz = json.Offset[5]

      config.gravity_formula = json.POLY

      global.messageSuccess =
        'Imported gyro calibration data and formula from old configuration. Please save!'
    }
    global.disabled = false
  })
}

const calibrate = async () => {
  global.disabled = true
  
  try {
    logInfo('DeviceHardwareView.calibrate()', 'Sending /api/calibrate')
    const response = await fetch(global.baseURL + 'api/calibrate', {
      headers: { Authorization: global.token },
      signal: AbortSignal.timeout(global.fetchTimeout)
    })
    
    if (response.status != 200) {
      global.messageError = 'Failed to calibrate device'
      return
    }
    
    // Wait for calibration to complete
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    const statusResponse = await fetch(global.baseURL + 'api/calibrate/status', {
      headers: { Authorization: global.token },
      signal: AbortSignal.timeout(global.fetchTimeout)
    })
    
    logDebug('DeviceHardwareView.calibrate()', statusResponse)
    if (statusResponse.status != 200 || statusResponse.success == true) {
      global.messageError = 'Failed to get calibrate status'
      return
    }
    
    // Reload configuration after calibration
    const configLoaded = await new Promise((resolve) => {
      config.load(resolve)
    })
    
    if (configLoaded) {
      global.messageSuccess = 'Gyro calibrated'
    } else {
      global.messageError = 'Failed to load configuration'
    }
    
  } catch (err) {
    logError('DeviceHardwareView.calibrate()', err)
    if (err.name === 'TimeoutError') {
      global.messageError = 'Calibration request timed out'
    } else {
      global.messageError = 'Failed to calibrate device'
    }
  } finally {
    global.disabled = false
  }
}

const save = async () => {
  if (!validateCurrentForm()) return

  global.clearMessages()
  await config.saveAll()
}
</script>
