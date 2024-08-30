<template>
  <div class="container">
    <p></p>
    <p class="h3">Tools</p>
    <hr />

    <h5>Calculate a new voltage factor</h5>
    <div class="row">
      <div class="col-md-4">
        <BsInputNumber
          v-model="measuredVoltage"
          label="Measured voltage"
          min="0"
          max="6"
          step=".01"
          width="4"
          unit="V"
          help="Enter the measured voltage on the device"
          :disabled="global.disabled"
        >
        </BsInputNumber>
      </div>
      <div class="col-md-4">
        <BsInputReadonly
          v-model="status.battery"
          unit="V"
          label="Last voltage reading"
          width="4"
          help="Last measured battery voltage"
          :disabled="global.disabled"
        ></BsInputReadonly>
      </div>
      <div class="col-md-4">
        <BsInputReadonly
          v-model="config.voltage_factor"
          label="Current voltage factor"
          width="4"
          help="Current voltage factor"
          :disabled="global.disabled"
        ></BsInputReadonly>
      </div>
    </div>

    <div class="row gy-4">
      <div class="col-md-12"></div>
      <div class="col-md-3">
        <button
          @click="calculateFactor"
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
          &nbsp;Calculate factor
        </button>
      </div>
    </div>

    <div class="row gy-4">
      <p></p>
      <hr />
    </div>

    <h5>Explore the file system</h5>
    <div class="row gy-4">
      <div class="col-md-3">
        <button
          @click="listFilesView"
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
          &nbsp;List files</button
        >&nbsp;
        <button
          @click="toggleAdvanced()"
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

      <div class="col-md-6">
        <div class="button-group">
          <template v-for="(f, index) in filesView" :key="index">
            <button
              type="button"
              @click.prevent="viewFile(f)"
              class="btn btn-outline-primary"
              href="#"
              :disabled="global.disabled"
            >
              {{ f }}</button
            >&nbsp;
          </template>
        </div>
      </div>
    </div>

    <div v-if="filesystemUsage > 0" class="col-md-12">
      <h6>File system usage</h6>
      <BsProgress :progress="filesystemUsage"></BsProgress>
      <p>{{ filesystemUsageText }}</p>
    </div>

    <div v-if="fileData !== null" class="col-md-12">
      <h6>File contents</h6>
      <pre class="border p-2">{{ fileData }}</pre>
    </div>

    <div v-if="!hideAdvanced" class="row gy-4">
      <p></p>
      <hr />
    </div>

    <h5 v-if="!hideAdvanced">Upload files to file system</h5>
    <div v-if="!hideAdvanced" class="row gy-4">
      <form @submit.prevent="upload">
        <div class="col-md-12">
          <BsFileUpload
            name="upload"
            id="upload"
            label="Select firmware file"
            accept=""
            help="Choose a file to upload to the file system"
            :disabled="global.disabled"
          >
          </BsFileUpload>
        </div>
        <div class="col-md-3">
          <p></p>
          <button
            type="submit"
            class="btn btn-secondary"
            id="upload-btn"
            value="upload"
            data-bs-toggle="tooltip"
            title="Update the device with the selected firmware"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Upload file
          </button>
        </div>
        <div v-if="progress > 0" class="col-md-12">
          <p></p>
          <BsProgress :progress="progress"></BsProgress>
        </div>
      </form>
    </div>

    <div v-if="!hideAdvanced" class="row gy-4">
      <p></p>
      <hr />
    </div>

    <h5 v-if="!hideAdvanced">Delete files from file system</h5>
    <div v-if="!hideAdvanced" class="row gy-4">
      <div class="col-md-3">
        <button
          @click="listFilesDelete"
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
          &nbsp;List files
        </button>
      </div>
      <div class="col-md-6">
        <div class="button-group">
          <template v-for="(f, index) in filesDelete" :key="index">
            <button
              type="button"
              @click.prevent="deleteFile(f)"
              class="btn btn-outline-primary"
              href="#"
              :disabled="global.disabled"
            >
              {{ f }}</button
            >&nbsp;
          </template>
        </div>
      </div>

      <BsModalConfirm
        :callback="confirmDeleteCallback"
        :message="confirmDeleteMessage"
        id="deleteFile"
        title="Delete file"
        :disabled="global.disabled"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { global, config, status, saveConfigState } from '@/modules/pinia'
import { isValidJson, isValidFormData, isValidMqttData } from '@/modules/utils'
import { logDebug, logError } from '@/modules/logger'

// TODO: Hide upload button when no file is selected

