const express = require('express')
var cors = require('cors')

const multer  = require('multer');
const upload = multer({ dest: "./" });

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.post('/api/upload', upload.single('file'), function(req, res) {
  const title = req.body.title;
  const file = req.file;

  console.log(title);
  console.log(file);

  res.sendStatus(200);
});

configData = {
  // Device configuration
  id: "7376ef",
  mdns: "gravmon3",
  temp_format: "C",
  gravity_format: "G",
  // Hardware
  ota_url: "https://www.gravitymon.com/firmware/",
  storage_sleep: true,
  voltage_factor: 1.59,
  voltage_config: 4.15,
  gyro_temp: false,
  battery_saving: true,
  tempsensor_resolution: 9,
  temp_adjustment_value: 0,
  // Wifi
  wifi_portal_timeout: 120,
  wifi_connect_timeout: 20,
  wifi_ssid: "network A",
  wifi_ssid2: "",
  wifi_pass: "password",
  wifi_pass2: "mypass",
  // Push - Generic
  token: "mytoken",
  token2: "mytoken2",
  sleep_interval: 30,
  push_timeout: 10,
  skip_ssl_on_test: false,
  // Push - Http Post 1
  http_push: "http://192.168.1.10:9090/api/v1/ZYfjlUNeiuyu9N/telemetry",
  http_push_h1: "Auth: Basic T7IF9DD9fF3RDddE=",
  http_push_h2: "Auth: Advanced T7IF9DD9fF3RDddE=",
  http_int: 1,
  // Push - Http Post 2
  http_push2: "http://192.168.1.10/ispindel",
  http_push2_h1: "Header: Second",
  http_push2_h2: "Header: First",
  http_int2: 1,
  // Push - Http Get
  http_push3: "http://192.168.1.10/ispindel",
  http_int3: 1,
  // Push - Influx
  influxdb2_push: "http://192.168.1.10:8086",
  influxdb2_org: "hello",
  influxdb2_bucket: "spann",
  influxdb2_auth: "OijkU((jhfkh",
  influxdb2_int: 1,
  // Push - MQTT
  mqtt_push: "192.168.1.10",
  mqtt_port: 1883,
  mqtt_user: "user",
  mqtt_pass: "pass",
  mqtt_int: 1,
  // Push BLE
  ble_tilt_color: "pink",
  ble_format: 1,
  // Gravity - Generic
  gravity_formula: "0.0*tilt^3+0.0*tilt^2+0.0017978*tilt+0.9436",
  gravity_temp_adjustment: false,
  gyro_read_count: 50,
  gyro_moving_threashold: 500,
  formula_max_deviation: 3,
  formula_calibration_temp: 20,
  ignore_low_angles: false,
  formula_calculation_data: [
    { a: 25, g: 1.000 },
    { a: 30, g: 1.010 },
    { a: 35, g: 1.020 },
    { a: 40, g: 1.030 },
    { a: 45, g: 1.040 },
    { a: 50, g: 1.050 },
    { a: 55, g: 1.060 },
    { a: 60, g: 1.070 },
    { a: 65, g: 1.080 },
    { a: 70, g: 1.090 }
  ],
  gyro_calibration_data: {
    ax: 0,
    ay: 0,
    az: 0,
    gx: 0,
    gy: 0,
    gz: 0,
  },
  dark_mode: true, 
}

formatData = {
  http_format: "%7B%22name%22%20%3A%20%22gravmon%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22gravmon%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp%2Dunits%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22corr%2Dgravity%22%3A%20%24%7Bcorr%2Dgravity%7D%2C%20%22gravity%2Dunit%22%3A%20%22%24%7Bgravity%2Dunit%7D%22%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D",
  http_format2: "%7B%22name%22%20%3A%20%22gravmon%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22gravmon%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp%2Dunits%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22corr%2Dgravity%22%3A%20%24%7Bcorr%2Dgravity%7D%2C%20%22gravity%2Dunit%22%3A%20%22%24%7Bgravity%2Dunit%7D%22%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D",
  http_format3: "%7B%22name%22%20%3A%20%22gravmon%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22gravmon%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp%2Dunits%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22corr%2Dgravity%22%3A%20%24%7Bcorr%2Dgravity%7D%2C%20%22gravity%2Dunit%22%3A%20%22%24%7Bgravity%2Dunit%7D%22%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D",
  influxdb2_format: "measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemp%2Dformat%3D%24%7Btemp%2Dunit%7D%2Cgravity%2Dformat%3D%24%7Bgravity%2Dunit%7D%20gravity%3D%24%7Bgravity%7D%2Ccorr%2Dgravity%3D%24%7Bcorr%2Dgravity%7D%2Cangle%3D%24%7Bangle%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A",
  mqtt_format: "ispindel%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Bangle%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemp%5Funits%3A%24%7Btemp%2Dunit%7D%7Cispindel%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cispindel%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cispindel%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep%2Dinterval%7D%7Cispindel%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C"
}

