<template>
  <div class="container">
    <p></p>
    <p class="h3">Firmware Upload</p>
    <hr />

    <div class="row">
      <form @submit.prevent="upload">
        <div style="col-md-12">
          <p>
            Selet the firmware file that matches your device. Platform:
            <span class="badge bg-secondary">{{ global.platform }}</span>
            , Version:
            <span class="badge bg-secondary">{{ global.app_ver }}</span> ({{ global.app_build }}) ,
            Hardware: <span class="badge bg-secondary">{{ global.hardware }}</span> , Filename:
            <span class="badge bg-secondary">{{ global.firmware_file }}</span>
          </p>
        </div>

        <div class="col-md-12">
          <BsFileUpload
            name="upload"
            id="upload"
            label="Select firmware file"
            accept=".bin"
            help="Choose the firmware file (.bin) that will be used to update the device. The upload button will be enabled once a file is selected."
            :disabled="global.disabled"
            @change="onFileChange"
          >
          </BsFileUpload>
        </div>

        <div class="col-md-3">
          <p></p>
          <button
            type="submit"
            class="btn btn-primary"
            id="upload-btn"
            value="upload"
            data-bs-toggle="tooltip"
            :title="!hasFileSelected ? 'Please select a firmware file first' : 'Update the device with the selected firmware'"
            :disabled="global.disabled || !hasFileSelected"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Flash firmware
          </button>
        </div>

        <div v-if="progress > 0" class="col-md-12">
          <p></p>
          <BsProgress :progress="progress"></BsProgress>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { global } from '@/modules/pinia'
import { logDebug, logError } from '@mp-se/espframework-ui-components'

const progress = ref(0)
const hasFileSelected = ref(false)

const onFileChange = (event) => {
  const fileElement = event.target
  hasFileSelected.value = fileElement.files && fileElement.files.length > 0
}

function upload() {
  const fileElement = document.getElementById('upload')

  function errorAction(e) {
    logError('FirmwareView.upload()', e.type)
    global.messageFailed = 'File upload failed!'
    global.disabled = false
    // Reset file input and selection state
    const fileElement = document.getElementById('upload')
    if (fileElement) {
      fileElement.value = ''
      hasFileSelected.value = false
    }
  }

  if (fileElement.files.length === 0) {
    global.messageFailed = 'You need to select one file with firmware to upload'
  } else {
    global.disabled = true
    logDebug('FirmwareView.upload()', 'Selected file: ' + fileElement.files[0].name)

    const xhr = new XMLHttpRequest()
    xhr.timeout = 1000 * 180 // 180 s
    progress.value = 0

    xhr.onabort = function (e) {
      errorAction(e)
    }
    xhr.onerror = function (e) {
      errorAction(e)
    }
    xhr.ontimeout = function (e) {
      errorAction(e)
    }

    xhr.onloadstart = function () {}

    xhr.onloadend = function () {
      progress.value = 100
      if (xhr.status == 200) {
        global.messageSuccess =
          'File upload completed, waiting for device to restart before doing refresh!'
        global.messageFailed = ''
        
        // Use a more reliable redirect with timeout cleanup
        const redirectTimeout = setTimeout(() => {
          try {
            location.href = location.href.replace('/other/firmware', '')
          } catch (error) {
            logError('FirmwareView.redirect()', error)
            // Fallback redirect
            window.location.reload()
          }
        }, 10000)
        
        // Clean up timeout on page unload
        window.addEventListener('beforeunload', () => {
          clearTimeout(redirectTimeout)
        }, { once: true })
      }
    }

    // The update only seams to work when loaded from the device (i.e. when CORS is not used)
    xhr.upload.addEventListener(
      'progress',
      (e) => {
        progress.value = (e.loaded / e.total) * 100
      },
      false
    )

    const fileData = new FormData()
    fileData.onprogress = function (e) {
      logDebug('FirmwareView.upload()', 'progress2: ' + e.loaded + ',' + e.total + ',' + xhr.status)
    }

    fileData.append('file', fileElement.files[0])

    xhr.open('POST', global.baseURL + 'api/firmware')
    xhr.setRequestHeader('Authorization', global.token)
    xhr.send(fileData)
  }
}
</script>
