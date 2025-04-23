<template>
  <div class="container">
    <p></p>
    <p class="h3">Device - Hardware</p>
    <hr />

    <BsMessage v-if="!isGyroCalibrated()" dismissable="true" message="" alert="warning">
      You need to calibrate the gyro at 90 degrees
    </BsMessage>

    <BsMessage v-if="config.gyro_disabled" dismissable="true" message="" alert="warning">
      Gyro is disbled so the device will only be able to measure temperature
    </BsMessage>

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.voltage_factor"
            label="Voltage factor"
            min="0"
            max="6"
            step=".01"
            width="4"
            :unit="voltage"
            help="Factor used to calculate the battery voltage. Can vary depending on the R2 value (0 to 6)"
            :disabled="global.disabled"
          >
          </BsInputNumber>
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.voltage_config"
            unit="V"
            label="Voltage config"
            min="3"
            max="6"
            step=".01"
            width="4"
            help="Over this level the device will always go into configuration mode, some batteries might have a higher voltage when fully charged (3 to 6)"
            :disabled="global.disabled"
          ></BsInputNumber>
        </div>
        <div class="col-md-6">
          <BsInputSwitch
            v-model="config.storage_sleep"
            label="Storage sleep"
            help="If enabled and the device is placed on its cap (less than 5 degress) it will go into sleep for 2000 minutes"
            :disabled="global.disabled"
          ></BsInputSwitch>
        </div>
        <div class="col-md-6">
          <BsInputSwitch
            v-model="config.battery_saving"
            label="Battery saving"
            help="When active, the sleep interval will be changed to 1 hour when battery drops below 20% (3.73V)"
            :disabled="global.disabled"
          ></BsInputSwitch>
        </div>
        <template v-if="status.hardware == 'floaty'">
          <div class="col-md-12">
            <hr />
          </div>
          <div class="col-md-6">
            <BsInputRadio
              v-model="config.voltage_pin"
              :options="voltagePinFloatyOptions"
              label="Floaty Voltage PIN"
              help="Pin to be used for measuring voltage on floaty hardware"
              :disabled="global.disabled"
            ></BsInputRadio>
          </div>
        </template>
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-12">
          <BsInputRadio
            v-model="config.tempsensor_resolution"
            :options="tempsensorResolutionOptions"
            label="DS18B20 resolution"
            help="Resolution when reading the DS18B20 temperature sensor, higher resolution give better accuracy but takes longer to process and reduces battery life"
            :disabled="disableDs18b20"
          ></BsInputRadio>
        </div>
        <div class="col-md-4">
          <BsInputNumber
            v-model="config.temp_adjustment_value"
            :unit="'°' + config.temp_unit"
            label="Temperature sensor adjustment"
            min="-10"
            max="10"
            step=".01"
            width="4"
            help="This value will be added to the temperature sensor value to adjust the value (-10 to 10)"
            :disabled="global.disabled"
          ></BsInputNumber>
        </div>
        <div class="col-md-4">
          <BsInputSwitch
            v-model="config.gyro_temp"
            label="Gyro temperature"
            help="Use the temperature sensor in the gyro instead of DS18B20, require a minimum 300s update interval to be accurate or the heat from the chip will affect reading"
            :disabled="global.disabled || config.gyro_disabled"
          ></BsInputSwitch>
        </div>
        <div class="col-md-4">
          <BsInputSwitch
            v-model="config.gyro_disabled"
            label="Disable gyro"
            help="If active then the device works as a temperature sensor and ALL gyro functions are disabled"
            :disabled="global.disabled"
          ></BsInputSwitch>
        </div>
        <div class="col-md-4">
          <BsInputSwitch
            v-model="config.gyro_swap_xy"
            label="Swap X and Y axis"
            :disabled="global.disabled || config.gyro_disabled || status.gyro_family != 'ICM42670-p'"
            help="Normally the X asis is used for tilt but some boards have a different orientation"
          ></BsInputSwitch>
        </div>
        <div class="col-md-6">
          <BsInputReadonly
            v-model="calibrationValues"
            label="Gyro calibration"
            help="Shows the current gyro calibraton values"
            :disabled="global.disabled"
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
            :disabled="global.disabled || !status.self_check.gyro_connected"
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
import { ref, computed } from 'vue'
import { isGyroCalibrated, validateCurrentForm, restart } from '@/modules/utils'
import { global, config, status } from '@/modules/pinia'
import * as badge from '@/modules/badge'
import { logDebug, logError, logInfo } from '@/modules/logger'

// TODO: Show badge if problems with battery level

const tempsensorResolutionOptions = ref([
  { label: '0.5°C (93 ms)', value: 9 },
  { label: '0.25°C (187 ms)', value: 10 },
  { label: '0.125°C (375 ms)', value: 11 },
  { label: '0.0625°C (850 ms)', value: 12 }
])

const voltagePinFloatyOptions = ref([
  { label: 'PIN 32', value: 32 },
  { label: 'PIN 35', value: 35 }
])

const disableDs18b20 = computed(() => {
  return config.gyro_temp || global.disabled
})

const voltage = computed(() => {
  return status.battery + ' V'
})

const calibrationValues = computed(() => {
  return JSON.stringify(config.gyro_calibration_data)
})

const ispindel = () => {
  var data = {
    command: 'get',
    file: '/config.json'
  }

  config.sendFilesystemRequest(data, (success, text) => {
    if (success) {
      var json = JSON.parse(text)
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

const calibrate = () => {
  global.disabled = true
  logInfo('DeviceHardwareView.calibrate()', 'Sending /api/calibrate')
  fetch(global.baseURL + 'api/calibrate', {
    headers: { Authorization: global.token },
    signal: AbortSignal.timeout(global.fetchTimout)
  })
    .then((res) => {
      if (res.status != 200) {
        global.messageError = 'Failed to calibrate device'
      } else {
        setTimeout(() => {
          fetch(global.baseURL + 'api/calibrate/status', {
            headers: { Authorization: global.token },
            signal: AbortSignal.timeout(global.fetchTimout)
          })
            .then((res) => {
              logDebug('DeviceHardwareView.calibrate()', res)
              if (res.status != 200 || res.success == true) {
                global.messageError = 'Failed to get calibrate status'
              } else {
                config.load((success) => {
                  if (success) {
                    global.messageSuccess = 'Gyro calibrated'
                  } else {
                    global.messageError = 'Failed to load configuration'
                  }
                  global.disabled = false
                })
              }
            })
            .catch((err) => {
              global.messageError = 'Failed to get calibrate status'
              logError('DeviceHardwareView.calibrate()', err)
            })
        }, 4000)
      }
    })
    .catch((err) => {
      global.messageError = 'Failed to send calibrate request'
      logError('DeviceHardwareView.calibrate()', err)
    })
}

const save = () => {
  if (!validateCurrentForm()) return

  global.clearMessages()
  config.saveAll()
}
</script>
