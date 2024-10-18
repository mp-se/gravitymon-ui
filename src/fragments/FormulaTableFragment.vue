<template>
  <div class="row">
    <p></p>
    <hr />
  </div>

  <div class="row">
    <div class="form-text">
      Below is a list of calculated values based on the formula options, devaition from input value is also shown. 
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col" class="col-sm-1">Angle</th>
          <th scope="col" class="col-sm-1">Gravity</th>
          <th scope="col" class="col-sm-1">Order 1</th>
          <th scope="col" class="col-sm-1"></th>
          <th scope="col" class="col-sm-1">Order 2</th>
          <th scope="col" class="col-sm-1"></th>
          <th scope="col" class="col-sm-1">Order 3</th>
          <th scope="col" class="col-sm-1"></th>
          <th scope="col" class="col-sm-1">Order 4</th>
          <th scope="col" class="col-sm-1"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d,index) in config.formula_calculation_data" :key="index">
          <td>{{ Number(d.a).toFixed(3) }}</td>
          <td>{{ Number(d.g).toFixed(3) }}</td>
          <td>{{ Number(calculate(expressions['1'], d.a)).toFixed(3) }}</td><td>({{ Number(calculate(expressions['1'], d.a) - d.g).toFixed(3) }})</td>
          <td>{{ Number(calculate(expressions['2'], d.a)).toFixed(3) }}</td><td>({{ Number(calculate(expressions['2'], d.a) - d.g).toFixed(3) }})</td>
          <td>{{ Number(calculate(expressions['3'], d.a)).toFixed(3) }}</td><td>({{ Number(calculate(expressions['3'], d.a) - d.g).toFixed(3) }})</td>
          <td>{{ Number(calculate(expressions['4'], d.a)).toFixed(3) }}</td><td>({{ Number(calculate(expressions['4'], d.a) - d.g).toFixed(3) }})</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup>
import { config } from '@/modules/pinia'
import { calculate } from '@/modules/formula'

const expressions = defineModel('expressions') // Hold results from regression library
</script>