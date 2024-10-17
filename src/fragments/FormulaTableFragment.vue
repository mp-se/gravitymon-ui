<template>
  <div class="row">
    <p></p>
    <hr />
  </div>

  <div class="row">
    <div class="form-text">
      Below is a list of calculated values based on the formula options, click on the color to deselect one
      or more of the formulas. 
    </div>


    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col" class="col-sm-2">Angle</th>
          <th scope="col" class="col-sm-2">Gravity</th>
          <th scope="col" class="col-sm-2">Order 1</th>
          <th scope="col" class="col-sm-2">Order 2</th>
          <th scope="col" class="col-sm-2">Order 3</th>
          <th scope="col" class="col-sm-2">Order 4</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d,index) in config.formula_calculation_data" :key="index">
          <td>{{ Number(d.a).toFixed(3) }}</td>
          <td>{{ config.gravity_format != 'P' ? Number(d.g).toFixed(3) : Number(convertToPlato(d.g)).toFixed(3) }}</td>
          <td>{{ Number(calculate(expressions['1'], d.a)).toFixed(3) }}</td>
          <td>{{ Number(calculate(expressions['2'], d.a)).toFixed(3) }}</td>
          <td>{{ Number(calculate(expressions['3'], d.a)).toFixed(3) }}</td>
          <td>{{ Number(calculate(expressions['4'], d.a)).toFixed(3) }}</td>
        </tr>
      </tbody>
    </table>

  </div>

  <div class="row">
    <p></p>
    <BsMessage v-if="!chart" dismissable="false" message="" alert="danger">
      Unable to load chart.js from https://cdn.jsdelivr.net, check your internet connection
    </BsMessage>
    <canvas id="formulaChart"></canvas>
  </div>

  <!--
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
  -->
</template>

<script setup>
import { onMounted } from 'vue'
import { config } from '@/modules/pinia'
import { calculate } from '@/modules/formula'
import { convertToPlato } from '@/modules/utils';
//import BsInputReadonly from '@/components/BsInputReadonly.vue'

//const chart = ref(null)

const expressions = defineModel('expressions') // Hold results from regression library
//const rejected = ref('Formula rejected')

/*const chartDataForm = ref([])
const chartDataOrder1 = ref([])
const chartDataOrder2 = ref([])
const chartDataOrder3 = ref([])
const chartDataOrder4 = ref([])

const dataSetChart = ref({
  datasets: [
    {
      label: 'Raw data',
      borderColor: 'blue',
      backgroundColor: 'blue',
      data: chartDataForm.value
    },
    {
      label: 'Order 1',
      borderColor: 'green',
      backgroundColor: 'green',
      data: chartDataOrder1.value,
      hidden: false
    },
    {
      label: 'Order 2',
      borderColor: 'purple',
      backgroundColor: 'purple',
      data: chartDataOrder2.value,
      hidden: false
    },
    {
      label: 'Order 3',
      borderColor: 'orange',
      backgroundColor: 'orange',
      data: chartDataOrder3.value,
      hidden: false
    },
    {
      label: 'Order 4',
      borderColor: 'pink',
      backgroundColor: 'pink',
      data: chartDataOrder4.value,
      hidden: false
    }
  ]
})*/

/*const configChart = ref({
  type: 'line',
  data: dataSetChart.value,
  options: {
    responsive: true,
    interaction: {
      intersect: false
    },
    scales: {
      x: {
        display: true,
        type: 'linear',
        grace: '5%',
        title: {
          display: true,
          text: 'Angle'
        },
        ticks: {
          crossAlign: 'far'
        },
        suggestedMin: 25
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Gravity'
        },
        suggestedMin: 1.0
      }
    }
  }
})*/

onMounted(() => {
  // TODO: ChartJS does not render if i just copy the result, figure out why...

/*  if (expressions.value['1'] != '') {
    evaluateFormula(expressions.value['1']).forEach((p) => {
      chartDataOrder1.value.push(p)
    })
  } else {
    dataSetChart.value.datasets[1].hidden = true
  }

  if (expressions.value['2'] != '') {
    evaluateFormula(expressions.value['2']).forEach((p) => {
      chartDataOrder2.value.push(p)
    })
  } else {
    dataSetChart.value.datasets[2].hidden = true
  }

  if (expressions.value['3'] != '') {
    evaluateFormula(expressions.value['3']).forEach((p) => {
      chartDataOrder3.value.push(p)
    })
  } else {
    dataSetChart.value.datasets[3].hidden = true
  }

  if (expressions.value['4'] != '') {
    evaluateFormula(expressions.value['4']).forEach((p) => {
      chartDataOrder4.value.push(p)
    })
  } else {
    dataSetChart.value.datasets[4].hidden = true
  }

  for (let i = 0; i < config.formula_calculation_data.length; i++) {
    if (config.formula_calculation_data[i].a > 0)
      chartDataForm.value.push({
        x: config.formula_calculation_data[i].a,
        y: config.formula_calculation_data[i].g
      })
  }

  try {
    chart.value = new Chart(document.getElementById('formulaChart'), configChart.value)
  } catch (err) {
    logError('GravityAnalysisView.onMounted()', err)
  }*/
})
</script>

<style></style>
