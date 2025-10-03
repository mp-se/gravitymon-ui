<template>
  <div :class="classNames()" role="alert">
    <IconXCircle v-if="alert === 'danger'" height="20" width="20"></IconXCircle>
    <IconExclamationTriangle
      v-if="alert === 'warning'"
      height="20"
      width="20"
    ></IconExclamationTriangle>
    <IconInfoCircle v-if="alert === 'info'" height="20" width="20"></IconInfoCircle>
    <IconCheckCircle v-if="alert === 'success'" height="20" width="20"></IconCheckCircle>
    &nbsp;{{ message }}
    <!-- @slot mesage can be provided using a slot or message attribute -->
    <slot />
    <button
      v-if="dismissable && close !== undefined"
      @click="close(alert)"
      type="button"
      class="btn-close"
      aria-label="Close"
    ></button>
    <button
      v-if="dismissable && close === undefined"
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
    ></button>
  </div>
</template>

<script setup>
import IconXCircle from '@/components/IconXCircle.vue'
import IconCheckCircle from '@/components/IconCheckCircle.vue'
import IconInfoCircle from '@/components/IconInfoCircle.vue'
import IconExclamationTriangle from '@/components/IconExclamationTriangle.vue'

/**
 * 2024-05-28 Bootstrap VueJS wrapper, Magnus Persson
 */

/**
 * Purpose: Show a alert with a message
 */
defineOptions({
  inheritAttrs: false
})
/**
 * Text message to show in alert (required).
 */
const message = defineModel('message', {
  type: String,
  default: 'Message',
  validator: (value) => {
    return typeof value === 'string'
  }
})

/**
 * If set to 'true' then the message can be closed by the user (optional).
 */
const dismissable = defineModel('dismissable', {
  type: [Boolean, String],
  default: false,
  validator: (value) => {
    if (typeof value === 'boolean') return true
    if (typeof value === 'string') return ['true', 'false'].includes(value.toLowerCase())
    return false
  }
})

/**
 * The type of the alert (Danger|Success|Warning|Info) (required).
 */
const alert = defineModel('alert', {
  type: String,
  default: 'info',
  validator: (value) => ['danger', 'success', 'warning', 'info'].includes(value.toLowerCase())
})

/**
 * Function to call when close button is used (optional).
 */
const close = defineModel('close', {
  type: Function,
  default: () => {},
  validator: (value) => {
    return typeof value === 'function'
  }
})

const classNames = () => {
  const cn = dismissable.value
    ? 'alert alert-' + alert.value + ' align-items-center alert-dismissible fade show'
    : 'alert alert-' + alert.value + ' align-items-center'
  return cn
}
</script>
