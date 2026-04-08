<!--
  Copyright (c) 2021-2026 Magnus Persson
  https://github.com/mp-se/gravitymon | https://github.com/mp-se/gravitymon-ui

  Licensed under the GNU General Public License v3.0 (GPL v3) for open source use,
  or a Commercial License for proprietary use. See LICENSE and LICENSE_COMMERCIAL.
-->
<template>
  <div class="row">
    <p></p>
    <hr />
  </div>

  <div class="row">
    <div class="form-text">Below is a list of the generated formulas.</div>
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

/**
 * Hold results from regression library.
 */
const expressions = defineModel('expressions', {
  type: Array,
  default: () => []
}) // Hold results from regression library
const rejected = ref('Formula rejected')
</script>
