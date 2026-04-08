<!--
  Copyright (c) 2021-2026 Magnus Persson
  https://github.com/mp-se/gravitymon | https://github.com/mp-se/gravitymon-ui

  Licensed under the GNU General Public License v3.0 (GPL v3) for open source use,
  or a Commercial License for proprietary use. See LICENSE and LICENSE_COMMERCIAL.
-->
<template>
  <h5>Developer settings</h5>
  <div class="row gy-4">
    <div class="col-md-3">
      <button
        @click="enableCors"
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
        &nbsp;Enable CORS</button
      >&nbsp;
    </div>
  </div>
</template>

<script setup>
import { global } from '@/modules/pinia'
import { logInfo, logError } from '@mp-se/espframework-ui-components'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'

const enableCors = async () => {
  try {
    global.disabled = true
    global.clearMessages()

    const data = {
      cors_allowed: true
    }

    try {
      await http.postJson('api/config', data)
      logInfo('EnableCorsFragment.enableCors()', 'Sending /api/config completed')
      global.messageSuccess = 'CORS enabled in configuration, please reboot to take effect.'
    } catch (err) {
      logError('EnableCorsFragment.enableCors()', 'Sending /api/config failed', err)
      global.messageError = 'Failed to enable CORS.'
    }
  } catch (err) {
    logError('EnableCorsFragment.enableCors()', 'Error enabling CORS:', err)
    global.messageError = 'Failed to enable CORS: ' + (err.message || err)
  } finally {
    global.disabled = false
  }
}
</script>
