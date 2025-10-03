<template>
  <div class="container">
    <p></p>
    <p class="h3">Tools</p>
    <hr />

    <VoltageFragment
      :disabled="global.disabled"
      :voltage-factor="config.voltage_factor"
      :voltage-offset="config.voltage_offset"
      @update:voltage-factor="config.voltage_factor = $event"
      @update:voltage-offset="config.voltage_offset = $event"
    ></VoltageFragment>

    <div class="row gy-4">
      <p></p>
      <hr />
    </div>

    <ListFilesFragment
      :disabled="global.disabled"
      :baseURL="global.baseURL"
      :token="global.token"
      :fetchTimeout="global.fetchTimout"
      @loading-start="global.disabled = true"
      @loading-end="global.disabled = false"
    ></ListFilesFragment>

    <div class="row gy-4">
      <p></p>
      <hr />
    </div>

    <div class="row gy-4" v-if="hideAdvanced">
      <div class="col-md-2">
        <button
          @click="enableAdvanced()"
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
          &nbsp;Enable Advanced
        </button>
      </div>
    </div>

    <AdvancedFilesFragment 
      v-if="!hideAdvanced"
      filename="advanced.txt"
      :disabled="global.disabled"
      :baseURL="global.baseURL"
      :token="global.token"
      :fetchTimeout="global.fetchTimout"
      @loading-start="global.disabled = true"
      @loading-end="global.disabled = false"
      @success-message="global.messageSuccess = $event"
      @error-message="global.messageError = $event"
      @clear-messages="global.clearMessages"
      @log-info="logInfo"
      @log-error="logError"
    ></AdvancedFilesFragment>

    <div class="row gy-4" v-if="!hideAdvanced">
      <p></p>
      <hr />
    </div>

    <EnableCorsFragment 
      v-if="!hideAdvanced"
      :disabled="global.disabled"
      :baseURL="global.baseURL"
      :token="global.token"
      :fetchTimeout="global.fetchTimout"
      @loading-start="global.disabled = true"
      @loading-end="global.disabled = false"
      @success-message="global.messageSuccess = $event"
      @error-message="global.messageError = $event"
      @clear-messages="global.clearMessages"
    ></EnableCorsFragment>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { global, config } from '@/modules/pinia'
import { logInfo, logError } from '@mp-se/espframework-ui-components'
// Fragment components are now imported globally from the ESP Framework UI Components library

const hideAdvanced = ref(true)

function enableAdvanced() {
  hideAdvanced.value = !hideAdvanced.value
}
</script>
