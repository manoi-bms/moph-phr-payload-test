import { describe, it, expect } from 'vitest'
import { formatFixedToken } from '../../utils/auth'

describe('formatFixedToken', () => {
  it('formats hospital code and token correctly', () => {
    expect(formatFixedToken('00000', '{F5168AEE-5F6E-4479-8514-988FBB167155}')).toBe('00000:{F5168AEE-5F6E-4479-8514-988FBB167155}')
  })

  it('handles different hospital codes', () => {
    expect(formatFixedToken('12345', '{TOKEN}')).toBe('12345:{TOKEN}')
  })
})
