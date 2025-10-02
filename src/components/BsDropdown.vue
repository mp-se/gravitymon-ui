<template>
  <BsInputBase :width="width" :label="label" :help="help" :badge="badge">
    <div class="dropdown">
      <button
        class="btn btn-outline-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        :disabled="disabled"
      >
        {{ button }}
      </button>
      <ul class="dropdown-menu">
        <template v-for="o in options" :key="o.value">
          <li>
            <a class="dropdown-item" @click="callback(o.value)">{{ o.label }}</a>
          </li>
        </template>
      </ul>
    </div>
  </BsInputBase>
</template>

<script setup>
/**
 * 2024-05-28 Bootstrap VueJS wrapper, Magnus Persson
 */

/**
 * Purpose: Show a drop down button with options
 */
defineOptions({
  inheritAttrs: false
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
 * Text on the drop down button (required).
 */
const button = defineModel('button', {
  type: String,
  default: 'Select'
})

/**
 * Callback when the option is selected (optional).
 */
const callback = defineModel('callback', {
  type: Function,
  default: () => {}
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
