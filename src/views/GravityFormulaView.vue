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
        <div class="col-md-12">
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

        <div class="col-md-12">
          <hr />
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

        <div class="col-md-12">
          <hr />
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
            help="When validating the derived formula this is the maximum accepted deviation for the supplied values, use the analysis page to visually check where there are deviations"
            :disabled="global.disabled || config.gyro_disabled"
          ></BsInputNumber>
        </div>
      </div>

      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-3">
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
            &nbsp;Save
          </button>
        </div>
        <div class="col-md-3">
          <button
            @click.prevent="calcFormula"
            type="button"
            class="btn btn-primary w-2"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Calculate new Formula
          </button>
        </div>
      </div>
    </form>

    <div class="row">
      <p></p>
      <GravityGraphFragment v-if="renderComponent"></GravityGraphFragment>
    </div>
</div>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { validateCurrentForm } from '@/modules/utils'
import { global, config } from '@/modules/pinia'
import GravityGraphFragment from '@/fragments/GravityGraphFragment.vue'
import { logDebug, logError } from '@/modules/logger'
import * as badge from '@/modules/badge'

const renderComponent = ref(true);

const forceRerender = async () => {
  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
}

const save = () => {
  if (!validateCurrentForm()) return

  config.saveAll()
  forceRerender()
}

const calcFormula = () => {
  if (!validateCurrentForm()) return

  global.clearMessages()
  config.sendConfig((success) => {
    if (success) {
      fetch(global.baseURL + 'api/formula', {
        headers: { Authorization: global.token },
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logDebug('GravityFormulaView.calcFormula()', json)
          if (json.success == true) {
            config.gravity_formula = json.gravity_formula
            global.messageSuccess = json.message
          } else {
            global.messageError = json.message
          }
          global.disabled = false
        })
        .catch((err) => {
          logError('GravityFormulaView.calcFormula()', err)
          global.messageError = 'Failed to request formula creation'
          global.disabled = false
        })
    } else {
      global.messageError = 'Failed to store configuration to device'
      global.disabled = false
    }
  })
}
</script>
