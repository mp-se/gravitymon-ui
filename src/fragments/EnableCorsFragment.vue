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

const enableCors = async () => {
  try {
    global.disabled = true
    global.clearMessages()

    const data = {
      cors_allowed: true
    }

    const response = await fetch(global.baseURL + 'api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: global.token
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(global.fetchTimeout)
    })

    if (response.status !== 200) {
      logError('EnableCorsFragment.enableCors()', 'Sending /api/config failed', response.status)
      global.messageError = 'Failed to enable CORS.'
    } else {
      logInfo('EnableCorsFragment.enableCors()', 'Sending /api/config completed')
      global.messageSuccess = 'CORS enabled in configuration, reboot to take effect.'
    }
  } catch (err) {
    logError('EnableCorsFragment.enableCors()', 'Error enabling CORS:', err)
    global.messageError = 'Failed to enable CORS: ' + (err.message || err)
  } finally {
    global.disabled = false
  }
}
</script>