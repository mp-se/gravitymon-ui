<template>
  <div class="container">
    <p></p>
    <p class="h2">Gravity - Formula</p>
    <hr />

    <BsMessage v-if="config.gravity_formula === ''" dismissable="true" message="" alert="warning">
      You need to enter a formula in order to report gravity
    </BsMessage>

    <BsMessage v-if="config.gyro_disabled" dismissable="true" message="" alert="warning">
      Gyro is disbled so the device will only be able to measure temperature
    </BsMessage>

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-10">
          <BsInputText
            v-model="config.gravity_formula"
            maxlength="200"
            label="Gravity formula"
            help="Formula used to convert angle to gravity"
            :badge="badge.gravityFormulaBadge()"
            :disabled="global.disabled || config.gyro_disabled"
          >
          </BsInputText>
        </div>

        <div class="col-md-2">
          <BsDropdown
            label="Formulas"
            button="Formula"
            :options="formulaOptions"
            :callback="formulaSelectCallback"
            :disabled="formulaOptions.length == 0"
          />
        </div>

        <div class="col-md-12">
          <label class="form-label fw-bold">Data for gravity calculation (Angle and Gravity)</label>
        </div>

        <template v-for="(data, index) in config.formula_calculation_data" :key="index">
          <div class="col-md-6">
            <div class="input-group has-validation">
              <span class="input-group-text">{{ index + 1 }}</span>
              <input
                v-model="config.formula_calculation_data[index].a"
                class="form-control w-2"
                type="number"
                min="0"
                max="90"
                step=".001"
                :disabled="global.disabled || config.gyro_disabled"
              />
              <span class="input-group-text">{{ '°' }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="input-group has-validation">
              <span class="input-group-text">{{ index + 1 }}</span>
              <input
                v-model="config.formula_calculation_data[index].g"
                class="form-control"
                type="number"
                min="1"
                max="10"
                step=".0001"
                :disabled="global.disabled || config.gyro_disabled"
              />
              <span class="input-group-text">{{ config.gravity_format == 'G' ? 'SG' : 'P' }}</span>
            </div>
          </div>
        </template>

        <div class="form-text">
          Enter the data that is used to create a new formula. The most optimal formula will be
          selected and also validated towards these values.
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="config.formula_max_deviation"
            :unit="config.gravity_format == 'G' ? 'SG' : 'P'"
            label="Max allowed deviation"
            min="1"
            max="10"
            step=".1"
            width="4"
            help="When validating the derived formula this is the maximum accepted deviation for the supplied values, use graph below to visually check where there are deviations"
            :disabled="global.disabled || config.gyro_disabled"
          ></BsInputNumber>
        </div>

        <div class="col-md-6">
          <BsInputNumber
            v-model="noDecimals"
            label="Number of decimans in formula"
            min="1"
            max="10"
            step="1"
            width="4"
            help="How many decimals to try to limit in the formula"
            :disabled="global.disabled || config.gyro_disabled"
          ></BsInputNumber>
        </div>
      </div>

      <div class="row gy-2">
        <div class="col-md-12">
          <p></p>
          <button
            type="submit"
            class="btn btn-primary w-2"
            :disabled="global.disabled || !global.configChanged"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Save</button
          >&nbsp;
          <button
            @click.prevent="createFormula"
            type="button"
            class="btn btn-primary w-2"
            :disabled="global.disabled || config.gyro_disabled"
          >
            Create formula</button
          >&nbsp;
        </div>
      </div>
    </form>

    <GravityGraphFragment v-if="renderComponent && expressions == null"></GravityGraphFragment>
    <FormulaTableFragment
      v-if="renderComponent && expressions != null"
      :expressions="expressions"
    ></FormulaTableFragment>
    <FormulaGraphFragment
      v-if="renderComponent && expressions != null"
      :expressions="expressions"
    ></FormulaGraphFragment>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { validateCurrentForm } from '@/modules/utils'
import { global, config } from '@/modules/pinia'
import GravityGraphFragment from '@/fragments/GravityGraphFragment.vue'
import { logDebug } from '@/modules/logger'
import * as badge from '@/modules/badge'
import FormulaGraphFragment from '@/fragments/FormulaGraphFragment.vue'
import FormulaTableFragment from '@/fragments/FormulaTableFragment.vue'
import { PolynomialRegression } from 'ml-regression-polynomial'
import { validateFormula } from '@/modules/formula'

// TODO: On mount convert all data points to Plato and back on unmount

const renderComponent = ref(true)
const expressions = ref(null)
const noDecimals = ref(8)
const formulaOptions = ref([])

const formulaSelectCallback = (opt) => {
  config.gravity_formula = opt
}

const createFormula = () => {
  if (!validateCurrentForm()) return

  logDebug('GravityFormulaView.createFormula()')
  expressions.value = null
  formulaOptions.value = []

  var x = [],
    y = [],
    res = { 1: '', 2: '', 3: '', 4: '' }

  for (let i = 0; i < config.formula_calculation_data.length; i++) {
    x.push(config.formula_calculation_data[i].a)
    y.push(config.formula_calculation_data[i].g)
  }

  for (var i = 1; i < 5; i++) {
    const regression = new PolynomialRegression(x, y, i)

    var f = regression.toString(noDecimals.value)
    f = f.replaceAll(' ', '')
    f = f.replaceAll('f(x)=', '')
    f = f.replaceAll('x', 'tilt')

    if (validateFormula(f)) {
      res[i] = f
      formulaOptions.value.push({ value: f, label: 'Formula Order ' + i })
    } else {
      res[i] = ''
    }
  }

  /*
  formulas.value = []

if (json.poly1 != '') formulas.value.push({ value: json.poly1, label: 'Formula Order 1' })
if (json.poly2 != '') formulas.value.push({ value: json.poly2, label: 'Formula Order 2' })
if (json.poly3 != '') formulas.value.push({ value: json.poly3, label: 'Formula Order 3' })
if (json.poly4 != '') formulas.value.push({ value: json.poly4, label: 'Formula Order 4' })
*/

  expressions.value = res
  forceRerender()
}

const forceRerender = async () => {
  renderComponent.value = false
  await nextTick()
  renderComponent.value = true
}

const save = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
  forceRerender()
}
</script>
