import { config } from '@/modules/pinia'
import { logError, logDebug } from '@/modules/logger'
import { convertToPlato } from '@/modules/utils'

function applyValuesToFormula(formula, tilt) {
  let angle = tilt.toFixed(3)
  let f = formula
  f = f.replaceAll('tilt^3', angle + '*' + angle + '*' + angle)
  f = f.replaceAll('tilt^2', angle + '*' + angle)
  f = f.replaceAll('tilt', angle)
  return f
}

export function calculate(formula, tilt) {
  if (formula != '') {
    let f = applyValuesToFormula(formula, tilt)

    try {
      let g = eval(f)
      if (config.gravity_format === 'P') {
        g = convertToPlato(g)
      }

      return g
    } catch (err) {
      logError('formula.evaluateFormula()', err)
    }
  }

  return NaN
}

export function evaluateFormula(formula) {
  var result = []

  for (let a = 25.0; a < 80.0; a += 5.0) {
    var g = calculate(formula, a)
    result.push({ x: parseFloat(a), y: parseFloat(g) })
  }

  return result
}

export function validateFormula(formula) {
  var result = true

  config.formula_calculation_data.forEach((d) => {
    let f = applyValuesToFormula(formula, d.a)

    try {
      let g = eval(f)

      if (Math.abs(g - d.g) > config.formula_max_deviation) {
        logDebug('formula.validateFormula()', 'Formula rejected due to high deviation', d.g, g)
        result = false
      }
    } catch {
      logDebug('formula.validateFormula()', 'Failed to evalutate formula', formula)
    }
  })

  return result
}
