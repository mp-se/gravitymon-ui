<template>
  <div class="row">
    <p></p>
    <hr />
  </div>

  <div class="row">
    <div class="form-text">
      Below is a list of calculated values based on the formula options, devaition from input value
      is also shown.
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col" class="col-sm-1">Angle</th>
          <th scope="col" class="col-sm-1">Gravity</th>
          <th scope="col" class="col-sm-1">Order 1</th>
          <th scope="col" class="col-sm-1">({{ Number(maxDeviation.o1).toFixed(3) }})</th>
          <th scope="col" class="col-sm-1">Order 2</th>
          <th scope="col" class="col-sm-1">({{ Number(maxDeviation.o2).toFixed(3) }})</th>
          <th scope="col" class="col-sm-1">Order 3</th>
          <th scope="col" class="col-sm-1">({{ Number(maxDeviation.o3).toFixed(3) }})</th>
          <th scope="col" class="col-sm-1">Order 4</th>
          <th scope="col" class="col-sm-1">({{ Number(maxDeviation.o4).toFixed(3) }})</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d, index) in data" :key="index">
          <td>{{ d.a }}</td>
          <td>{{ d.g }}</td>
          <td>{{ d.o1 }}</td>
          <td>{{ d.o1d }}</td>
          <td>{{ d.o2 }}</td>
          <td>{{ d.o2d }}</td>
          <td>{{ d.o3 }}</td>
          <td>{{ d.o3d }}</td>
          <td>{{ d.o4 }}</td>
          <td>{{ d.o4d }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { config } from '@/modules/pinia'
import { calculate } from '@/modules/formula'

const expressions = defineModel('expressions') // Hold results from regression library
const data = ref([])
const maxDeviation = ref({ o1: 0, o2: 0, o3: 0, o4: 0 })

onMounted(() => {
  config.formula_calculation_data.forEach((d) => {
    if (d.a > 0) {
      var o1 = calculate(expressions.value['1'], d.a)
      var o2 = calculate(expressions.value['2'], d.a)
      var o3 = calculate(expressions.value['3'], d.a)
      var o4 = calculate(expressions.value['4'], d.a)

      var o1d = Math.abs(o1 - d.g)
      var o2d = Math.abs(o2 - d.g)
      var o3d = Math.abs(o3 - d.g)
      var o4d = Math.abs(o4 - d.g)

      data.value.push({
        a: Number(d.a).toFixed(3),
        g: Number(d.g).toFixed(3),
        o1: Number(o1).toFixed(3),
        o1d: Number(o1d).toFixed(3),
        o2: Number(o2).toFixed(3),
        o2d: Number(o2d).toFixed(3),
        o3: Number(o3).toFixed(3),
        o3d: Number(o3d).toFixed(3),
        o4: Number(o4).toFixed(3),
        o4d: Number(o4d).toFixed(3)
      })

      if (o1d > maxDeviation.value.o1) maxDeviation.value.o1 = o1d
      if (o2d > maxDeviation.value.o2) maxDeviation.value.o2 = o2d
      if (o3d > maxDeviation.value.o3) maxDeviation.value.o3 = o3d
      if (o4d > maxDeviation.value.o4) maxDeviation.value.o4 = o4d
    }
  })
})
</script>
