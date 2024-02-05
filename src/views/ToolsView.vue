<template>
  <div class="container">
    <p></p>
    <p class="h3">Tools</p>
    <hr>

    <h5>Calculate a new voltage factor</h5>
    <div class="row">
      <div class="col-md-4">
        <BsInputNumber v-model="measuredVoltage" label="Measured voltage" min="0" max="6" step=".01" width="4" unit="V"
          :unit="voltage" help="Enter the measured voltage on the device" :disabled="global.disabled">
        </BsInputNumber>
      </div>
      <div class="col-md-4">
        <BsInputReadonly v-model="status.battery" unit="V" label="Last voltage reading" width="4"
          help="Last measured battery voltage" :disabled="global.disabled"></BsInputReadonly>
      </div>
      <div class="col-md-4">
        <BsInputReadonly v-model="config.voltage_factor" label="Current voltage factor" width="4"
          help="Current voltage factor" :disabled="global.disabled"></BsInputReadonly>
      </div>
    </div>

    <div class="row gy-4">
      <div class="col-md-12">
      </div>
      <div class="col-md-3">
        <button @click="calculateFactor" type="button" class="btn btn-secondary" :disabled="global.disabled">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
            :hidden="!global.disabled"></span>
          &nbsp;Calculate factor
        </button>
      </div>
    </div>

    <div class="row gy-4">
      <p></p>
      <hr>
    </div>  

    <h5>Explore the file system</h5>
    <div class="row gy-4">

      <div class="col-md-3">
        <button @click="listFiles" type="button" class="btn btn-secondary" :disabled="global.disabled">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
            :hidden="!global.disabled"></span>
          &nbsp;List files
        </button>
      </div>

      <div class="col-md-6">
        <div class="button-group">
          <template v-for="f in files">
          <button type="button" @click.prevent="fetchFile(f)" class="btn btn-outline-primary" href="#" :disabled="global.disabled">{{ f }}</button>&nbsp;
        </template>
        </div>
      </div>

      <div v-if="fileData !== null" class="col-md-12">
        <h6>File contents</h6>
        <pre class="border p-2">{{ fileData }}</pre>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { global, config, status, saveConfigState } from "@/modules/pinia"
import { isValidJson, isValidFormData, isValidMqttData } from "@/modules/utils"

const measuredVoltage = ref(0)
const files = ref([])
const fileData = ref(null)

const calculateFactor = () => {
  global.disabled = true
  global.clearMessages()

  var mv = parseFloat(measuredVoltage.value)

  if (isNaN(mv)) {
    global.messageError = "Not a valid measurement"
    return
  }

  config.voltage_factor = parseFloat(mv / (status.battery / config.voltage_factor)).toFixed(2);

  config.sendConfig((success) => {
    saveConfigState()
    global.disabled = true
    setTimeout(() => {
      status.load((success) => {
        console.log(status.battery)
        global.messageInfo = "New factor applied, check if the current battery reading is correct"
        global.disabled = false
      }, 1000)
    })
  })
}
const fetchFile = (f) => {
  global.disabled = true
  global.clearMessages()

  fileData.value = null

  var data = {
    command: "get",
    file: f
  }

  config.sendFilesystemRequest(data, (success, text) => {
    if (success) {

      if(isValidJson(text))
        fileData.value = JSON.stringify(JSON.parse(text), null, 2)
      else if(isValidFormData(text))
        fileData.value = text.replaceAll('&', '&\n\r')
      else if(isValidMqttData(text))
        fileData.value =  text.replaceAll('|', '|\n\r')
      else 
        fileData.value = text
    }

    global.disabled = false
  })
}

const listFiles = () => {
  global.disabled = true
  global.clearMessages()

  files.value = []

  var data = {
    command: "dir"
  }

  config.sendFilesystemRequest(data, (success, text) => {
    if (success) {
      var json = JSON.parse(text)
      files.value = json.files
    }

    global.disabled = false
  })
}

// TODO: Hardware testing ?

</script>