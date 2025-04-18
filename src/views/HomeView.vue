<template>
  <div class="container">
    <p></p>

    <template v-if="status">
      <BsMessage
        v-if="!status.self_check.push_targets"
        dismissable="true"
        message=""
        alert="danger"
      >
        No remote services are active. Check your push settings and enable at least one service.
      </BsMessage>

      <BsMessage
        v-if="!status.self_check.gyro_connected"
        dismissable="true"
        message=""
        alert="danger"
      >
        No gyro is detected. Try to reboot / power-off. If this persists, check for hardware issues.
      </BsMessage>
    </template>

    <div v-if="status" class="container overflow-hidden text-center">
      <div class="row gy-4">
        <div class="col-md-4" v-if="status.self_check.gravity_formula">
          <BsCard header="Measurement" color="info" title="Gravity">
            <p class="text-center">
              {{ status.gravity }}
              {{ status.gravity_format === 'G' ? ' SG' : ' P' }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4" v-if="!status.self_check.gravity_formula">
          <BsCard header="Measurement" title="Error" :iserr="true" icon="bi-x-circle">
            <p class="text-center">
              Missing
              <router-link
                class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                to="/gravity/formula"
                >formula</router-link
              >, unable to calculate gravity
            </p>
          </BsCard>
        </div>

        <div
          class="col-md-4"
          v-if="status.self_check.gyro_calibration && status.self_check.gyro_connected"
        >
          <BsCard header="Measurement" color="info" title="Angle">
            <p class="text-center">
              <template v-if="status.self_check.gyro_moving"> Gyro is moving </template>
              <template v-else>
                {{ status.angle }}
              </template>
            </p>
          </BsCard>
        </div>
        <div
          class="col-md-4"
          v-if="status.self_check.gyro_calibration && status.self_check.gyro_connected"
        >
          <BsCard header="Measurement" color="info" title="Average Angle">
            <p class="text-center">
              {{ angle.average }} ({{ angle.count }})
              <button
                @click="clearAverage"
                type="button"
                class="btn btn-outline-info btn-sm"
                style="font-size: 0.7rem"
              >
                Clear
              </button>
            </p>
          </BsCard>
        </div>
        <div class="col-md-4" v-if="!status.self_check.gyro_calibration">
          <BsCard header="Measurement" title="Error" :iserr="true" icon="bi-x-circle">
            <p class="text-center">
              Gyro has not been
              <router-link
                class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                to="/device/hardware"
                >calibrated</router-link
              >
              at 90 degrees
            </p>
          </BsCard>
        </div>

        <div class="col-md-4" v-if="status.self_check.temp_connected">
          <BsCard header="Measurement" color="info" title="Temperature">
            <p class="text-center">{{ status.temp }} °{{ status.temp_unit }}</p>
          </BsCard>
        </div>

        <div class="col-md-4" v-if="!status.self_check.temp_connected">
          <BsCard header="Measurement" title="Error" :iserr="true" icon="bi-x-circle">
            <p class="text-center">No temperature sensor detected</p>
          </BsCard>
        </div>

        <div class="col-md-4" v-if="status.self_check.battery_level">
          <BsCard header="Measurement" color="info" title="Battery">
            <p class="text-center">{{ status.battery }} V</p>
          </BsCard>
        </div>
        <div class="col-md-4" v-if="!status.self_check.battery_level">
          <BsCard header="Measurement" title="Error" :iserr="true" icon="bi-x-circle">
            <p class="text-center">Battery level not valid</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Measurement" color="info" title="Average runtime">
            <p class="text-center">{{ status.runtime_average }} s</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="WIFI">
            <p class="text-center">{{ status.rssi }} dBm - {{ status.wifi_ssid }}</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="IP Address">
            <p class="text-center">
              {{ status.ip }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Memory">
            <p class="text-center">
              Free: {{ status.free_heap }} kb, Total: {{ status.total_heap }} kb
            </p>
          </BsCard>
        </div>

        <div class="col-md-4" v-if="newVersion.new">
          <BsCard header="Device" title="Upgrade available">
            <p class="text-center">
              {{ newVersion.ver }} available on
              <a
                class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                href="https://github.com/mp-se/gravitymon/releases"
                target="_blank"
                >github.com</a
              >
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Software version">
            <p class="text-center">
              Firmware: {{ status.app_ver }} ({{ status.app_build }}) UI: {{ global.uiVersion }} ({{
                global.uiBuild
              }})
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Platform">
            <p class="text-center">
              {{ status.platform }}, {{ status.hardware }} / {{ status.board }}
            </p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="ID">
            <p class="text-center">{{ status.id }}</p>
          </BsCard>
        </div>

        <div class="col-md-4">
          <BsCard header="Device" title="Force gravity mode">
            <div class="d-flex justify-content-center">
              <div class="form-check form-switch" style="height: 0.7rem">
                <input v-model="flag" class="form-check-input" type="checkbox" role="switch" />
              </div>
            </div>
          </BsCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { status, global } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

const polling = ref(null)
const flag = ref(false)
const angle = ref({ average: 0, sum: 0, count: 0 })
const newVersion = ref({ new: false, ver: '' })

watch(flag, async () => {
  status.setSleepMode(flag.value, () => {})
})

function clearAverage() {
  angle.value.sum = 0
  angle.value.count = 0
  angle.value.sum = 0
}

function refresh() {
  status.load((success) => {
    if (success) {
      if (!status.self_check.gyro_moving) {
        angle.value.sum += parseFloat(status.angle)
        angle.value.count++
        angle.value.average = (
          Math.round((angle.value.sum / angle.value.count) * 100) / 100
        ).toFixed(2)
      }
    }
  })
}

onMounted(() => {
  flag.value = status.sleep_mode

  setTimeout(() => {
    logInfo('HomeView.onMounted()', 'Checking for new sw')
    fetch('https://www.gravitymon.com/firmware/version.json', {
      signal: AbortSignal.timeout(10000)
    })
      .then((res) => res.json())
      .then((json) => {
        logDebug('HomeView.onMounted()', json)
        if (checkForNewGravMonVersion(json)) {
          newVersion.value.new = true
          newVersion.value.ver = json.version
          logInfo('HomeView.onMounted()', 'Newer version found')
        }

        logInfo('HomeView.onMounted()', 'Fetching latest gravtmon version completed')
      })
      .catch((err) => {
        logError('HomeView.onMounted()', err)
      })
  }, 500)
})

onBeforeMount(() => {
  refresh()
  polling.value = setInterval(refresh, 4000)
})

onBeforeUnmount(() => {
  clearInterval(polling.value)
})

function checkForNewGravMonVersion(json) {
  var current = status.app_ver
  var latest = json.version

  const newVer = latest.split('.')
  const curVer = current.split('.')

  if (newVer.length != 3 && curVer.length != 3) return false

  if (newVer[0] > curVer[0]) return true
  else if (newVer[0] == curVer[0] && newVer[1] > curVer[1]) return true
  else if (newVer[0] == curVer[0] && newVer[1] == curVer[1] && newVer[2] > curVer[2]) return true

  return false
}
</script>

<style></style>
