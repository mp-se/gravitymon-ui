<template>
  <button
    v-bind="$attrs"
    type="button"
    class="btn btn-secondary"
    data-bs-toggle="modal"
    :data-bs-target="'#modal' + $.uid"
  >
    {{ button }}
  </button>

  <div class="modal fade modal-lg" :id="'modal' + $.uid" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content p-4">
        <div class="modal-header">
          <h1 class="modal-title fs-5">{{ title }}</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <template v-if="checkCode()">
            <pre>{{ format(model) }}</pre>
          </template>
          <template v-else>
            {{ model }}
          </template>
          <div v-if="jsonError != ''">
            <hr />
            <p class="text-danger">{{ jsonError }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { isValidJson, isValidFormData } from '@/modules/utils'
import parseJson from 'json-parse-even-better-errors'

const jsonError = ref('')

/**
 * Purpose: Show a button that activates a modal with close button, title and content. Support json pretty.
 */
defineOptions({
  inheritAttrs: false
})

/**
 * Ref to fetch data from (required).
 */
const model = defineModel({
  type: [String, Object, Array],
  default: ''
})

/**
 * Text on button that activates the modal (required).
 */
const button = defineModel('button', {
  type: String,
  default: 'Open Modal'
})

/**
 * Modal title (required).
 */
const title = defineModel('title', {
  type: String,
  default: 'Modal'
})

/**
 * If json errors should be detected (optional).
 */
const json = defineModel('json', {
  type: Boolean,
  default: false
})

/**
 * Force mqtt format (optional).
 */
const mqtt = defineModel('mqtt', {
  type: Boolean,
  default: false
})

const format = (s) => {
  if (mqtt.value) return s

  if (isValidJson(model.value)) return JSON.stringify(JSON.parse(s), null, 2)
  if (isValidFormData(model.value)) return s.replaceAll('&', '&\n\r')
  return s
}

const checkCode = () => {
  jsonError.value = ''

  if (mqtt.value) {
    if (json.value) {
      const input = model.value
      const arr = input.replaceAll('\n', '').split('|')

      arr.forEach((value) => {
        const data = value.substring(value.indexOf(':') + 1)

        if (data.indexOf('{') >= 0 && data.indexOf('}') > 0) {
          try {
            // Will show additional json parse errors if enabled
            parseJson(data)
          } catch (e) {
            jsonError.value = e.message
          }
        }
      })
    }

    return true
  }

  if (isValidFormData(model.value)) return true

  if (isValidJson(model.value)) {
    return true
  } else if (json.value) {
    try {
      // Will show additional json parse errors if enabled
      parseJson(model.value)
    } catch (e) {
      jsonError.value = e.message
    }
  }

  return false
}
</script>
