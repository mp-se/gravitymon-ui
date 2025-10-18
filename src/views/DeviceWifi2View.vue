<template>
  <div class="container">
    <p></p>
    <p class="h3">Device - WIFI (Manual)</p>
    <hr />

    <BsMessage
      v-if="config.wifi_ssid === '' && config.wifi_ssid2 === ''"
      dismissable="true"
      message=""
      alert="warning"
    >
      You need to define at least one wifi network
    </BsMessage>

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-6">
          <BsInputText
            v-model="config.wifi_ssid"
            label="SSID #1"
            maxlength="30"
            :badge="badge.deviceWifi1Badge()"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.wifi_pass"
            type="password"
            maxlength="50"
            label="Password #1"
            help="Enter password for the first wifi network"
            :disabled="global.disabled"
          ></BsInputText>
        </div>

        <div class="col-md-6">
          <BsInputText
            v-model="config.wifi_ssid2"
            label="SSID #2"
            maxlength="30"
            :badge="badge.deviceWifi2Badge()"
            :disabled="global.disabled"
          />
        </div>
        <div class="col-md-6">
          <BsInputText
            v-model="config.wifi_pass2"
            type="password"
            maxlength="50"
            label="Password #2"
            help="Enter password for the first wifi network"
            :disabled="global.disabled"
          ></BsInputText>
        </div>

        <div class="col-md-12">
          <hr />
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="config.wifi_portal_timeout"
            unit="seconds"
            label="Portal timeout"
            min="10"
            max="240"
            step="1"
            width="5"
            help="Max time the wifi portal is idle (10 to 240)"
            :disabled="global.disabled"
          ></BsInputNumber>
        </div>
        <div class="col-md-6">
          <BsInputNumber
            v-model="config.wifi_connect_timeout"
            unit="seconds"
            label="Connection timeout"
            min="1"
            max="60"
            step="1"
            width="5"
            help="Max time waiting for a wifi connection (1 to 60)"
            :disabled="global.disabled"
          >
          </BsInputNumber>
        </div>
        <div class="col-md-6" v-if="global.ui.enableScanForStrongestAp">
          <BsInputSwitch
            v-model="config.wifi_scan_ap"
            label="Scan for strongest AP"
            help="Will do a scan and connect to the strongest AP found (longer connection time)"
            :disabled="global.disabled"
          >
          </BsInputSwitch>
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
            @click.prevent="restart"
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
            &nbsp;Restart device
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { validateCurrentForm } from '@mp-se/espframework-ui-components'
import { global, config } from '@/modules/pinia'
import * as badge from '@/modules/badge'

const save = async () => {
  if (!validateCurrentForm()) return

  await config.saveAll()
  global.messageInfo =
    'If WIFI settings are changed, restart the device and enter the new URL of the device!'
}

const restart = async () => {
  await config.restart()
}
</script>
