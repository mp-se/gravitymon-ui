<template>
  <div :class="classNames()" role="alert">
    &nbsp;{{ message }}
    <!-- @slot mesage can be provided using a slot or message attribute -->
    <slot />
    <button v-if="dismissable" @click="close(alert)" type="button" class="btn-close" aria-label="Close"></button>
  </div>
</template>

<script setup>
/**
 * Purpose: Show a alert with a message
 */
defineOptions({
  inheritAttrs: false
})
/**
 * Text message to show in alert (required).
 */
const message = defineModel('message')
/**
 * If set to 'true' then the message can be closed by the user (optional).
 */
const dismissable = defineModel('dismissable')
/**
 * The type of the alert (see bootstrap documentation for types) (required).
 */
const alert = defineModel('alert')
/**
 * Function to call when close button is used (optional).
 */
const close = defineModel('close')

function classNames() {
  const cn = dismissable.value ? "alert alert-" + alert.value + " align-items-center alert-dismissible fade show" : "alert alert-" + alert.value + " align-items-center"
  return cn
}
</script>
