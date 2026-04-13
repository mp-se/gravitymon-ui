import { describe, it, expect, beforeEach } from 'vitest'
import {
  applyTemplate,
  isGyroCalibrated,
  httpHeaderOptions,
  httpPostUrlOptions,
  httpPostFormatOptions,
  httpGetFormatOptions,
  influxdb2FormatOptions,
  mqttFormatOptions,
  httpGetUrlOptions
} from '@/modules/utils'
import { config, global } from '@/modules/pinia'

describe('utils.applyTemplate', () => {
  beforeEach(() => {
    global.app_ver = '3.0.0'
    global.app_build = '42'
  })

  it('replaces temperature placeholders', () => {
    const status = { temp: 20, angle: 0, rssi: 0, gravity: 1.0, battery: 0 }
    const cfg = {
      mdns: 'test',
      id: '1',
      sleep_interval: 60,
      token: '',
      token2: '',
      temp_unit: 'C',
      gravity_unit: 'G'
    }

    const template = '{"temp": ${temp}}'
    const result = applyTemplate(status, cfg, template)

    expect(result).toContain('"temp": 20')
  })

  it('converts temperature C to F', () => {
    const status = { temp: 20, angle: 0, rssi: 0, gravity: 1.0, battery: 0 }
    const cfg = {
      mdns: 'test',
      id: '1',
      sleep_interval: 60,
      token: '',
      token2: '',
      temp_unit: 'C',
      gravity_unit: 'G'
    }

    const template = '{"temp_f": ${temp-f}}'
    const result = applyTemplate(status, cfg, template)

    expect(result).toContain('"temp_f": 68')
  })

  it('handles gravity unit G (SG)', () => {
    const status = { temp: 20, angle: 0, rssi: 0, gravity: 1.05, battery: 0 }
    const cfg = {
      mdns: 'test',
      id: '1',
      sleep_interval: 60,
      token: '',
      token2: '',
      temp_unit: 'C',
      gravity_unit: 'G'
    }

    const template = '{"gravity": ${gravity}}'
    const result = applyTemplate(status, cfg, template)

    expect(result).toContain('"gravity": 1.05')
  })

  it('handles gravity unit P (Plato)', () => {
    const status = { temp: 20, angle: 0, rssi: 0, gravity: 5.0, battery: 0 }
    const cfg = {
      mdns: 'test',
      id: '1',
      sleep_interval: 60,
      token: '',
      token2: '',
      temp_unit: 'C',
      gravity_unit: 'P'
    }

    const template = '{"gravity": ${gravity}}'
    const result = applyTemplate(status, cfg, template)

    expect(result).toContain('"gravity": 5')
  })

  it('replaces config placeholders', () => {
    const status = { temp: 20, angle: 10, rssi: -50, gravity: 1.05, battery: 3.7 }
    const cfg = {
      mdns: 'myhost',
      id: '42',
      sleep_interval: 120,
      token: 'secret',
      token2: 'secret2',
      temp_unit: 'C',
      gravity_unit: 'G'
    }

    const template = '{"mdns": "${mdns}", "id": "${id}", "token": "${token}"}'
    const result = applyTemplate(status, cfg, template)

    expect(result).toContain('"mdns": "myhost"')
    expect(result).toContain('"id": "42"')
    expect(result).toContain('"token": "secret"')
  })

  it('replaces angle/tilt placeholders', () => {
    const status = { temp: 20, angle: 25.5, rssi: -50, gravity: 1.05, battery: 3.7 }
    const cfg = {
      mdns: 'test',
      id: '1',
      sleep_interval: 60,
      token: '',
      token2: '',
      temp_unit: 'C',
      gravity_unit: 'G'
    }

    const template = '{"angle": ${angle}, "tilt": ${tilt}}'
    const result = applyTemplate(status, cfg, template)

    expect(result).toContain('"angle": 25.5')
    expect(result).toContain('"tilt": 25.5')
  })

  it('replaces battery and RSSI placeholders', () => {
    const status = { temp: 20, angle: 10, rssi: -45, gravity: 1.05, battery: 3.85 }
    const cfg = {
      mdns: 'test',
      id: '1',
      sleep_interval: 60,
      token: '',
      token2: '',
      temp_unit: 'C',
      gravity_unit: 'G'
    }

    const template = '{"battery": ${battery}, "rssi": ${rssi}}'
    const result = applyTemplate(status, cfg, template)

    expect(result).toContain('"battery": 3.85')
    expect(result).toContain('"rssi": -45')
  })

  it('replaces app metadata placeholders', () => {
    const status = { temp: 20, angle: 0, rssi: 0, gravity: 1.0, battery: 0 }
    const cfg = {
      mdns: 'test',
      id: '1',
      sleep_interval: 60,
      token: '',
      token2: '',
      temp_unit: 'C',
      gravity_unit: 'G'
    }

    const template = '{"version": "${app-ver}", "build": "${app-build}"}'
    const result = applyTemplate(status, cfg, template)

    expect(result).toContain('"version": "3.0.0"')
    expect(result).toContain('"build": "42"')
  })

  it('returns formatted JSON when template is valid JSON', () => {
    const status = { temp: 20, angle: 0, rssi: 0, gravity: 1.0, battery: 0 }
    const cfg = {
      mdns: 'test',
      id: '1',
      sleep_interval: 60,
      token: '',
      token2: '',
      temp_unit: 'C',
      gravity_unit: 'G'
    }

    const template = '{"temp":${temp}}'
    const result = applyTemplate(status, cfg, template)

    expect(() => JSON.parse(result)).not.toThrow()
  })

  it('returns string when template is not valid JSON', () => {
    const status = { temp: 20, angle: 0, rssi: 0, gravity: 1.0, battery: 0 }
    const cfg = {
      mdns: 'test',
      id: '1',
      sleep_interval: 60,
      token: '',
      token2: '',
      temp_unit: 'C',
      gravity_unit: 'G'
    }

    const template = 'not json: ${temp}'
    const result = applyTemplate(status, cfg, template)

    expect(typeof result).toBe('string')
    expect(result).toContain('not json: 20')
  })

  it('computes tempToC when device unit is F', () => {
    const status = { temp: 68, angle: 0, rssi: 0, gravity: 1.0, battery: 0 }
    const cfg = {
      mdns: 'test',
      id: '1',
      sleep_interval: 60,
      token: '',
      token2: '',
      temp_unit: 'F',
      gravity_unit: 'G'
    }
    const result = applyTemplate(status, cfg, '${temp-c}')
    expect(result).toBe('20')
  })
})

