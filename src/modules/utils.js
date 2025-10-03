import { ref } from 'vue'
import { config, global } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@mp-se/espframework-ui-components'

export const httpHeaderOptions = ref([
  { label: 'JSON data', value: 'Content-Type: application/json' },
  { label: 'Form data', value: 'Content-Type: x-www-form-urlencoded' },
  { label: 'Authorization', value: 'Authorization: Basic {enter token here}' },
  { label: 'No Cache', value: 'Pragma: no-cache' },
  { label: 'User agent', value: 'User-Agent: gravitymon' }
])

export const httpPostUrlOptions = ref([
  {
    label: 'Brewfather ispindel',
    value: 'http://log.brewfather.net/ispindel?id=<yourid>'
  },
  {
    label: 'Brewfather stream',
    value: 'http://log.brewfather.net/stream?id=<yourid>'
  },
  {
    label: 'UBI dots',
    value: 'http://industrial.api.ubidots.com/api/v1.6/devices/<devicename>/?token=<api-token>'
  },
  {
    label: 'UBI dots secure',
    value: 'https://industrial.api.ubidots.com/api/v1.6/devices/<devicename>/?token=<api-token>'
  },
  {
    label: 'Brewersfriend (P)',
    value: 'http://log.brewersfriend.com/ispindel/[API KEY]'
  },
  {
    label: 'Brewersfriend (SG)',
    value: 'http://log.brewersfriend.com/ispindel_sg/[API KEY]'
  },
  { label: 'Brewspy', value: 'http://brew-spy.com/api/ispindel' },
  { label: 'Thingsspeak', value: 'http://api.thingspeak.com/update.json' },
  { label: 'Blynk', value: 'http://blynk.cloud/external/api/batch/update' },
  { label: 'Bierdot bricks', value: 'https://brewbricks.com/api/iot/v1' }
])

export const httpPostFormatOptions = ref([
  {
    label: 'GravityMon',
    value:
      '%7B%20%22name%22%20%3A%20%22%24%7Bmdns%7D%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp_units%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%2C%20%22corr-gravity%22%3A%20%24%7Bcorr-gravity%7D%2C%20%22gravity-unit%22%3A%20%22%24%7Bgravity-unit%7D%22%2C%20%22run-time%22%3A%20%24%7Brun-time%7D%7D'
  },
  {
    label: 'GravityMon v2',
    value:
      '%7B%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp%5Funits%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22velocity%22%3A%20%24%7Bvelocity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%2C%20%22corr%2Dgravity%22%3A%20%24%7Bcorr%2Dgravity%7D%2C%20%22gravity%2Dunit%22%3A%20%22%24%7Bgravity%2Dunit%7D%22%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D'
  },
  {
    label: 'iSpindle',
    value:
      '%7B%20%22name%22%20%3A%20%22%24%7Bmdns%7D%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp_units%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%7D'
  },
  {
    label: 'BrewFatherCustom',
    value:
      '%7B%20%20%20%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%20%20%22temp%22%3A%20%24%7Btemp%7D%2C%20%20%20%22aux_temp%22%3A%200%2C%20%20%20%22ext_temp%22%3A%200%2C%20%20%20%22temp_unit%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%20%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%20%20%22gravity_unit%22%3A%20%22%24%7Bgravity-unit%7D%22%2C%20%20%20%22pressure%22%3A%200%2C%20%20%20%22pressure_unit%22%3A%20%22PSI%22%2C%20%20%20%22ph%22%3A%200%2C%20%20%20%22bpm%22%3A%200%2C%20%20%20%22comment%22%3A%20%22%22%2C%20%20%20%22beer%22%3A%20%22%22%2C%20%20%20%22battery%22%3A%20%24%7Bbattery%7D%7D'
  },
  {
    label: 'UBIDots',
    value:
      '%7B%20%20%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%20%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%20%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%20%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%20%20%22rssi%22%3A%20%24%7Brssi%7D%7D'
  }
])

export const httpGetFormatOptions = ref([
  {
    label: 'GravityMon',
    value:
      '%3Fname%3D%24%7Bmdns%7D%26id%3D%24%7Bid%7D%26token%3D%24%7Btoken2%7D%26interval%3D%24%7Bsleep-interval%7D%26temperature%3D%24%7Btemp%7D%26temp-units%3D%24%7Btemp-unit%7D%26gravity%3D%24%7Bgravity%7D%26angle%3D%24%7Bangle%7D%26battery%3D%24%7Bbattery%7D%26rssi%3D%24%7Brssi%7D%26corr-gravity%3D%24%7Bcorr-gravity%7D%26gravity-unit%3D%24%7Bgravity-unit%7D%26run-time%3D%24%7Brun-time%7D'
  },
  {
    label: 'GravityMon v2',
    value:
      '%3Fname%3D%24%7Bmdns%7D%26id%3D%24%7Bid%7D%26token%3D%24%7Btoken2%7D%26interval%3D%24%7Bsleep%2Dinterval%7D%26temperature%3D%24%7Btemp%7D%26temp%2Dunits%3D%24%7Btemp%2Dunit%7D%26gravity%3D%24%7Bgravity%7D%26velocity%3D%24%7Bvelocity%7D%26angle%3D%24%7Bangle%7D%26battery%3D%24%7Bbattery%7D%26rssi%3D%24%7Brssi%7D%26corr%2Dgravity%3D%24%7Bcorr%2Dgravity%7D%26gravity%2Dunit%3D%24%7Bgravity%2Dunit%7D%26run%2Dtime%3D%24%7Brun%2Dtime%7D'
  }
])

