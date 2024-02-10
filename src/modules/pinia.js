import { ref } from 'vue'
import { createPinia } from "pinia"
import { useGlobalStore } from "@/modules/globalStore"
import { useStatusStore } from '@/modules/statusStore'
import { useConfigStore } from "@/modules/configStore"

export const piniaInstance = createPinia()

const config = useConfigStore(piniaInstance)
const global = useGlobalStore(piniaInstance)
const status = useStatusStore(piniaInstance)

export { global, status, config }

const configCompare = ref(null)

const saveConfigState = () => {
    console.log("Saving state")

    configCompare.value = {}
    for (var key in config) {
        if( typeof(config[key]) !== "function" && key !== "$id") {
            if(key === "gyro_calibration_data") {
                // Skip this, read only on UI                
            } else if(key === "formula_calculation_data") {
                configCompare.value[key] = []
                for(var i in config[key]) {
                    var o = { a: config[key][i].a, g: config[key][i].g }
                    configCompare.value[key].push(o)
                }
            } else {
                configCompare.value[key] = config[key]
            }
        }
    }

    console.log("Saved state: ", configCompare.value)
    global.configChanged = false
}

const getConfigChanges = () => {
    var changes = {}

    if (configCompare.value === null) {
        console.log("configState not saved")
        return changes
    }

    for (var key in configCompare.value) {
        if(key === "gyro_calibration_data") {
            // Skip this, read only on UI                
        } else if(key === "formula_calculation_data") {
            for(var i in configCompare.value[key]) {
                if (configCompare.value[key][i].a != config[key][i].a) {
                    changes.formula_calculation_data = config.formula_calculation_data
                }        
                if (configCompare.value[key][i].g != config[key][i].g) {
                    changes.formula_calculation_data = config.formula_calculation_data
                }        
            }
        } else {
            if (configCompare.value[key] != config[key]) {
                changes[key] = config[key]
            }    
        }
    }

    return changes
}

config.$subscribe((mutation, state) => {
    if(!global.initialized)
        return

    var changes = getConfigChanges()
    console.log("State change on configStore", changes)

    if(JSON.stringify(changes).length > 2) {
        global.configChanged = true        
        console.log("Changed properties:", changes)
    }
})

export { saveConfigState, getConfigChanges }