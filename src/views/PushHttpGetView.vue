<template>
  <div class="container">
    <p></p>
    <p class="h3">Push - HTTP Get</p>
    <hr />

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_get_target"
            type="url"
            maxlength="120"
            label="HTTP URL"
            help="URL to push target, use format http://servername.com/resource (Supports http and https)"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined URLs"
            button="URL"
            :options="httpGetUrlOptions"
            :callback="httpUrlCallback"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_get_header1"
            maxlength="120"
            pattern="(.+): (.+)"
            label="HTTP Header #1"
            help=""
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined headers"
            button="Header"
            :options="httpHeaderOptions"
            :callback="httpHeaderH1Callback"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputText
            v-model="config.http_get_header2"
            maxlength="120"
            pattern="(.+): (.+)"
            label="HTTP Header #2"
            help="Set a http headers, empty string is skipped, example: Content-Type: application/json"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-3">
          <BsDropdown
            label="Predefined headers"
            button="Header"
            :options="httpHeaderOptions"
            :callback="httpHeaderH2Callback"
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.http_get_int"
            label="Skip interval"
            min="0"
            max="5"
            width="4"
            help="Defines how many sleep cycles to skip between pushing data to this target, 1 = every second cycle. Default is 0."
            :disabled="pushDisabled"
          />
        </div>
        <div class="col-md-9">
          <BsInputTextAreaFormat
            v-model="config.http_get_format"
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
            :options="httpGetFormatOptions"
            :callback="httpFormatCallback"
            :disabled="pushDisabled"
          />
          <BsModal
            @click="renderFormat"
            v-model="render"
            :code="true"
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
        <div class="col-md-3">
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
            &nbsp;Save
          </button>
        </div>
        <div class="col-md-3">
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
import { ref, computed } from 'vue'
import {
  validateCurrentForm,
  httpHeaderOptions,
  httpGetUrlOptions,
  httpGetFormatOptions,
  applyTemplate
} from '@/modules/utils'
import { global, status, config } from '@/modules/pinia'

const render = ref('')

const pushDisabled = computed(() => {
  return global.disabled || config.use_wifi_direct
})

const runTest = () => {
  const data = {
    push_format: 'http_get_format'
  }

  global.clearMessages()
  config.runPushTest(data, () => {})
}

const httpUrlCallback = (opt) => {
  config.http_get_target = opt
}

const httpHeaderH1Callback = (opt) => {
  config.http_get_header1 = opt
}

const httpHeaderH2Callback = (opt) => {
  config.http_get_header2 = opt
}

const httpFormatCallback = (opt) => {
  config.http_get_format = decodeURIComponent(opt)
}

const renderFormat = () => {
  var s = applyTemplate(status, config, config.http_get_format)
  render.value = s.replaceAll('&', '&')
}

const save = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
