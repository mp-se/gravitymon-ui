<template>
  <h5>Upload files to file system</h5>
  <div class="row gy-4">
    <form @submit.prevent="upload">
      <div class="col-md-12">
        <BsFileUpload
          name="upload"
          id="upload"
          label="Select firmware file"
          accept=""
          help="Choose a file to upload to the file system"
          :disabled="global.disabled"
          @change="onFileChange"
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
          :disabled="global.disabled || !hasFileSelected"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-show="global.disabled"
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

  <div class="row gy-4">
    <p></p>
    <hr />
  </div>

  <h5>Delete files from file system</h5>
  <div class="row gy-4">
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
          v-show="global.disabled"
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
</template>

<script setup>
import { ref } from 'vue'
import { global } from '@/modules/pinia'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'
import { logDebug, logError } from '@mp-se/espframework-ui-components'

const fileData = ref(null)
const filesDelete = ref([])
const hasFileSelected = ref(false)

const confirmDeleteMessage = ref(null)
const confirmDeleteFile = ref(null)

const confirmDeleteCallback = (result) => {
  logDebug('AdvancedFilesFragment.confirmDeleteCallback()', result)

  if (result) {
    global.disabled = true
    global.clearMessages()

    fileData.value = null

    const data = {
      command: 'del',
      file: confirmDeleteFile.value
    }

    ;(async () => {
      await http.filesystemRequest(data)
      filesDelete.value = []
      global.disabled = false
    })()
  }
}

const deleteFile = (f) => {
  confirmDeleteMessage.value = 'Do you really want to delete file ' + f
  confirmDeleteFile.value = f
  document.getElementById('deleteFile').click()
}

const listFilesDelete = () => {
  global.disabled = true
  global.clearMessages()

  filesDelete.value = []

  const data = {
    command: 'dir'
  }

  ;(async () => {
    const res = await http.filesystemRequest(data)
    if (res && res.success) {
      const json = JSON.parse(res.text)
      for (const f in json.files) {
        filesDelete.value.push(json.files[f].file)
      }
    }

    global.disabled = false
  })()
}

const progress = ref(0)

const onFileChange = (event) => {
  hasFileSelected.value = event.target.files.length > 0
}

async function upload() {
  const fileElement = document.getElementById('upload')

  if (fileElement.files.length === 0) {
    global.messageError = 'You need to select one file with firmware to upload'
    return
  }

  global.disabled = true
  logDebug('AdvancedFilesFragment.upload()', 'Selected file: ' + fileElement.files[0].name)

  progress.value = 0

  try {
    const res = await http.uploadFile('api/filesystem/upload', fileElement.files[0], {
      timeoutMs: 40000,
      onProgress: (e) => {
        if (e.lengthComputable) progress.value = Math.round((e.loaded / e.total) * 100)
      }
    })

    progress.value = 100
    if (res && res.success) {
      global.messageSuccess = 'File upload completed!'
      global.messageError = ''
    } else {
      global.messageError = `File upload failed: ${res && res.status}`
    }
  } catch (err) {
    logError('AdvancedFilesFragment.upload()', err)
    global.messageError = 'File upload failed!'
  } finally {
    global.disabled = false
    filesDelete.value = []
  }
}
</script>
