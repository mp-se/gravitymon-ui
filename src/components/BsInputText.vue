<template>
  <BsInputBase :width="width" :label="label" :help="help" :badge="badge">
    <div class="input-group">
      <input
        v-model="model"
        class="form-control"
        :type="type === undefined || flag ? 'text' : type"
        v-bind="$attrs"
        data-bs-toggle="tooltip"
        data-bs-custom-class="custom-tooltip"
        :data-bs-title="help"
      />
      <span v-if="type === 'password'" class="input-group-text">
        <IconEye v-if="!flag" @click="toggle" width="1rem" height="1rem"></IconEye>
        <IconEyeSlash v-if="flag" @click="toggle" width="1rem" height="1rem"></IconEyeSlash>
      </span>
    </div>
  </BsInputBase>
</template>

<script setup>
import IconEyeSlash from '@/components/IconEyeSlash.vue'
import IconEye from '@/components/IconEye.vue'
/**
 * 2024-05-28 Bootstrap VueJS wrapper, Magnus Persson
 */

import { ref } from 'vue'
/**
 * Purpose: Proviude an input field
 */
defineOptions({
  inheritAttrs: false
})
/**
 * This is the v-model field that will be used to bind the component to (required).
 */
const model = defineModel({
  type: [String, Number],
  default: ''
})

/**
 * This text is shown above the form component (optional).
 */
const label = defineModel('label', {
  type: String,
  default: undefined
})

/**
 * Help text is shown below the field to provide user help with input (optional).
 */
const help = defineModel('help', {
  type: String,
  default: undefined
})

/**
 * Specify the width to force a specific size (optional).
 */
const width = defineModel('width', {
  type: [String, Number],
  default: undefined
})

/**
 * Type of the input field, defaults to 'text' (optional, 'password' or 'text').
 */
const type = defineModel('type', {
  type: String,
  default: 'text',
  validator: (value) => ['text', 'password', 'email', 'url'].includes(value)
})

/**
 * Specify if an badge should be shown to guide the user (optional).
 */
const badge = defineModel('badge', {
  type: Boolean,
  default: false
})
/**
 * Used internally to toggle field visibility between text / password
 */
const flag = ref(false)

const toggle = () => {
  flag.value = !flag.value
}
</script>
