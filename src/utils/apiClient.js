/**
 * Send an API request through the Vite dev proxy
 *
 * @param {Object} params
 * @param {string} params.method - HTTP method (GET/POST)
 * @param {string} params.path - API path (e.g. /api/UpdatePHRv1)
 * @param {string} params.body - JSON string body (for POST)
 * @param {Object} params.queryParams - Query params (for GET endpoints)
 * @param {string} params.token - Auth token (Bearer)
 * @param {string} params.proxyBase - Proxy base path (/proxy/uat or /proxy/prod)
 * @returns {Promise<Object>} { status, statusText, data, elapsed, url, error }
 */
export async function sendRequest({ method, path, body, queryParams, token, proxyBase }) {
  // Build URL
  let url = `${proxyBase}${path}`

  // For GET requests with query params, append them to URL
  if (method === 'GET' && queryParams) {
    const params = new URLSearchParams()
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    const qs = params.toString()
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs
    }
  }

  const headers = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const options = { method, headers }

  if (method === 'POST') {
    headers['Content-Type'] = 'application/json'
    if (body) {
      options.body = body
    }
  }

  const startTime = performance.now()

  try {
    const response = await fetch(url, options)
    const elapsed = Math.round(performance.now() - startTime)

    let data
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        data = await response.json()
      } catch {
        data = await response.text()
      }
    } else {
      data = await response.text()
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data,
      elapsed,
      url,
      error: null,
    }
  } catch (err) {
    const elapsed = Math.round(performance.now() - startTime)
    return {
      status: 0,
      statusText: 'Network Error',
      data: null,
      elapsed,
      url,
      error: err.message,
    }
  }
}

/**
 * Build the full URL for display purposes (without actually sending)
 */
export function buildRequestUrl(proxyBase, path, queryParams) {
  let url = `${proxyBase}${path}`
  if (queryParams) {
    const params = new URLSearchParams()
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    const qs = params.toString()
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs
    }
  }
  return url
}