export const influxdb2FormatOptions = ref([
  {
    label: 'GravityMon',
    value:
      'measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemp%2Dformat%3D%24%7Btemp%2Dunit%7D%2Cgravity%2Dformat%3D%24%7Bgravity%2Dunit%7D%20gravity%3D%24%7Bgravity%7D%2Ccorr%2Dgravity%3D%24%7Bcorr%2Dgravity%7D%2Cangle%3D%24%7Bangle%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A'
  },
  {
    label: 'GravityMon v2',
    value:
      'measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemp%2Dformat%3D%24%7Btemp%2Dunit%7D%2Cgravity%2Dformat%3D%24%7Bgravity%2Dunit%7D%20gravity%3D%24%7Bgravity%7D%2Cvelocity%3D%24%7Bvelocity%7D%2Ccorr%2Dgravity%3D%24%7Bcorr%2Dgravity%7D%2Cangle%3D%24%7Bangle%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A'
  }
])

export const mqttFormatOptions = ref([
  {
    label: 'Gravitymon / iSpindel',
    value:
      'ispindel%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Bangle%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemp_units%3A%24%7Btemp-unit%7D%7Cispindel%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cispindel%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cispindel%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep-interval%7D%7Cispindel%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C'
  },
  {
    label: 'Gravitymon v2 / iSpindel',
    value:
      'ispindel%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Bangle%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemp%5Funits%3A%24%7Btemp%2Dunit%7D%7Cispindel%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cispindel%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cispindel%2F%24%7Bmdns%7D%2Fvelocity%3A%24%7Bvelocity%7D%7Cispindel%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep%2Dinterval%7D%7Cispindel%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C'
  },
  {
    label: 'HomeAssistant',
    value:
      'gravmon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cgravmon%2F%24%7Bmdns%7D%2Frssi%3A%24%7Brssi%7D%7Cgravmon%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Btilt%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7C'
  },
  {
    label: 'HomeAssistant 2',
    value:
      'gravmon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cgravmon%2F%24%7Bmdns%7D%2Frssi%3A%24%7Brssi%7D%7Cgravmon%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Btilt%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Ftemperature%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_temp%22%2C%22name%22%3A%22temperature%22%2C%22dev_cla%22%3A%22temperature%22%2C%22unit_of_meas%22%3A%22%C2%B0%24%7Btemp-unit%7D%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Ftemperature%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Fgravity%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_grav%22%2C%22name%22%3A%22gravity%22%2C%22unit_of_meas%22%3A%22%20%24%7Bgravity-unit%7D%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Fgravity%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Frssi%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_rssi%22%2C%22name%22%3A%22rssi%22%2C%22dev_cla%22%3A%22signal_strength%22%2C%22unit_of_meas%22%3A%22dBm%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Frssi%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Ftilt%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_tilt%22%2C%22name%22%3A%22tilt%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Ftilt%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Fbattery%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_batt%22%2C%22name%22%3A%22battery%22%2C%22dev_cla%22%3A%22voltage%22%2C%22unit_of_meas%22%3A%22V%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Fbattery%22%7D%7C'
  },
  {
    label: 'Brewblox',
    value:
      'brewcast%2Fhistory%3A%7B%22key%22%3A%22%24%7Bmdns%7D%22%2C%22data%22%3A%7B%22Temperature%5BdegC%5D%22%3A%20%24%7Btemp-c%7D%2C%22Temperature%5BdegF%5D%22%3A%20%24%7Btemp-f%7D%2C%22Battery%5BV%5D%22%3A%24%7Bbattery%7D%2C%22Tilt%5Bdeg%5D%22%3A%24%7Bangle%7D%2C%22Rssi%5BdBm%5D%22%3A%24%7Brssi%7D%2C%22SG%22%3A%24%7Bgravity-sg%7D%2C%22Plato%22%3A%24%7Bgravity-plato%7D%7D%7D%7C'
  }
])

export const httpGetUrlOptions = ref([{ label: '-blank-', value: '' }])

export function validateCurrentForm() {
  let valid = true
  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach((form) => {
    if (!form.checkValidity()) valid = false

    form.classList.add('was-validated')
  })

  return valid
}

export function roundVal(val, decimals) {
  return parseFloat(Number(val).toFixed(decimals))
}

