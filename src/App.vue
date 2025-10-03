<template>
  <dialog id="spinner" class="loading">
    <div class="container text-center">
      <div class="row align-items-center" style="height: 170px">
        <div class="col">
          <div class="spinner-border" role="status" style="width: 5rem; height: 5rem">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </dialog>

  <div v-if="!global.initialized" class="container text-center">
    <BsMessage
      message="Initalizing GravityMon Web interface"
      class="h2"
      :dismissable="false"
      alert="info"
    ></BsMessage>
  </div>

  <BsMenuBar 
    v-if="global.initialized" 
    :disabled="global.disabled" 
    brand="Gravitymon" 
    :menu-items="items"
    :dark-mode="config.dark_mode"
    :mdns="config.mdns"
    @update:dark-mode="config.dark_mode = $event"
  />

  <div class="container">
    <div>
      <p></p>
    </div>
    <BsMessage
      v-if="!status.connected"
      message="No response from device, has it gone into sleep model? No need to refresh the page, just turn on the device again"
      class="h2"
      :dismissable="false"
      alert="danger"
    ></BsMessage>

    <BsMessage
      v-if="global.isError"
      :close="close"
      :dismissable="true"
      :message="global.messageError"
      alert="danger"
    />
    <BsMessage
      v-if="global.isWarning"
      :close="close"
      :dismissable="true"
      :message="global.messageWarning"
      alert="warning"
    />
    <BsMessage
      v-if="global.isSuccess"
      :close="close"
      :dismissable="true"
      :message="global.messageSuccess"
      alert="success"
    />
    <BsMessage
      v-if="global.isInfo"
      :close="close"
      :dismissable="true"
      :message="global.messageInfo"
      alert="info"
    />

    <BsMessage v-if="status.wifi_setup" :dismissable="false" alert="info">
      Running in WIFI setup mode. Go to the
      <router-link class="alert-link" to="/device/wifi">wifi settings</router-link>
      meny and select wifi. Restart device after wifi is configured.
    </BsMessage>

    <BsMessage v-if="status.wifi_setup" :dismissable="false" alert="warning">
      Sensors are not enabled when in wifi setup mode!
    </BsMessage>

    <BsMessage v-if="status.ispindel_config" :dismissable="true" alert="info">
      iSpindel configuration found,
      <router-link class="alert-link" to="/device/gyro">import</router-link>
      formula/gyro or
      <router-link class="alert-link" to="/other/support">delete</router-link> the configuration.
    </BsMessage>
  </div>

  <router-view v-if="global.initialized" />
  <BsFooter v-if="global.initialized" text="(c) 2021-2025 Magnus Persson" />
</template>

<script setup>
// BsMenuBar and BsFooter are now imported globally from the ESP Framework UI Components library
import { onMounted, watch, onBeforeMount, ref } from 'vue'
import { global, status, config, saveConfigState } from './modules/pinia'
import { storeToRefs } from 'pinia'
import { useTimers } from '@mp-se/espframework-ui-components'
import { logError } from '@mp-se/espframework-ui-components'
import { items } from './modules/router'

const { createInterval } = useTimers()
const polling = ref(null)

const { disabled } = storeToRefs(global)

const close = (alert) => {
  if (alert == 'danger') global.messageError = ''
  else if (alert == 'warning') global.messageWarning = ''
  else if (alert == 'success') global.messageSuccess = ''
  else if (alert == 'info') global.messageInfo = ''
}

watch(disabled, () => {
  if (global.disabled) document.body.style.cursor = 'wait'
  else document.body.style.cursor = 'default'
})

// Debug: Watch dark mode changes
watch(() => config.dark_mode, (newValue) => {
  console.log('Dark mode changed to:', newValue)
  console.log('data-bs-theme attribute:', document.documentElement.getAttribute('data-bs-theme'))
}, { immediate: true })

function ping() {
  status.ping()
}

onBeforeMount(() => {
  polling.value = createInterval(ping, 7000)
})

onMounted(async () => {
  if (!global.initialized) {
    await initializeApp()
  }
})

async function initializeApp() {
  try {
    showSpinner()
    
    // Step 1: Authenticate with device
    const authResult = await status.auth()
    if (!authResult.success) {
      global.messageError = 'Failed to authenticate with device, please try to reload page!'
      return
    }
    global.id = authResult.data.token

    // Step 2: Load feature flags
    const globalSuccess = await global.load()
    if (!globalSuccess) {
      global.messageError = 'Failed to load feature flags from device, please try to reload page!'
      return
    }

    // Step 3: Load device status
    const statusSuccess = await status.load()
    if (!statusSuccess) {
      global.messageError = 'Failed to load status from device, please try to reload page!'
      return
    }

    // Step 4: Load configuration
    const configSuccess = await new Promise(resolve => {
      config.load(resolve)
    })
    if (!configSuccess) {
      global.messageError = 'Failed to load configuration data from device, please try to reload page!'
      return
    }

    // Step 5: Load format templates
    const formatSuccess = await new Promise(resolve => {
      config.loadFormat(resolve)
    })
    if (!formatSuccess) {
      global.messageError = 'Failed to load format templates from device, please try to reload page!'
      return
    }

    // Success! Initialize the app
    saveConfigState()
    global.initialized = true
    
  } catch (error) {
    logError('App.initializeApp()', error)
    global.messageError = `Initialization failed: ${error.message}`
  } finally {
    hideSpinner()
  }
}

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
