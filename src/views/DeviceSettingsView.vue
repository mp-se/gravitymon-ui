<template>
  <div class="container">
    <p></p>
    <p class="h2">Device - Settings</p>
    <hr />

    <BsMessage v-if="config.mdns === ''" dismissable="true" message="" alert="warning">
      You need to define a mdns name for the device
    </BsMessage>

    <form @submit.prevent="saveSettings" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-12">
          <BsInputText
            v-model="config.mdns"
            maxlength="63"
            minlength="1"
            label="MDNS"
            help="Enter device name used on the network, the suffix .local will be added to this name"
            :badge="badge.deviceMdnsBadge()"
            :disabled="global.disabled"
          >
          </BsInputText>
        </div>

        <div class="col-md-12">
          <hr />
        </div>

        <div class="col-md-6">
          <BsInputRadio
            v-model="config.temp_unit"
            :options="tempOptions"
            label="Temperature Format"
            width=""
            :disabled="global.disabled"
          ></BsInputRadio>
        </div>
        <div class="col-md-6">
          <BsInputRadio
            v-model="config.gravity_unit"
            :options="gravityOptions"
            label="Gravity Format"
            width=""
            :disabled="global.disabled"
          ></BsInputRadio>
        </div>

        <div class="col-md-12">
          <hr />
        </div>

        <div class="col-md-9">
          <BsInputText
            v-model="config.ota_url"
            type="url"
            maxlength="80"
            label="OTA URL"
            help="Base URL to where firmware and version.json file can be found. Needs to end with '/'', example: http://www.mysite.com/firmware/"
            :disabled="global.disabled"
          >
          </BsInputText>
        </div>

        <div class="col-md-3">
          <BsDropdown
            label="Predefined ota"
            button="URL"
            :options="otaOptions"
            :callback="otaCallback"
            :disabled="global.disabled"
          />
        </div>

        <div class="col-md-12">
          <hr />
        </div>

        <div class="col-md-6">
          <BsInputRadio
            v-model="config.dark_mode"
            :options="uiOptions"
            label="User Interface"
            width=""
            :disabled="global.disabled"
          ></BsInputRadio>
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
            @click.prevent="config.restart()"
            type="button"
            class="btn btn-secondary"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-show="global.disabled"
            ></span>
            &nbsp;Restart device</button
          >&nbsp;

          <button
            @click="factory"
            type="button"
            class="btn btn-secondary"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-show="global.disabled"
            ></span>
            &nbsp;Restore factory defaults
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { global, config } from '@/modules/pinia'
import * as badge from '@/modules/badge'
import { logError, logInfo } from '@mp-se/espframework-ui-components'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'

const otaOptions = ref([
  { label: '-blank-', value: '' },
  { label: 'Gravitymon.com', value: 'https://www.gravitymon.com/firmware/' }
])

const tempOptions = ref([
  { label: 'Celsius °C', value: 'C' },
  { label: 'Fahrenheit °F', value: 'F' }
])

const gravityOptions = ref([
  { label: 'Specific Gravity', value: 'G' },
  { label: 'Plato', value: 'P' }
])

const uiOptions = ref([
  { label: 'Day mode', value: false },
  { label: 'Dark mode', value: true }
])

const otaCallback = (opt) => {
  config.ota_url = opt
}

const factory = async () => {
  global.clearMessages()
  logInfo('DeviceSettingsView.factory()', 'Sending /api/factory')
  global.disabled = true

  try {
    const json = await http.getJson('api/factory')

    if (json.success == true) {
      global.messageSuccess = json.message
      const reloadTimeout = setTimeout(() => {
        try {
          location.reload(true)
        } catch (error) {
          logError('DeviceSettingsView.factory.reload()', error)
          window.location.reload()
        }
      }, 2000)

      // Clean up timeout on component unmount
      window.addEventListener(
        'beforeunload',
        () => {
          clearTimeout(reloadTimeout)
        },
        { once: true }
      )
    } else {
        global.messageError = json.message
    }
  } catch (err) {
    logError('DeviceSettingsView.factory()', err)
    global.messageError = 'Failed to do factory restore'
  } finally {
    global.disabled = false
  }
}

const saveSettings = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
}
</script>