export function gravityToPlato(sg) {
  return 135.997 * sg * sg * sg - 630.272 * sg * sg + 1111.14 * sg - 616.868
}

export function gravityToSG(p) {
  return 1 + p / (258.6 - 227.1 * (p / 258.2))
}

export function tempToF(c) {
  return c * 1.8 + 32.0
}

export function tempToC(f) {
  return (f - 32.0) / 1.8
}

export function applyTemplate(status, config, template) {
  let s = template

  s = s.replaceAll('${temp}', status.temp)

  let c = status.temp
  let f = status.temp

  if (config.temp_unit === 'C') {
    f = tempToF(status.temp)
  } else {
    c = tempToC(status.temp)
  }

  s = s.replaceAll('${temp-c}', c)
  s = s.replaceAll('${temp-f}', f)
  s = s.replaceAll('${angle}', status.angle)
  s = s.replaceAll('${tilt}', status.angle)
  s = s.replaceAll('${app-ver}', global.app_ver)
  s = s.replaceAll('${app-build}', global.app_build)
  s = s.replaceAll('${battery-percent}', 100)
  s = s.replaceAll('${rssi}', status.rssi)
  s = s.replaceAll('${velocity}', -12)
  s = s.replaceAll('${run-time}', 5)
  s = s.replaceAll('${corr-gravity}', status.gravity)
  s = s.replaceAll('${battery}', status.battery)

  if (config.gravity_unit === 'G') {
    const sg = status.gravity
    s = s.replaceAll('${gravity}', sg)
    s = s.replaceAll('${gravity-sg}', sg)
    s = s.replaceAll('${corr-gravity-sg}', sg)
    const plato = 259 - (259 - sg)
    s = s.replaceAll('${gravity-plato}', plato)
    s = s.replaceAll('${corr-gravity-plato}', plato)
  } else {
    const plato = status.gravity
    s = s.replaceAll('${gravity}', plato)
    s = s.replaceAll('${gravity-plato}', plato)
    s = s.replaceAll('${corr-gravity-plato}', plato)
    const sg = 259 / (259 - plato)
    s = s.replaceAll('${gravity-sg}', sg)
    s = s.replaceAll('${corr-gravity-sg}', sg)
  }

  s = s.replaceAll('${mdns}', config.mdns)
  s = s.replaceAll('${id}', config.id)
  s = s.replaceAll('${sleep-interval}', config.sleep_interval)
  s = s.replaceAll('${token}', config.token)
  s = s.replaceAll('${token2}', config.token2)
  s = s.replaceAll('${temp-unit}', config.temp_unit)
  s = s.replaceAll('${gravity-unit}', config.gravity_unit)

  try {
    return JSON.stringify(JSON.parse(s), null, 2)
  } catch {
    logError('utils.applyTemplate()', 'Not a valid json document, returning string')
  }

  return s
}

export function isValidJson(s) {
  try {
    JSON.stringify(JSON.parse(s))
    return true
  } catch (e) {
    logDebug('utils.isValidJson()', e)
  }

  return false
}

export function isValidFormData(s) {
  if (s.startsWith('?')) return true

  return false
}

export function isValidMqttData(s) {
  if (s.indexOf('|') >= 0) return true

  return false
}

export function getErrorString(code) {
  switch (code) {
    case -100:
      return 'Skipped since SSL is used'
    case 200:
      return 'Success (200)'
    case 401:
      return 'Access denied (401)'
    case 404:
      return 'Endpoint not found (404)'
    case 422:
      return 'Paylod cannot be parsed, check format and http headers'
  }

  return ''
}

export function isGyroCalibrated() {
  const g = config.gyro_calibration_data
  if (g.ax + g.ay + g.az + g.gx + g.gy + g.gz == 0) return false
  return true
}

export async function restart() {
  global.clearMessages()
  global.disabled = true
  
  const abortController = new AbortController()
  let redirectTimeout = null
  
  try {
    const response = await fetch(global.baseURL + 'api/restart', {
      headers: { Authorization: global.token },
      signal: abortController.signal
    })
    const json = await response.json()
    
    logDebug('utils.restart()', json)
    if (json.status == true) {
      global.messageSuccess =
        json.message + ' Redirecting to http://' + config.mdns + '.local in 8 seconds.'
      logInfo('utils.restart()', 'Scheduling refresh of UI')
      
      redirectTimeout = setTimeout(() => {
        try {
          location.href = 'http://' + config.mdns + '.local'
        } catch (error) {
          logError('utils.restart.redirect()', error)
          // Fallback to current location
          window.location.reload()
        }
      }, 8000)
      
      // Clean up on page unload
      window.addEventListener('beforeunload', () => {
        if (redirectTimeout) clearTimeout(redirectTimeout)
        abortController.abort()
      }, { once: true })
      
    } else {
      global.messageError = json.message
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      logError('utils.restart()', err)
      global.messageError = 'Failed to do restart'
    }
  } finally {
    global.disabled = false
  }
}