describe('utils.isGyroCalibrated', () => {
  it('returns false when calibration data sums to zero', () => {
    config.gyro_calibration_data = { ax: 0, ay: 0, az: 0, gx: 0, gy: 0, gz: 0 }
    expect(isGyroCalibrated()).toBe(false)
  })

  it('returns true when at least one calibration value is non-zero', () => {
    config.gyro_calibration_data = { ax: 1, ay: 0, az: 0, gx: 0, gy: 0, gz: 0 }
    expect(isGyroCalibrated()).toBe(true)
  })

  it('returns true when multiple calibration values are non-zero', () => {
    config.gyro_calibration_data = { ax: 10, ay: 5, az: -3, gx: 2, gy: 1, gz: 8 }
    expect(isGyroCalibrated()).toBe(true)
  })

  it('returns true when at least gyro values are calibrated', () => {
    config.gyro_calibration_data = { ax: 0, ay: 0, az: 0, gx: 1, gy: 0, gz: 0 }
    expect(isGyroCalibrated()).toBe(true)
  })
})

describe('utils - exported options/constants', () => {
  it('exports httpHeaderOptions as a ref-like object', () => {
    expect(httpHeaderOptions).toBeTruthy()
    expect(httpHeaderOptions.value).toBeTruthy()
    expect(Array.isArray(httpHeaderOptions.value)).toBe(true)
  })

  it('httpHeaderOptions contains expected items', () => {
    const labels = httpHeaderOptions.value.map((opt) => opt.label)
    expect(labels).toContain('JSON data')
    expect(labels).toContain('Authorization')
    expect(labels).toContain('User agent')
  })

  it('exports httpPostUrlOptions', () => {
    expect(httpPostUrlOptions).toBeTruthy()
    expect(httpPostUrlOptions.value).toBeTruthy()
    expect(Array.isArray(httpPostUrlOptions.value)).toBe(true)
  })

  it('httpPostUrlOptions contains known services', () => {
    const labels = httpPostUrlOptions.value.map((opt) => opt.label)
    expect(labels.some((l) => l.includes('Brewfather'))).toBe(true)
    expect(labels.some((l) => l.includes('UBI'))).toBe(true)
  })

  it('exports httpPostFormatOptions', () => {
    expect(httpPostFormatOptions).toBeTruthy()
    expect(httpPostFormatOptions.value).toBeTruthy()
  })

  it('exports httpGetFormatOptions', () => {
    expect(httpGetFormatOptions).toBeTruthy()
    expect(httpGetFormatOptions.value).toBeTruthy()
  })

  it('exports influxdb2FormatOptions', () => {
    expect(influxdb2FormatOptions).toBeTruthy()
    expect(influxdb2FormatOptions.value).toBeTruthy()
  })

  it('exports mqttFormatOptions', () => {
    expect(mqttFormatOptions).toBeTruthy()
    expect(mqttFormatOptions.value).toBeTruthy()
  })

  it('exports httpGetUrlOptions', () => {
    expect(httpGetUrlOptions).toBeTruthy()
    expect(httpGetUrlOptions.value).toBeTruthy()
  })
})
