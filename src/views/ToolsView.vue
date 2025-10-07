<template>
  <div class="container">
    <p></p>
    <p class="h3">Tools</p>
    <hr />

    <template v-if="global.ui.enableVoltageFragment">
      <VoltageFragment></VoltageFragment>

      <div class="row gy-4">
        <p></p>
        <hr />
      </div>
    </template>

    <ListFilesFragment></ListFilesFragment>

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
            v-show="global.disabled"
          ></span>
          &nbsp;Enable Advanced
        </button>
      </div>
    </div>

    <AdvancedFilesFragment v-if="!hideAdvanced"></AdvancedFilesFragment>

    <div class="row gy-4" v-if="!hideAdvanced">
      <p></p>
      <hr />
    </div>

    <EnableCorsFragment v-if="!hideAdvanced"></EnableCorsFragment>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { global } from '@/modules/pinia'

const hideAdvanced = ref(true)

function enableAdvanced() {
  hideAdvanced.value = !hideAdvanced.value
}
</script>
