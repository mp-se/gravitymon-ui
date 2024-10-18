<template>
  <div class="row">
    <p></p>
    <hr />
  </div>

  <div class="row">
    <div class="form-text">
      Below is a graphical representation of the formula options, click on the color to deselect one
      or more of the formulas. If you dont see more than one, try to reduce the deviation to dismiss
      invalid formulas.
    </div>
  </div>

  <div class="row">
    <p></p>

    <BsMessage v-if="!chart" dismissable="false" message="" alert="danger">
      Unable to load chart.js from https://cdn.jsdelivr.net, check your internet connection
    </BsMessage>
    <canvas id="formulaChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { config } from '@/modules/pinia'
import { logError } from '@/modules/logger'
import { evaluateFormula } from '@/modules/formula'

const chart = ref(null)

const expressions = defineModel('expressions') // Hold results from regression library

const chartDataForm = ref([])
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
})

const configChart = ref({
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
})

onMounted(() => {
  // TODO: ChartJS does not render if i just copy the result, figure out why...

  if (expressions.value['1'] != '') {
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
  }
})
</script>

<style></style>
