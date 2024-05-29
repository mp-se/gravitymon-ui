<template>
  <BsIcon :init="true"></BsIcon>

  <dialog id="spinner" class="loading">
    <div class="container text-center">
      <div class="row align-items-center" style="height: 170px">
        <div class="col">
          <div class="spinner-border" role="status" style="width: 5rem; height: 5rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </dialog>

  <div v-if="!global.initialized" class="container text-center">
    <BsMessage message="Initalizing GravityMon Web interface" class="h2" :dismissable="false" alert="info"></BsMessage>
  </div>

  <Menubar v-if="global.initialized" :disabled="global.disabled" />

  <div class="container">
    <div>
      <p></p>
    </div>
    <BsMessage v-if="global.isError" :close="close" :dismissable="true" :message="global.messageError" alert="danger" />
    <BsMessage v-if="global.isWarning" :close="close" :dismissable="true" :message="global.messageWarning"
      alert="warning" />
    <BsMessage v-if="global.isSuccess" :close="close" :dismissable="true" :message="global.messageSuccess"
      alert="success" />
    <BsMessage v-if="global.isInfo" :close="close" :dismissable="true" :message="global.messageInfo" alert="info" />

    <BsMessage v-if="status.wifi_setup" :dismissable="false" alert="info">
      Running in WIFI setup mode. Go to the <router-link class="alert-link" to="/device/wifi">wifi settings</router-link> meny and select wifi. Restart device
      after settings are selected.
    </BsMessage>

    <BsMessage v-if="status.ispindel_config" :dismissable="true" alert="info">
      iSpindel configuration found, <router-link class="alert-link" to="/device/hardware">import</router-link> formula/gyro or <router-link
      class="alert-link" to="/other/links">delete</router-link> the configuration.
    </BsMessage>
  </div>

  <router-view v-if="global.initialized" />
  <Footer v-if="global.initialized" :text="'(c) 2021-2024 Magnus Persson, ui version ' + global.uiVersion + ' (' + global.uiBuild +')'" />
</template>

<script setup>
import Menubar from "@/components/Menubar.vue"
import Footer from "@/components/Footer.vue"
import { onMounted, watch } from 'vue'
import { global, status, config, saveConfigState } from "@/modules/pinia"
import { storeToRefs } from 'pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

const props = defineProps(['App'])
const { disabled } = storeToRefs(global)

const close = (alert) => {
  if (alert == "danger")
    global.messageError = ""
  else if (alert == "warning")
    global.messageWarning = ""
  else if (alert == "success")
    global.messageSuccess = ""
  else if (alert == "info")
    global.messageInfo = ""
}

watch(disabled, () => {
  if (global.disabled)
    document.body.style.cursor = 'wait';
  else
    document.body.style.cursor = 'default';
})

onMounted(() => {
  if (!global.initialized) {
    showSpinner()
    status.auth((success, data) => {
      global.id = data.token

      status.load((success) => {
        global.platform = status.platform

        if (success) {
          config.load((success) => {
            if (success) {
              config.loadFormat((success) => {
                if (success) {
                  saveConfigState()
                  global.initialized = true
                } else {
                  global.messageError = "Failed to load format templates from device, please try to reload page!"
                }
                hideSpinner()
              })
            } else {
              global.messageError = "Failed to load configuration data from device, please try to reload page!"
            }
          })
        } else {
          global.messageError = "Failed to load status from device, please try to reload page!"
          hideSpinner()
        }
      })
    })
  }
})

function showSpinner() {
  document.querySelector('#spinner').showModal()
}

function hideSpinner() {
  document.querySelector('#spinner').close()
}
</script>

<style>
.loading {
  position: fixed;
  width: 200px;
  height: 200px;
  padding: 10px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 0;
}

dialog::backdrop {
  background-color: black;
  opacity: 60%;
}
</style>
