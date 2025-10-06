<template>
  <div class="container">
    <p></p>
    <p class="h3">Serial console ({{ connected }})</p>
    <hr />

    <pre>{{ serial }}</pre>

    <div class="row gy-2">
      <div class="col-md-12">
        <hr />
      </div>
      <div class="col-md-12">
        <button @click="clear" type="button" class="btn btn-primary w-2" :disabled="!isConnected">
          Clear</button
        >&nbsp;

        <button
          @click="connect"
          type="button"
          class="btn btn-secondary w-2"
          :disabled="isConnected"
        >
          Connect
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { sharedHttpClient as http } from '@mp-se/espframework-ui-components'

const socket = ref(null)
let socketCloser = null
const serial = ref('')
const maxLines = 50

function clear() {
  serial.value = ''
}

onUnmounted(() => {
  if (typeof socketCloser === 'function') {
    try {
      socketCloser()
    } catch {
      // ignore
    }
    socketCloser = null
  } else if (socket.value) {
    try {
      socket.value.close()
    } catch {
      // ignore
    }
  }
  socket.value = null
})

const isConnected = computed(() => {
  return socket.value === null ? false : true
})

const connected = computed(() => {
  return socket.value === null ? 'Not connected' : 'Connected'
})

function connect() {
  serial.value = 'Attempting to connect to websocket\n'
  const ws = http.createWebSocket('serialws', {
    onOpen() {
      serial.value += 'Websocket established\n'
    },
    onMessage(event) {
      var list = serial.value.split('\n')

      while (list.length > maxLines) {
        list.shift()
      }

      serial.value = list.join('\n')
      serial.value += event.data
    },
    onClose() {
      serial.value += 'Socket closed\n'
      socket.value = null
    },
    onError(err) {
      serial.value += 'Websocket error: ' + (err && err.message ? err.message : err) + '\n'
    },
    autoReconnect: true
  })

  socketCloser = ws.close
  socket.value = ws.socketGetter()
}

onMounted(() => {
  connect()
})
</script>
