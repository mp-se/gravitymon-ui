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
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined formats"
            button="Formats"
            :options="mqttFormatOptions"
            :callback="mqttFormatCallback"
            :disabled="pushDisabled"
          />
          <BsModal
            @click="renderFormat"
            v-model="render"
            :code="true"
            :json="true"
            :mqtt="true"
            title="Format preview"
            button="Preview format"
            :disabled="pushDisabled"
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
              :hidden="!global.disabled"
            ></span>
            &nbsp;Save</button
          >&nbsp;

          <button @click="runTest" type="button" class="btn btn-secondary" :disabled="pushDisabled">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Run push test
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { validateCurrentForm, applyTemplate, mqttFormatOptions } from '@/modules/utils'
import { global, status, config } from '@/modules/pinia'
import { storeToRefs } from 'pinia'

const render = ref('')

const { mqtt_format_gravity } = storeToRefs(config)

watch(mqtt_format_gravity, () => {
  if (global.isEsp8266) {
    var s = applyTemplate(status, config, config.mqtt_format_gravity)
    if (s.length > 500)
      global.messageWarning =
        'On an ESP8266 a large payload will likley cause a crash due to RAM limitations on device. Reduce your template.'
    else global.messageWarning = ''
  }
})

const pushDisabled = computed(() => {
  return global.disabled || config.use_wifi_direct
})

const runTest = () => {
  const data = {
    push_format: 'mqtt_format_gravity'
  }

  global.clearMessages()
  config.runPushTest(data, () => {})
}

const mqttFormatCallback = (opt) => {
  config.mqtt_format_gravity = decodeURIComponent(opt)
  config.mqtt_format_gravity = config.mqtt_format_gravity.replaceAll('|', '|\n')
}

const renderFormat = () => {
  render.value = applyTemplate(status, config, config.mqtt_format_gravity)
}

const save = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
