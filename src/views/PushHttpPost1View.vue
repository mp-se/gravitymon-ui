<template>
    <div class="container">
        <p></p>
        <p class="h3">Push - HTTP Post #1</p>
        <hr>

        <form @submit.prevent="save" class="needs-validation" novalidate>
            <div class="row">
                <div class="col-md-9">
                    <BsInputText v-model="config.http_push" type="url" maxlength="120" label="Http Post URL"
                        help="URL to push target, use format http://servername.com/resource (Supports http and https)"
                        :disabled="global.disabled" />
                </div>
                <div class="col-md-3">
                    <BsDropdown label="Predefined URLs" button="URL" :options="httpPostUrlOptions"
                        :callback="httpUrlCallback" :disabled="global.disabled" />
                </div>
                <div class="col-md-9">
                    <BsInputText v-model="config.http_push_h1" maxlength="120" pattern="(.+): (.+)"
                        label="Http Post Header #1"
                        help=""
                        :disabled="global.disabled" />
                </div>
                <div class="col-md-3">
                    <BsDropdown label="Predefined headers" button="Header" :options="httpHeaderOptions"
                        :callback="httpHeaderH1Callback" :disabled="global.disabled" />
                </div>
                <div class="col-md-9">
                    <BsInputText v-model="config.http_push_h2" maxlength="120" pattern="(.+): (.+)"
                        label="Http Post Header #2"
                        help="Set a http headers, empty string is skipped, example: Content-Type: application/json"
                        :disabled="global.disabled" />
                </div>
                <div class="col-md-3">
                    <BsDropdown label="Predefined headers" button="Header" :options="httpHeaderOptions"
                        :callback="httpHeaderH2Callback" :disabled="global.disabled" />
                </div>
                <div class="col-md-6">
                    <BsInputNumber v-model="config.http_int" label="Skip interval" min="0" max="5" width="4"
                        help="Defines how many sleep cycles to skip between pushing data to this target, 1 = every second cycle. Default is 0."
                        :disabled="global.disabled" />
                </div>
                <div class="col-md-9">
                    <BsInputTextArea v-model="config.http_format" rows="6" label="Push data format"
                        help="Format template used to create the data sent to the remote service"
                        :disabled="global.disabled" />
                </div>
                <div class="col-md-3">
                    <BsDropdown label="Predefined formats" button="Formats" :options="httpPostFormatOptions"
                        :callback="httpFormatCallback" :disabled="global.disabled" />
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
import { validateCurrentForm, httpHeaderOptions, httpPostUrlOptions, httpPostFormatOptions, applyTemplate } from "@/modules/utils"
import { global, status, config } from "@/modules/pinia"

const render = ref("")

const runTest = () => {
    const data = {
        format: "http_format"
    }

    global.clearMessages()
    config.runPushTest(data, (success) => {
    })
}

const httpUrlCallback = (opt) => {
    config.http_push = opt
}

const httpHeaderH1Callback = (opt) => {
    config.http_push_h1 = opt
}

const httpHeaderH2Callback = (opt) => {
    config.http_push_h2 = opt
}

const httpFormatCallback = (opt) => {
    config.http_format = decodeURIComponent(opt)
}

const renderFormat = () => {
    render.value = applyTemplate(status, config, config.http_format)
}

const save = () => {
    if (!validateCurrentForm()) return

    config.saveAll()
}
</script>
