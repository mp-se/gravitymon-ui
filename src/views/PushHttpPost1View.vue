<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - HTTP Post #1</p>
    <hr />

    <form
      @submit.prevent="save"
      class="needs-validation"
      novalidate
      :disabled="config.use_wifi_direct"
    >
      <div class="row">
        <div class="col-md-8">
          <BsInputText
            v-model="config.http_post_target"
            type="url"
            maxlength="120"
            label="HTTP URL"
            help="URL to push target, use format http://servername.com/resource (Supports http and https)"
            :disabled="pushDisabled"
            v-if="config.http_post_tcp === false"
          />

          <BsInputText
            v-model="config.http_post_target"
            type="text"
            maxlength="120"
            label="Server"
            help="IP and port to push target, use format server:port"
            :disabled="pushDisabled"
            v-if="config.http_post_tcp === true"
          />
        </div>
        <div class="col-md-1">
          <BsInputSwitch v-model="config.http_post_tcp" label="Use tcp" />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined URLs"
            button="URL"
            :options="httpPostUrlOptions"
            :callback="httpUrlCallback"
            :disabled="pushDisabled"
            v-if="config.http_post_tcp === false"
          />
        </div>
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_post_header1"
            maxlength="120"
            pattern="(.+): (.+)"
            label="HTTP Header #1"
            help=""
            :disabled="pushDisabled"
            v-if="config.http_post_tcp === false"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined headers"
            button="Header"
            :options="httpHeaderOptions"
            :callback="httpHeaderH1Callback"
            :disabled="pushDisabled"
            v-if="config.http_post_tcp === false"
          />
        </div>
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_post_header2"
            maxlength="120"
            pattern="(.+): (.+)"
            label="HTTP Header #2"
            help="Set a http headers, empty string is skipped, example: Content-Type: application/json"
            :disabled="pushDisabled"
            v-if="config.http_post_tcp === false"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined headers"
            button="Header"
            :options="httpHeaderOptions"
            :callback="httpHeaderH2Callback"
            :disabled="pushDisabled"
            v-if="config.http_post_tcp === false"
          />
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.http_post_int"
            label="Skip interval"
            min="0"
            max="5"
            width="4"
            help="Defines how many sleep cycles to skip between pushing data to this target, 1 = every second cycle. Default is 0."
            :disabled="pushDisabled"
            v-if="config.http_post_tcp === false"
          />
        </div>
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.http_post_format_gravity"
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
            :options="httpPostFormatOptions"
            :callback="httpFormatCallback"
            :disabled="pushDisabled"
          />
          <BsModal
            @click="renderFormat"
            v-model="render"
            :code="true"
            :json="true"
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
              v-show="global.disabled"
            ></span>
            &nbsp;Save</button
          >&nbsp;

          <button @click="runTest" type="button" class="btn btn-secondary" :disabled="pushDisabled">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-show="global.disabled"
            ></span>
            &nbsp;Run push test
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  httpHeaderOptions,
  httpPostUrlOptions,
  httpPostFormatOptions,
  applyTemplate
} from '@/modules/utils'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { global, status, config } from '@/modules/pinia'
import { logError } from '@mp-se/espframework-ui-components'
// BsInputSwitch is now globally registered from ESP Framework UI Components library

const render = ref('')

const pushDisabled = computed(() => {
  return global.disabled || config.use_wifi_direct
})

const runTest = async () => {
  try {
    const data = {
      push_format: 'http_post_format_gravity'
    }

    global.clearMessages()
    await config.runPushTest(data)
  } catch (error) {
    logError('PushHttpPost1View.runTest()', error)
    global.messageError = 'Failed to start push test'
  }
}

const httpUrlCallback = (opt) => {
  config.http_post_target = opt
}

const httpHeaderH1Callback = (opt) => {
  config.http_post_header1 = opt
}

const httpHeaderH2Callback = (opt) => {
  config.http_post_header2 = opt
}

const httpFormatCallback = (opt) => {
  config.http_post_format_gravity = decodeURIComponent(opt)
}

const renderFormat = () => {
  render.value = applyTemplate(status, config, config.http_post_format_gravity)
}

const serverPortPattern = /^([a-zA-Z0-9.-]+|\d{1,3}(?:\.\d{1,3}){3}):\d{1,5}$/

function validateServerPortFormat(value) {
  return serverPortPattern.test(value)
}

const save = async () => {
  if (!validateCurrentForm()) return

  if (config.http_post_tcp && !validateServerPortFormat(config.http_post_target)) {
    global.messageError = 'Server must be in format hostname:port or ip:port'
    return
  }

  await config.saveAll()
}
</script>
