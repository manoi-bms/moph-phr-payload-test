/**
 * Format HCODE:TOKEN for the fixed token auth method
 */
export function formatFixedToken(hospitalCode, token) {
  return `${hospitalCode}:${token}`
}

/**
 * Login via MOPH Account Center
 * POST to /proxy/auth/token?Action=get_moph_access_token
 */
export async function loginMophAccount({ user, passwordHash, hospitalCode }) {
  const response = await fetch('/proxy/auth/token?Action=get_moph_access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user,
      password_hash: passwordHash,
      hospital_code: hospitalCode,
    }),
  })

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.text()
  // The API returns the JWT directly as text
  if (!data || data.length < 10) {
    throw new Error('Invalid token received from server')
  }

  return data.trim()
}
