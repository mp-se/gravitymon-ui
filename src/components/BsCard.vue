<template>
  <div class="card">
    <div class="card-header">{{ header }}</div>
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text">
        <!-- @slot Content of the card is placed via the slot -->
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script setup>
/**
 * Purpose: Show a card with header, title and content. 
 */
defineOptions({
  inheritAttrs: false
})
/**
 * Text to be displayed in the header of the Card 
 */
const header = defineModel('header')
/**
 * Title shown in the top of the card body.
 */
 const title = defineModel('title')
</script>