statusData = {
  id: "7376ef",
  angle: 22.4,
  gravity: 1.044,
  gravity_format: "G",
  temp: 12,
  sleep_interval: 300,
  battery: 3.81,
  temp_format: "C",
  sleep_mode: false,
  rssi: -56,
  app_ver: "2.0.0",
  app_build: "gitrev",
  mdns: "gravmon",
  platform: "esp32",
  hardware: "ispindel",
  wifi_ssid: "wifi",
  runtime_average: 3.12,
  ispindel_config: false,
  total_heap: 1000,
  free_heap: 500,
  ip: "192.0.0.1",
  self_check: {
    gyro_connected: true,
    gyro_calibration: true,
    temp_connected: true,
    gravity_formula: true,
    battery_level: true,
    push_targets: true
  },
  wifi_setup: false,
}

app.get('/api/auth', (req, res) => {
  console.log('GET: /api/auth')
  /* 
   * Description:    Perform device authentication and receive access token
   * Authentication: No
   * Limitation:     - 
   * Return:         200 OK, 401 Access Denied
   * Request body:
     {
       push_format: "http_format|http_format2|http_format3|influxdb2_format|mqtt_format"
     }
   */
  data = { token: statusData.id }

  console.log(req.headers['authorization'])
  res.send(data)
})

