<template>
  <div class="row">
    <p></p>
    <hr />
  </div>

  <div class="row">
    <div class="form-text">
      Below is a graphical representation of the current formula and data points for formula
      creation.
    </div>
  </div>

  <div class="row">
    <BsMessage v-if="!chart" dismissable="false" message="" alert="danger">
      Unable to load chart.js from https://cdn.jsdelivr.net, check your internet connection
    </BsMessage>
    <canvas id="gravityChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { config } from '@/modules/pinia'
import { logError } from '@/modules/logger'
import { evaluateFormula } from '@/modules/formula'

const chart = ref(null)

const chartDataForm = ref([])
const chartDataCalc = ref([])

const dataSetChart = ref({
  datasets: [
    {
      label: 'Data for gravity calculation',
      borderColor: 'blue',
      backgroundColor: 'blue',
      data: chartDataForm.value
    },
    {
      label: 'Data based on current formula',
      borderColor: 'green',
      backgroundColor: 'green',
      data: chartDataCalc.value
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
  evaluateFormula(config.gravity_formula).forEach((p) => {
    chartDataCalc.value.push(p)
  })

  let data = config.formula_calculation_data
  data.sort((a, b) => (a.a == 0 ? 100 : a.a - b.a))

  for (let i = 0; i < data.length; i++) {
    if (data[i].a > 0)
      chartDataForm.value.push({
        x: data[i].a,
        y: data[i].g
      })
  }

  try {
    chart.value = new Chart(document.getElementById('gravityChart'), configChart.value)
  } catch (err) {
    logError('GravityAnalysisView.onMounted()', err)
  }
})
</script>

<style></style>
