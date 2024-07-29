<template>
    <div class="container">
        <p></p>
        <p class="h3">Push - Influxdb v2</p>
        <hr>

        <form @submit.prevent="save" class="needs-validation" novalidate :disabled="config.use_wifi_direct">
            <div class="row">
                <div class="col-md-12">
                    <BsInputText v-model="config.influxdb2_target" type="url" maxlength="120" label="Server"
                        help="URL to push target, use format http://servername.com/resource (Supports http and https)"
                        :disabled="pushDisabled" />
                </div>
                <div class="col-md-6">
                    <BsInputText v-model="config.influxdb2_org" maxlength="50" label="Organisation"
                        help="Identifier to what organisation to use" :disabled="pushDisabled" />
                </div>
                <div class="col-md-6">
                    <BsInputText v-model="config.influxdb2_bucket" maxlength="50" label="Bucket"
                        help="Identifier for the data bucket to use" :disabled="pushDisabled" />
                </div>
                <div class="col-md-6">
                    <BsInputText v-model="config.influxdb2_token" type="password" maxlength="100" label="Authentication token"
                        help="Authentication token for accessing data bucket" :disabled="pushDisabled" />
                </div>
                <div class="col-md-6">
                    <BsInputNumber v-model="config.influxdb2_int" label="Skip interval" min="0" max="5" width="4"
                        help="Defines how many sleep cycles to skip between pushing data to this target, 1 = every second cycle. Default is 0."
                        :disabled="pushDisabled" />
                </div>
                <div class="col-md-9">
                    <BsInputTextAreaFormat v-model="config.influxdb2_format" rows="6" label="Data format"
                        help="Format template used to create the data sent to the remote service"
                        :disabled="pushDisabled" />
                </div>
                <div class="col-md-3 gy-2">
                    <BsDropdown label="Predefined formats" button="Formats" :options="influxdb2FormatOptions"
                        :callback="influxdb2FormatCallback" :disabled="pushDisabled" />
                    <BsModal @click="renderFormat" v-model="render" :code="true" title="Format preview"
                        button="Preview format" :disabled="pushDisabled" />
                </div>
            </div>
            <div class="row gy-2">
                <div class="col-md-12">
                    <hr>
                </div>
                <div class="col-sm-3">
                    <button type="submit" class="btn btn-primary w-2" :disabled="global.disabled || !global.configChanged">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                            :hidden="!global.disabled"></span>
                        &nbsp;Save
                    </button>
                </div>
                <div class="col-md-3">
                    <button @click="runTest" type="button" class="btn btn-secondary" :disabled="pushDisabled">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                            :hidden="!global.disabled"></span>
                        &nbsp;Run push test
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { validateCurrentForm, applyTemplate, influxdb2FormatOptions } from "@/modules/utils"
import { global, status, config } from "@/modules/pinia"
import { logDebug, logError, logInfo } from '@/modules/logger'

const render = ref("")

const pushDisabled = computed(() => {
    return global.disabled || config.use_wifi_direct
})

const runTest = () => {
    const data = {
        push_format: "influxdb2_format"
    }

    global.clearMessages()
    config.runPushTest(data, (success) => {
    })
}

const influxdb2FormatCallback = (opt) => {
    config.influxdb2_format = decodeURIComponent(opt)
}

const renderFormat = () => {
    render.value = applyTemplate(status, config, config.influxdb2_format)
}

const save = () => {
    if (!validateCurrentForm()) return

    config.saveAll()
}
</script>
