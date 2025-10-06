<template>
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
          v-show="global.disabled"
        ></span>
        &nbsp;List files</button
      >&nbsp;
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
</template>

<script setup>
import { ref } from 'vue'
import { global } from '@/modules/pinia'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'
import { isValidJson, isValidFormData, isValidMqttData } from '@mp-se/espframework-ui-components'

const filesystemUsage = ref(null)
const filesystemUsageText = ref(null)
const filesView = ref([])
const fileData = ref(null)

const viewFile = (f) => {
  global.disabled = true
  global.clearMessages()

  fileData.value = null

  var data = {
    command: 'get',
    file: f
  }

  ;(async () => {
    const res = await http.filesystemRequest(data)
    if (res && res.success) {
      const text = res.text
      if (isValidJson(text)) fileData.value = JSON.stringify(JSON.parse(text), null, 2)
      else if (isValidFormData(text)) fileData.value = text.replaceAll('&', '&\n\r')
      else if (isValidMqttData(text)) fileData.value = text.replaceAll('|', '|\n\r')
      else fileData.value = text
    }

    global.disabled = false
  })()
}

const listFilesView = () => {
  global.disabled = true
  global.clearMessages()

  filesView.value = []

  var data = {
    command: 'dir'
  }

  ;(async () => {
    const res = await http.filesystemRequest(data)
    if (res && res.success) {
      var json = JSON.parse(res.text)
      filesystemUsage.value = (json.used / json.total) * 100
      filesystemUsageText.value =
        'Total space ' +
        new Number(json.total / 1024).toFixed(1) +
        'kb, Free space ' +
        new Number(json.free / 1024).toFixed(1) +
        'kb, Used space ' +
        new Number(json.used / 1024).toFixed(1) +
        'kb'

      for (var f in json.files) {
        filesView.value.push(json.files[f].file)
      }
    }

    global.disabled = false
  })()
}
</script>
