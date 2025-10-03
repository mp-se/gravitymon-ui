<template>
  <BsInputBase :width="width" :label="label" :help="help" :badge="badge">
    <select v-model="model" class="form-select" :disabled="disabled" v-bind="$attrs">
      <template v-for="o in options" :key="o.value">
        <option v-if="o.value === model" selected :value="o.value">
          <IconWifi />{{ o.label }}
        </option>
        <option v-else :value="o.value">{{ o.label }}</option>
      </template>
    </select>
  </BsInputBase>
</template>

<script setup>
import IconWifi from '@/components/IconWifi.vue'
/**
 * 2024-05-28 Bootstrap VueJS wrapper, Magnus Persson
 */

/**
 * Purpose: Provide a select option
 */
defineOptions({
  inheritAttrs: false
})
/**
 * Ref to bind value to (required).
 */
const model = defineModel({
  type: [String, Number, Boolean],
  default: null
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
  default: undefined,
  validator: (value) => {
    if (value === undefined || value === null) return true
    if (typeof value === 'number') return value > 0 && value <= 12
    if (typeof value === 'string') return /^(\d|1[0-2])$|^(sm|md|lg|xl|xxl)-(\d|1[0-2])$/.test(value)
    return false
  }
})

/**
 * Options for the dropdown in the format [ { label: "label", value: "value" } ]
 * Label is displayed in the list and value is stored in the bound ref (required).
 */
const options = defineModel('options', {
  type: Array,
  default: () => [],
  validator: (options) => {
    return options.every(option => 
      option && typeof option === 'object' && 
      'label' in option && 'value' in option
    )
  }
})

/**
 * Ref that steers if this component is enabled or not (optional).
 */
const disabled = defineModel('disabled', {
  type: Boolean,
  default: false
})

/**
 * Specify if an badge should be shown to guide the user (optional).
 */
const badge = defineModel('badge', {
  type: Boolean,
  default: false
})
</script>