app.get('/api/config', (req, res) => {
  console.log('GET: /api/config')
  /* 
   * Description:    Return configuration data as json document. 
   * Authentication: Required
   * Limitation:     Don't include format templates due to their size.
   *                 Wifi passwords are removed due to security considerations (no encrypted transfer).
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(configData)
})

app.get('/api/restart', (req, res) => {
  console.log('GET: /api/restart')
  /* 
   * Description:    Perform a restart of the device
   * Authentication: Required
   * Limitation:     - 
   * Note:           Simulator will wait 2 seconds before returning result.
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => {
    var data = {
      success: true,
      message: "Device is restarting..."
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

var calibrateRunning = false

app.get('/api/calibrate', (req, res) => {
  console.log('GET: /api/calibrate')
  /* 
   * Description:    Initiate the gyro calibration process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/calibrate/status to check for completion
   * Return:         200 OK, 401 Access Denied
   */
  configData.gyro_calibration_data.gx = 1
  setTimeout(() => { calibrateRunning = false }, 5000)
  calibrateRunning = true
  var data = {
    success: true,
    message: "Gyro calibration started..."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/calibrate/status', (req, res) => {
  console.log('GET: /api/calibrate/status')
  /* 
   * Description:    Return status of the current gyro calibration process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  var data = {}
  if (calibrateRunning) {
    data = {
      status: calibrateRunning,
      success: false,
      message: "Gyro calibration running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Gyro calibration completed..."
    }
  }
  res.type('application/json')
  res.send(data)
})

var testRunning = false

app.post('/api/test/push', (req, res) => {
  console.log('GET: /api/test/push')
  /* 
   * Description:    Initiate the push test for a defined target
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/test/push/status to check for completion
   * Return:         200 OK, 401 Access Denied, 422 Content Invalid
   * Request body:
     {
       push_format: "http_format|http_format2|http_format3|influxdb2_format|mqtt_format"
     }
   */
  if(!req.body.hasOwnProperty("push_format")) {
    res.sendStatus(422)
    return
  }  
  testRunning = true
  setTimeout(() => { testRunning = false }, 5000)
  var data = {
    success: true,
    message: "Test scheduled."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/test/push/status', (req, res) => {
  console.log('GET: /api/test/push/status')
  /* 
   * Description:    Return status of the current gyro calibration process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  var data = {}
  if (testRunning) {
    data = {
      status: testRunning,
      success: false,
      message: "Push test running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Push test completed...",
      push_return_code: 200,
      push_enabled: true
    }
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/factory', (req, res) => {
  console.log('GET: /api/factory')
  /* 
   * Description:    Simualate a factory reset.
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => {
    var data = {
      success: true,
      message: "Factory settings restored"
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

app.get('/api/formula', (req, res) => {
  console.log('GET: /api/formula')
  /* 
   * Description:    Simualate creation of gravity formula. Assume data has been saved via config.
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => {
    var data = {
      success: true,
      message: "Hello world",
      gravity_formula: "tilt*2+tilt+0.45"
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

app.get('/api/config/format', (req, res) => {
  console.log('GET: /api/format')
  /* 
   * Description:    Return format data as json document. 
   * Authentication: Required
   * Limitation:     -
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(formatData)
})

app.get('/api/status', (req, res) => {
  console.log('GET: /api/status')
  /* 
   * Description:    Return status data as json document. 
   * Authentication: None
   * Limitation:     -
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(statusData)
})

app.post('/api/config', (req, res) => {
  console.log('POST: /api/config')
  /* 
   * Description:    Update the configuration data that is in body
   * Authentication: Required
   * Limitation:     - 
   * Note:           See config read for options.
   * Return:         200 OK, 401 Access Denied
   */
  console.log(req.body);
  for (var o in req.body) {
    configData[o] = req.body[o]
  }
  var data = {
    success: true,
    message: "Configuration stored",
  }
  res.type('application/json')
  res.send(data)
})

app.post('/api/config/format', (req, res) => {
  console.log('POST: /api/config/format')
  /* 
   * Description:    Update the format data that is in body
   * Authentication: Required
   * Limitation:     - 
   * Note:           See format read for options.
   * Return:         200 OK, 401 Access Denied
   */
  console.log(req.body);
  for (var o in req.body) {
    formatData[o] = req.body[o]
  }
  var data = {
    success: true,
    message: "Format stored",
  }
  res.type('application/json')
  res.send(data)
})

app.post('/api/config/sleepmode', (req, res) => {
  console.log('POST: /api/config/sleepmode')
  /* 
   * Description:    Toggle the sleep mode (from index page)
   * Authentication: Required
   * Limitation:     - 
   * Note:           Returns current sleep_mode
   * Return:         200 OK, 401 Access Denied
   * Request body:
     {
       sleep_mode: true|false
     }
   */
  statusData.sleep_mode = req.body.sleep_mode
  var data = { 
    sleep_mode: req.body.sleep_mode 
  }
  res.type('application/json')
  res.send(data)
})

var wifiScanRunning = false

app.get('/api/wifi/scan', (req, res) => {
  console.log('GET: /api/wifi/scan')
  /* 
   * Description:    Do a wifi scan for avaialble networks
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/wifi/scan/status to check for completion
   * Return:         200 OK, 401 Access Denied
   */
  wifiScanRunning = true
  setTimeout(() => { wifiScanRunning = false }, 8000)
  var data = {
    success: true,
    message: "Wifi scan started."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/wifi/scan/status', (req, res) => {
  console.log('GET: /api/wifi/scan/status')
  /* 
   * Description:    Return status of the current wifi scan process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  var data = {}
  if (wifiScanRunning) {
    data = {
      status: wifiScanRunning,
      success: false,
      message: "Wifi scan running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Wifi scan completed...",
      networks: [ 
        { wifi_ssid: "network A", rssi: -20, channel: 10, encryption: 2 }, 
        { wifi_ssid: "network B", rssi: -70, channel: 12, encryption: 3 }, 
        { wifi_ssid: "network C", rssi: -50, channel: 6, encryption: 0 }
      ]
    }
  }
  res.type('application/json')
  res.send(data)
})

/*app.get('/log', (req, res) => {
  console.log('GET: /log')

  setTimeout(() => {
    res.send("Log entry 5\nLog entry 4\nLog entry 3\nLog entry 2\nLog entry 1\n")
  }, 1000)
})

app.get('/log2', (req, res) => {
  console.log('GET: /log2')
  setTimeout(() => {
    res.send("Log entry 9\nLog entry 8\nLog entry 7\nLog entry 6\n")
  }, 1000)
})*/

app.post('/api/filesystem', (req, res) => {
  console.log('POST: /api/filesystem')
  /* 
   * Description:    Interact with local file system on the device
   * Authentication: Required
   * Limitation:     - 
   * Return:         200 OK, 401 Access Denied, 400 Faulty request
   * Request body:
     {
       command: "dir|get|del",
       file: "name of file for get and del"
     }
   */
  console.log("Command:", req.body.command)
  
  if(req.body.command == "dir") {
    var data = { 
      files: [
        "/log",
        "/log2",
        "/config.json",
        "/gravitymon.json",
      ]
    }
    res.type('application/json')
    res.send(data)
    return
  }
  else if(req.body.command == "del") {
    console.log(req.body.file)
    setTimeout(() => {
      res.sendStatus(200)
    }, 2000)
    return
  } else if(req.body.command == "get") {
    console.log(req.body.file)
    if(req.body.file == "/log") {
      setTimeout(() => {
        res.send("Log entry 5\nLog entry 4\nLog entry 3\nLog entry 2\nLog entry 1\n")
      }, 1000)
    } else if(req.body.file == "/log2") {
      setTimeout(() => {
        res.send("Log entry 9\nLog entry 8\nLog entry 7\nLog entry 6\n")
      }, 1000)
    } else if(req.body.file == "/config.json") {
      var ispindel = {
          "Name": "",
          "Token": "",
          "Sleep": 900,
          "Server": "",
          "API": 0,
          "Port": 80,
          "Channel": 0,
          "URI": "",
          "Username": "",
          "Password": "",
          "Job": "ispindel",
          "Instance": "000",
          "Hassio": false,
          "UseHTTPS": false,
          "Vfact": 191.8000031,
          "TS": 0,
          "OWpin": 12,
          "POLY": "-0.00031*tilt^2+0.557*tilt-14.054",
          "SSID": "my-wifi",
          "PSK": "wifi-pass",
          "Offset": [
            614,
            628,
            740,
            96,
            -60,
            3
          ]
      }
      res.send(ispindel)
    } else if(req.body.file == "/gravitymon.json"){
      var gravmon = {
        "mdns": "gravitymone18798",
        "id": "e18798",
        "ota-url": "http://ota",
        "wifi-ssid": "@home",
        "wifi-pass": "",
        "wifi-ssid2": "",
        "wifi-pass2": "",
        "ble": "pink",
        "temp-format": "C",
        "token": "token",
        "token2": "token2",
        "http-push": "http://push1",
        "http-push-h1": "Content-Type: application/json1",
        "http-push-h2": "c: d",
        "http-push2": "http://push2",
        "http-push2-h1": "Content-Type: application/json2",
        "http-push2-h2": "a: b",
        "http-push3": "http://push3",
        "influxdb2-push": "push4",
        "influxdb2-org": "org",
        "influxdb2-bucket": "bucket",
        "influxdb2-auth": "auth",
        "mqtt-push": "push5",
        "mqtt-port": 1883,
        "mqtt-user": "user",
        "mqtt-pass": "pass",
        "sleep-interval": 900,
        "voltage-factor": 0.59,
        "voltage-config": 4.15,
        "gravity-formula": "tilt*2+til*3+1.0334",
        "gravity-format": "G",
        "temp-adjustment-value": 0,
        "gravity-temp-adjustment": false,
        "gyro-temp": false,
        "storage-sleep": false,
        "gravitymon-ble": false,
        "gyro-calibration-data": {
            "ax": 0,
            "ay": 1,
            "az": 2,
            "gx": 3,
            "gy": 4,
            "gz": 5
        },
        "formula-calculation-data": {
            "a1": 1,
            "a2": 2,
            "a3": 3,
            "a4": 4,
            "a5": 5,
            "a6": 6,
            "a7": 7,
            "a8": 8,
            "a9": 9,
            "a10": 10,
            "g1": 1.01,
            "g2": 1.02,
            "g3": 1.03,
            "g4": 1.04,
            "g5": 1.05,
            "g6": 1.06,
            "g7": 1.07,
            "g8": 1.08,
            "g9": 1.09,
            "g10": 1.10
        },
        "app-ver": "1.4.0",
        "app-build": "beta-2",
        "angle": 89.943,
        "gravity": 0,
        "battery": 1.95,
        "runtime-average": 0,
        "platform": "esp32s3"
      }
      res.send(gravmon)
    }
    return
  } 

  res.sendStatus(400)
})

app.listen(port, () => {
  console.log(`Gravitymon API simulator port ${port}`)
})