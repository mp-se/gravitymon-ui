<template>
  <BsInputBase :width="width" :label="label" :help="help" :badge="badge">
    <div class="btn-group" role="group">
      <template v-for="o in options" :key="o.value">
        <input
          type="radio"
          class="btn-check"
          v-model="model"
          :value="o.value"
          :name="'radio' + $.uid"
          :id="'radio' + $.uid + o.value"
          :disabled="disabled"
        />
        <label class="btn btn-outline-primary" :for="'radio' + $.uid + o.value">{{
          o.label
        }}</label>
      </template>
    </div>
  </BsInputBase>
</template>

<script setup>
/**
 * 2024-05-28 Bootstrap VueJS wrapper, Magnus Persson
 */

/**
 * Purpose: Show a selector with a number of options.
 */
defineOptions({
  inheritAttrs: false
})
/**
 * This is the v-model field that will be used to bind the component to (required).
 */
const model = defineModel({
  type: [String, Number, Boolean],
  default: null
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
 * Ref that steers if this component is enabled or not (required).
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
