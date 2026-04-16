<!--
  GravityMon
  Copyright (c) 2021-2026 Magnus

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Alternatively, this software may be used under the terms of a
  commercial license. See LICENSE_COMMERCIAL for details.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - MQTT</p>
    <hr />

    <form
      @submit.prevent="save"
      class="needs-validation"
      novalidate
      :disabled="config.use_wifi_direct"
    >
      <div class="row">
        <div class="col-md-9">
          <BsInputText
            v-model="config.mqtt_target"
            maxlength="120"
            label="Server"
            help="Name of server to connect to, use format servername.com"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-3">
          <BsInputNumber
            v-model="config.mqtt_port"
            label="Port"
            min="0"
            max="65535"
            help="Port number, 1883 is standard. Ports above 8000 means SSL"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.mqtt_user"
            maxlength="20"
            label="User name"
            help="Username to use. Leave blank if authentication is disabled"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.mqtt_pass"
            type="password"
            maxlength="20"
            label="Password"
            help="Password to use. Leave blank if authentication is disabled"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.mqtt_int"
            label="Skip interval"
            min="0"
            max="5"
            width="4"
            help="Defines how many sleep cycles to skip between pushing data to this target, 1 = every second cycle. Default is 0."
            :disabled="pushDisabled"
          />
        </div>
        <!-- 
        <div class="col-md-6">
          <BsInputSwitch
            v-model="config.mqtt_retain"
            label="Set MQTT retain flag"
            width="4"
            help="Set the retain flag for messages sent to MQTT."
            :disabled="pushDisabled"
          />
        </div>-->
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.mqtt_format_gravity"
            rows="6"
            label="Data format"
            help="Format template used to create the data sent to the remote service"
            :disabled="pushDisabled"
            v-if="global.ui.enableGravity"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="gravityMqttFormatOptions"
            :callback="gravityMqttFormatCallback"
            :disabled="pushDisabled"
            v-if="global.ui.enableGravity"
          />
          <BsModal
            @click="gravityRenderFormat"
            v-model="gravityRender"
            :code="true"
            :json="true"
            :mqtt="true"
            title="Format preview"
            button="Preview format"
            :disabled="pushDisabled"
            v-if="global.ui.enableGravity"
          />
        </div>
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.mqtt_format_pressure"
            rows="6"
            label="Data format (Pressure)"
            help="Format template used to create the data sent to the remote service"
            :disabled="pushDisabled"
            v-if="global.ui.enablePressure"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="pressureMqttFormatOptions"
            :callback="pressureMqttFormatCallback"
            :disabled="pushDisabled"
            v-if="global.ui.enablePressure"
          />
          <BsModal
            @click="pressureRenderFormat"
            v-model="pressureRender"
            :code="true"
            :json="true"
            :mqtt="true"
            title="Format preview"
            button="Preview format"
            :disabled="pushDisabled"
            v-if="global.ui.enablePressure"
          />
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
              v-show="global.disabled"
            ></span>
            &nbsp;Save</button
          >&nbsp;

          <button
            v-if="global.ui.enableGravity"
            @click="runTestGravity"
            type="button"
            class="btn btn-secondary"
            :disabled="pushDisabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Run push gravity test</button
          >&nbsp;
          <button
            v-if="global.ui.enablePressure"
            @click="runTestPressure"
            type="button"
            class="btn btn-secondary"
            :disabled="pushDisabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Run push pressure test
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { gravityMqttFormatOptions } from '@/modules/gravityFormatOptions'
import { pressureMqttFormatOptions } from '@/modules/pressureFormatOptions'
import { applyTemplate } from '@/modules/formatTemplate'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { global, status, config } from '@/modules/pinia'
import { logError } from '@mp-se/espframework-ui-components'

const gravityRender = ref('')
const pressureRender = ref('')

watch(
  () => config.mqtt_format_gravity,
  () => {
    if (global.isEsp8266) {
      const s = applyTemplate(status, config, config.mqtt_format_gravity)
      if (s.length > 500)
        global.messageWarning =
          'On an ESP8266 a large payload will likley cause a crash due to RAM limitations on device. Reduce your template.'
      else global.messageWarning = ''
    }
  }
)

watch(
  () => config.mqtt_format_pressure,
  () => {
    if (global.isEsp8266) {
      const s = applyTemplate(status, config, config.mqtt_format_pressure)
      if (s.length > 500)
        global.messageWarning =
          'On an ESP8266 a large payload will likley cause a crash due to RAM limitations on device. Reduce your template.'
      else global.messageWarning = ''
    }
  }
)

const pushDisabled = computed(() => {
  return global.disabled || config.use_wifi_direct
})

const runTestGravity = async () => {
  try {
    const data = {
      push_format: 'mqtt_format_gravity'
    }

    global.clearMessages()
    await config.runPushTest(data)
  } catch (error) {
    logError('PushMqttView.runTestGravity()', error)
    global.messageError = 'Failed to start push test'
  }
}

const runTestPressure = async () => {
  try {
    const data = {
      push_format: 'mqtt_format_pressure'
    }

    global.clearMessages()
    await config.runPushTest(data)
  } catch (error) {
    logError('PushMqttView.runTestPressure()', error)
    global.messageError = 'Failed to start push test'
  }
}

const gravityMqttFormatCallback = (opt) => {
  config.mqtt_format_gravity = decodeURIComponent(opt)
  config.mqtt_format_gravity = config.mqtt_format_gravity.replaceAll('|', '|\n')
}

const pressureMqttFormatCallback = (opt) => {
  config.mqtt_format_pressure = decodeURIComponent(opt)
  config.mqtt_format_pressure = config.mqtt_format_pressure.replaceAll('|', '|\n')
}

const gravityRenderFormat = () => {
  gravityRender.value = applyTemplate(status, config, config.mqtt_format_gravity)
}

const pressureRenderFormat = () => {
  pressureRender.value = applyTemplate(status, config, config.mqtt_format_pressure)
}

const save = async () => {
  if (!validateCurrentForm()) return

  await config.saveAll()
}
</script>
