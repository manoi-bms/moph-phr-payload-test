import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendRequest, buildRequestUrl } from '../../utils/apiClient'

describe('sendRequest', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('builds correct URL from proxyBase and path', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ result: 'ok' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await sendRequest({
      method: 'POST',
      path: '/api/UpdatePHRv1',
      body: '{}',
      token: 'test-token',
      proxyBase: '/proxy/uat',
    })

    expect(mockFetch).toHaveBeenCalledWith(
      '/proxy/uat/api/UpdatePHRv1',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('sets Authorization header when token provided', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    await sendRequest({
      method: 'POST',
      path: '/api/test',
      body: '{}',
      token: 'my-jwt-token',
      proxyBase: '/proxy/uat',
    })

    const callHeaders = mockFetch.mock.calls[0][1].headers
    expect(callHeaders['Authorization']).toBe('Bearer my-jwt-token')
  })

  it('does not set Authorization when no token', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'text/plain' }),
      text: () => Promise.resolve('ok'),
    })
    vi.stubGlobal('fetch', mockFetch)

    await sendRequest({
      method: 'POST',
      path: '/api/test',
      body: '{}',
      token: '',
      proxyBase: '/proxy/uat',
    })

    const callHeaders = mockFetch.mock.calls[0][1].headers
    expect(callHeaders['Authorization']).toBeUndefined()
  })

  it('includes body for POST requests', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    const body = '{"test": true}'
    await sendRequest({
      method: 'POST',
      path: '/api/test',
      body,
      token: '',
      proxyBase: '/proxy/uat',
    })

    expect(mockFetch.mock.calls[0][1].body).toBe(body)
  })

  it('does not include body for GET requests', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    await sendRequest({
      method: 'GET',
      path: '/api/test',
      queryParams: { date: '2024-01-01' },
      token: '',
      proxyBase: '/proxy/uat',
    })

    expect(mockFetch.mock.calls[0][1].body).toBeUndefined()
  })

  it('appends query params for GET requests', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    await sendRequest({
      method: 'GET',
      path: '/api/OrganizationSummary',
      queryParams: { date: '2024-01-01', data: 'encounter_ref_code', hospital_code: '00000' },
      token: 'tok',
      proxyBase: '/proxy/uat',
    })

    const url = mockFetch.mock.calls[0][0]
    expect(url).toContain('date=2024-01-01')
    expect(url).toContain('hospital_code=00000')
  })

  it('returns parsed JSON data', async () => {
    const mockData = { MessageCode: 200, Message: 'OK' }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve(mockData),
    }))

    const result = await sendRequest({
      method: 'POST',
      path: '/api/test',
      body: '{}',
      token: '',
      proxyBase: '/proxy/uat',
    })

    expect(result.status).toBe(200)
    expect(result.data).toEqual(mockData)
    expect(result.elapsed).toBeGreaterThanOrEqual(0)
    expect(result.error).toBeNull()
  })

  it('handles network errors gracefully', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')))

    const result = await sendRequest({
      method: 'POST',
      path: '/api/test',
      body: '{}',
      token: '',
      proxyBase: '/proxy/uat',
    })

    expect(result.status).toBe(0)
    expect(result.statusText).toBe('Network Error')
    expect(result.error).toBe('Network failure')
  })

  it('returns text for non-JSON responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'text/plain' }),
      text: () => Promise.resolve('raw text response'),
    }))

    const result = await sendRequest({
      method: 'POST',
      path: '/api/test',
      body: '{}',
      token: '',
      proxyBase: '/proxy/uat',
    })

    expect(result.data).toBe('raw text response')
  })
})

describe('buildRequestUrl', () => {
  it('builds URL without params', () => {
    expect(buildRequestUrl('/proxy/uat', '/api/test')).toBe('/proxy/uat/api/test')
  })

  it('appends query params', () => {
    const url = buildRequestUrl('/proxy/uat', '/api/test', { date: '2024-01-01' })
    expect(url).toContain('date=2024-01-01')
  })

  it('handles path with existing query string', () => {
    const url = buildRequestUrl('/proxy/uat', '/api/WebApp?Action=Encounter', { mode: 'Detail' })
    expect(url).toContain('Action=Encounter')
    expect(url).toContain('mode=Detail')
  })

  it('skips empty param values', () => {
    const url = buildRequestUrl('/proxy/uat', '/api/test', { date: '2024-01-01', empty: '' })
    expect(url).toContain('date=2024-01-01')
    expect(url).not.toContain('empty=')
  })
})
