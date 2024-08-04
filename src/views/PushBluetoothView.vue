<template>
    <div class="container">
        <p></p>
        <p class="h3">Push - Bluetooth</p>
        <hr>

        <template v-if="status.platform !== 'esp8266' && status.platform !== 'esp32s2'">
            <form @submit.prevent="save" class="needs-validation" novalidate>
                <div class="row">
                    <div class="col-md-12">
                        <BsInputRadio v-model="config.ble_tilt_color" :options="bleTiltColorOptions" label="Tilt color"
                            help="Tilt color beacon. Only used when tilt type is selected." :disabled="tilt" />
                    </div>
                    <div class="col-md-12">
                        <BsInputRadio v-model="config.ble_format" :options="bleFormatOptions"
                            label="Bluetooth data format" help="Select the type of bluetooth transmission used."
                            :disabled="global.disabled32" />
                    </div>
                    <div class="col-md-12">
                        <p></p>
                        <p>Changing bluetooth settings might require a restart to function properly</p>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-md-12">
                        <hr>
                    </div>
                    <div class="col-md-3">
                        <button type="submit" class="btn btn-primary w-2"
                            :disabled="global.disabled32 || !global.configChanged">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                                :hidden="!global.disabled32"></span>
                            &nbsp;Save
                        </button>
                    </div>
                </div>
            </form>
        </template>
        <template v-else>
            <div class="row">
                <div class="col-md-12">
                    <p>Bluetooth is not available on this platform</p>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { validateCurrentForm } from "@/modules/utils"
import { global, config, status } from "@/modules/pinia"
import { logDebug, logError, logInfo } from '@/modules/logger'

const bleTiltColorOptions = ref([
    { label: 'red', value: 'red' },
    { label: 'green', value: 'green' },
    { label: 'black', value: 'black' },
    { label: 'purple', value: 'purple' },
    { label: 'orange', value: 'orange' },
    { label: 'blue', value: 'blue' },
    { label: 'yellow', value: 'yellow' },
    { label: 'pink', value: 'pink' },
]);

const bleFormatOptions = ref([
    { label: 'Disabled', value: 0 },
    { label: 'Tilt iBeacon', value: 1 },
    { label: 'Tilt PRO iBeacon', value: 2 },
    { label: 'Gravitymon iBeacon', value: 5 },
    // { label: 'Gravitymon Service', value: 3 },
    { label: 'Gravitymon Eddystone', value: 4 },
]);

const tilt = computed(() => {
    if (global.disabled32)
        return global.disabled32

    if (config.ble_format == 1 || config.ble_format == 2)
        return false

    return true
})

const save = () => {
    if((config.ble_format == 1 || config.ble_format == 2) && config.ble_tilt_color == "") {
        config.ble_tilt_color = "red"
    }

    if (!validateCurrentForm()) return

    global.clearMessages()
    config.saveAll()
}
</script>
