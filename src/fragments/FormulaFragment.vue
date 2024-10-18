<template>
  <div class="row">
    <p></p>
    <hr />
  </div>

  <div class="row">
    <div class="form-text">
      Below is a list of the generated formulas.
    </div>
  </div>

  <div class="row">
    <div class="col-md-12" v-for="(i, index) in expressions" :key="index">
      <BsInputReadonly
        :label="'Formula order ' + index"
        v-model="expressions[index]"
        v-if="expressions[index] != ''"
      ></BsInputReadonly>
      <BsInputReadonly
        :label="'Formula order ' + index"
        v-model="rejected"
        v-if="expressions[index] == ''"
      ></BsInputReadonly>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BsInputReadonly from '@/components/BsInputReadonly.vue'

const expressions = defineModel('expressions') // Hold results from regression library
const rejected = ref('Formula rejected')
</script>
