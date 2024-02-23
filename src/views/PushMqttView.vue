<template>
    <div class="container">
        <p></p>
        <p class="h3">Push - MQTT</p>
        <hr>

        <form @submit.prevent="save" class="needs-validation" novalidate>
            <div class="row">
                <div class="col-md-9">
                    <BsInputText v-model="config.mqtt_target" maxlength="120" label="Server"
                        help="Name of server to connect to, use format servername.com" :disabled="global.disabled" />
                </div>
                <div class="col-md-3">
                    <BsInputNumber v-model="config.mqtt_port" label="Port" min="0" max="65535"
                        help="Port number, 1883 is standard. Ports above 8000 means SSL" :disabled="global.disabled" />
                </div>
                <div class="col-md-6">
                    <BsInputText v-model="config.mqtt_user" maxlength="20" label="User name"
                        help="Username to use. Leave blank if authentication is disabled" :disabled="global.disabled" />
                </div>
                <div class="col-md-6">
                    <BsInputText v-model="config.mqtt_pass" type="password" maxlength="20" label="Password"
                        help="Password to use. Leave blank if authentication is disabled" :disabled="global.disabled" />
                </div>
                <div class="col-md-6">
                    <BsInputNumber v-model="config.mqtt_int" label="Skip interval" min="0" max="5" width="4"
                        help="Defines how many sleep cycles to skip between pushing data to this target, 1 = every second cycle. Default is 0."
                        :disabled="global.disabled" />
                </div>
                <div class="col-md-9">
                    <BsInputTextAreaFormat v-model="config.mqtt_format" rows="6" label="Push data format"
                        help="Format template used to create the data sent to the remote service"
                        :disabled="global.disabled" />
                </div>
                <div class="col-md-3">
                    <BsDropdown label="Predefined formats" button="Formats" :options="mqttFormatOptions"
                        :callback="mqttFormatCallback" :disabled="global.disabled" />
                    <BsModal @click="renderFormat" v-model="render" :code="true" title="Format preview"
                        button="Preview format" :disabled="global.disabled" />
                </div>
            </div>
            <div class="row gy-2">
                <div class="col-md-12">
                    <hr>
                </div>
                <div class="col-md-3">
                    <button type="submit" class="btn btn-primary w-2" :disabled="global.disabled || !global.configChanged">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                            :hidden="!global.disabled"></span>
                        &nbsp;Save
                    </button>
                </div>
                <div class="col-md-3">
                    <button @click="runTest" type="button" class="btn btn-secondary" :disabled="global.disabled">
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
import { ref } from 'vue'
import { validateCurrentForm, applyTemplate, mqttFormatOptions } from "@/modules/utils"
import { global, status, config } from "@/modules/pinia"

const render = ref("")

const runTest = () => {
    const data = {
        format: "mqtt_format"
    }

    global.clearMessages()
    config.runPushTest(data, (success) => {
    })
}

const mqttFormatCallback = (opt) => {
    config.mqtt_format = decodeURIComponent(opt)
}

const renderFormat = () => {
    render.value = applyTemplate(status, config, config.mqtt_format)
}

const save = () => {
    if (!validateCurrentForm()) return

    config.saveAll()
}
</script>
