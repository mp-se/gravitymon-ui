import { ref, toRaw } from 'vue'
import { createPinia } from 'pinia'
import { useGlobalStore } from '@/modules/globalStore'
import { useStatusStore } from '@/modules/statusStore'
import { useConfigStore } from '@/modules/configStore'
import { logInfo } from '@mp-se/espframework-ui-components'

const piniaInstance = createPinia()

export default piniaInstance

const config = useConfigStore(piniaInstance)
const global = useGlobalStore(piniaInstance)
const status = useStatusStore(piniaInstance)

export { global, status, config }

const configCompare = ref(null)

const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true
  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    typeof obj2 === 'undefined' ||
    obj2 === null
  )
    return false
  var keys1 = Object.keys(obj1)
  var keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) return false
  for (var key of keys1) {
    if (!deepEqual(obj1[key], obj2[key])) return false
  }
  return true
}

const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item))
  var cloned = {}
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

const saveConfigState = () => {
  logInfo('pinia.saveConfigState()', 'Saving state')

  configCompare.value = {}
  const state = toRaw(config.$state)
  for (var key in state) {
    configCompare.value[key] = deepClone(state[key])
  }

  logInfo('pinia.saveConfigState()', 'Saved state: ', configCompare.value)
  global.configChanged = false
}

const getConfigChanges = () => {
  var changes = {}

  if (configCompare.value === null) {
    logInfo('pinia.getConfigChanges()', 'configState not saved')
    return changes
  }

  const state = toRaw(config.$state)

  for (var key in configCompare.value) {
    if (!deepEqual(configCompare.value[key], state[key])) {
      changes[key] = state[key]
    }
  }

  return changes
}

config.$subscribe(() => {
  if (!global.initialized) return

  var changes = getConfigChanges()
  logInfo('pinia.subscribe()', 'State change on configStore', changes)

  if (Object.keys(changes).length > 0) {
    global.configChanged = true
    logInfo('pinia.subscribe()', 'Changed properties:', changes)
  } else {
    global.configChanged = false
  }
})

export { saveConfigState, getConfigChanges }
