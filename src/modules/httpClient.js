// Minimal centralized HTTP client to standardize fetch usage across the app.
// Provides timeout, automatic Authorization header injection (from a getter),
// convenience helpers returning Promises (json/text), and built-in logging.
import { logInfo, logError } from '@mp-se/espframework-ui-components'
class HttpClient {
  constructor() {
    // autodetect base URL from env or window location
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_APP_HOST) {
      this.baseURL = import.meta.env.VITE_APP_HOST
    } else if (typeof window !== 'undefined' && window.location) {
      this.baseURL = window.location.href
    } else {
      this.baseURL = ''
    }

    // default timeout (ms)
    this.timeout =
      typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FETCH_TIMEOUT
        ? Number(import.meta.env.VITE_FETCH_TIMEOUT)
        : 8000

    this.token = ''
  }

  buildUrl(path) {
    if (!path) return this.baseURL
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    return this.baseURL.endsWith('/') || path.startsWith('/')
      ? this.baseURL + path.replace(/^\//, '')
      : this.baseURL + path
  }

  async request(path, { method = 'GET', headers = {}, body, timeout } = {}) {
    const url = this.buildUrl(path)
    const controller = new AbortController()
    const t = timeout === undefined ? this.timeout : timeout

    const finalHeaders = Object.assign({}, headers)
    if (this.token && !Object.keys(finalHeaders).some((k) => k.toLowerCase() === 'authorization')) {
      finalHeaders['Authorization'] = this.token
    }

    const timer = setTimeout(() => controller.abort(), t)

    const res = await fetch(url, {
      method,
      headers: finalHeaders,
      body,
      signal: controller.signal
    })
    clearTimeout(timer)
    return res
  }

  async getJson(path, opts = {}) {
    const res = await this.request(path, Object.assign({ method: 'GET' }, opts))
    if (!res) return null
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    return res.json()
  }

  async postJson(path, data, opts = {}) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {})
    const body = JSON.stringify(data)
    const res = await this.request(path, Object.assign({ method: 'POST', headers, body }, opts))
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    return res
  }

  async postText(path, data, opts = {}) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {})
    const body = JSON.stringify(data)
    const res = await this.request(path, Object.assign({ method: 'POST', headers, body }, opts))
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    return res.text()
  }

  // Convenience helper to interact with the device filesystem API.
  // Accepts a data object, posts to 'api/filesystem' and returns an object
  // { success: boolean, text: string } to match previous callers' expectations.
  async filesystemRequest(data) {
    try {
      logInfo('httpClient.filesystemRequest()', 'Sending /api/filesystem')
      const text = await this.postText('api/filesystem', data)
      return { success: true, text }
    } catch (err) {
      logError('httpClient.filesystemRequest()', err)
      return { success: false, text: '' }
    }
  }

  // Ping the device to check connectivity. Returns boolean success/failure.
  async ping() {
    try {
      await this.getJson('api/ping')
      return true
    } catch (err) {
      logError('httpClient.ping()', err)
      return false
    }
  }

  // Map device push error codes to human readable messages
  getErrorString(code) {
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
      default:
        return ''
    }
  }

  // Perform Basic auth against device and store token on success.
  // optional `basicBase` should be the base64 encoded "user:pass" string (without the 'Basic ' prefix)
  // Performs auth, logs errors internally and returns boolean success/failure.
  async auth(basicBase) {
    try {
      const base = basicBase
      logInfo('httpClient.auth()', 'Requesting /api/auth')
      const response = await this.request('api/auth', {
        method: 'GET',
        headers: { Authorization: 'Basic ' + base }
      })
      if (!response.ok) {
        const err = new Error(`HTTP ${response.status}: ${response.statusText}`)
        logError('httpClient.auth()', err)
        return false
      }
      const json = await response.json()
      if (json && json.token) {
        this.token = json.token
        logInfo('httpClient.auth()', 'Authentication succeeded, token set')
        return true
      }
      const noTokenErr = new Error('Authentication response did not contain token')
      logError('httpClient.auth()', noTokenErr)
      return false
    } catch (err) {
      logError('httpClient.auth()', err)
      return false
    }
  }

  // token is stored only in-memory; no explicit clearToken API
}

// Backwards-compatible factory wrapper
export { HttpClient }

// Shared singleton client (will be initialized lazily; consumers should set baseURL/token/timeout)
const sharedHttpClient = new HttpClient()
export { sharedHttpClient }