const measuredVoltage = ref(0)
const filesystemUsage = ref(null)
const filesystemUsageText = ref(null)
const filesView = ref([])
const fileData = ref(null)
const filesDelete = ref([])

const confirmDeleteMessage = ref(null)
const confirmDeleteFile = ref(null)
const hideAdvanced = ref(true)

function toggleAdvanced() {
  hideAdvanced.value = !hideAdvanced.value
}

const confirmDeleteCallback = (result) => {
  logDebug('ToolsView.confirmDeleteCallback()', result)

  if (result) {
    global.disabled = true
    global.clearMessages()

    fileData.value = null

    var data = {
      command: 'del',
      file: confirmDeleteFile.value
    }

    config.sendFilesystemRequest(data, (success, text) => {
      logDebug('ToolsView.confirmDeleteCallback()', success), text
      filesView.value = []
      filesDelete.value = []
      filesystemUsage.value = null

      global.disabled = false
    })
  }
}

const calculateFactor = () => {
  global.disabled = true
  global.clearMessages()

  var mv = parseFloat(measuredVoltage.value)

  if (isNaN(mv)) {
    global.messageError = 'Not a valid measurement'
    return
  }

  config.voltage_factor = parseFloat(mv / (status.battery / config.voltage_factor)).toFixed(2)

  config.sendConfig((success) => {
    logDebug('ToolsView.calculateFactor()', success)
    saveConfigState()
    global.disabled = true
    setTimeout(() => {
      status.load((success) => {
        logDebug('ToolsView.calculateFactor()', success, status.battery)
        global.messageInfo = 'New factor applied, check if the current battery reading is correct'
        global.disabled = false
      }, 1000)
    })
  })
}

const viewFile = (f) => {
  global.disabled = true
  global.clearMessages()

  fileData.value = null

  var data = {
    command: 'get',
    file: f
  }

  config.sendFilesystemRequest(data, (success, text) => {
    if (success) {
      if (isValidJson(text)) fileData.value = JSON.stringify(JSON.parse(text), null, 2)
      else if (isValidFormData(text)) fileData.value = text.replaceAll('&', '&\n\r')
      else if (isValidMqttData(text)) fileData.value = text.replaceAll('|', '|\n\r')
      else fileData.value = text
    }

    global.disabled = false
  })
}

const deleteFile = (f) => {
  confirmDeleteMessage.value = 'Do you really want to delete file ' + f
  confirmDeleteFile.value = f
  document.getElementById('deleteFile').click()
}

const listFilesView = () => {
  global.disabled = true
  global.clearMessages()

  filesView.value = []

  var data = {
    command: 'dir'
  }

  config.sendFilesystemRequest(data, (success, text) => {
    if (success) {
      var json = JSON.parse(text)
      filesystemUsage.value = (json.used / json.total) * 100
      filesystemUsageText.value =
        'Total space ' +
        json.total / 1024 +
        'kb, Free space ' +
        json.free / 1024 +
        'kb, Used space ' +
        json.used / 1024 +
        'kb'

      for (var f in json.files) {
        filesView.value.push(json.files[f].file)
      }
    }

    global.disabled = false
  })
}

const listFilesDelete = () => {
  global.disabled = true
  global.clearMessages()

  filesDelete.value = []

  var data = {
    command: 'dir'
  }

  config.sendFilesystemRequest(data, (success, text) => {
    if (success) {
      var json = JSON.parse(text)
      for (var f in json.files) {
        filesDelete.value.push(json.files[f].file)
      }
    }

    global.disabled = false
  })
}

const progress = ref(0)

function upload() {
  const fileElement = document.getElementById('upload')

  function errorAction(e) {
    logError('ToolsView.upload()', e.type)
    global.messageFailed = 'File upload failed!'
    global.disabled = false
  }

  if (fileElement.files.length === 0) {
    global.messageFailed = 'You need to select one file with firmware to upload'
  } else {
    global.disabled = true
    logDebug('ToolsView.upload()', 'Selected file: ' + fileElement.files[0].name)

    const xhr = new XMLHttpRequest()
    xhr.timeout = 40000 // 40 s
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
        global.messageSuccess = 'File upload completed!'
        global.messageFailed = ''
      }

      global.disabled = false
      filesView.value = []
      filesDelete.value = []
      filesystemUsage.value = null
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
      logDebug('ToolsView.upload()', 'progress2: ' + e.loaded + ',' + e.total + ',' + xhr.status)
    }

    fileData.append('file', fileElement.files[0])

    xhr.open('POST', global.baseURL + 'api/filesystem/upload')
    xhr.setRequestHeader('Authorization', global.token)
    xhr.send(fileData)
  }
}
</script>
