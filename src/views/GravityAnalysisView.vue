<template>
  <div class="container">
    <p></p>
    <p class="h2">Gravity - Analysis</p>
    <hr>
    <BsMessage v-if="!chart" dismissable="false" message="" alert="danger">
      Unable to load chart.js from https://cdn.jsdelivr.net, check your internet connection
    </BsMessage>
    <canvas id="gravityChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { global, config } from "@/modules/pinia"

const chartDataForm = ref([]);
const chartDataCalc = ref([]);
const chart = ref(null);

const dataSetChart = ref({
  datasets: [{
    label: 'Raw data',
    borderColor: 'blue',
    backgroundColor: 'blue',
    data: chartDataForm.value
  }, {
    label: 'Calculated',
    borderColor: 'green',
    backgroundColor: 'green',
    data: chartDataCalc.value
  }]
})

const configChart = ref({
  type: 'line',
  data: dataSetChart.value,
  options: {
    responsive: true,
    interaction: {
      intersect: false,
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
        suggestedMin: 1.000
      }
    }
  }
})

const convertToPlato = (sg) => {
  return 259 - (259 / sg)
}

onMounted(() => {

  for (let a = 25.0; a < 80.0; a += 5.0) {
    let angle = a.toFixed(3)
    let formula = config.gravity_formula
    formula = formula.replaceAll("tilt^3", angle + "*" + angle + "*" + angle)
    formula = formula.replaceAll("tilt^2", angle + "*" + angle)
    formula = formula.replaceAll("tilt", angle)
    
    try {
      let g = eval(formula)
      if (config.gravity_format === 'P') {
        g = convertToPlato(g)
      }

      chartDataCalc.value.push({ x: parseFloat(a), y: parseFloat(g) })
    } catch(err) {
      console.log(err)
      global.messageError = "Error evaluating the formula, the formula is invalid"
    }
  }

  for (let i = 0; i < config.formula_calculation_data.length; i++) {
    if( config.formula_calculation_data[i].a > 0)
      chartDataForm.value.push({ x: config.formula_calculation_data[i].a, y: config.formula_calculation_data[i].g })
  }

  try {
    chart.value = new Chart(document.getElementById('gravityChart'), configChart.value)
  } catch (err) {
    console.log(err)
  }
})
</script>

<style>
</style>
