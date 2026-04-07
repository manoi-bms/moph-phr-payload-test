import { describe, it, expect } from 'vitest'

describe('Test setup', () => {
  it('runs tests successfully', () => {
    expect(true).toBe(true)
  })

  it('supports jsdom environment', () => {
    expect(document).toBeDefined()
    expect(window).toBeDefined()
  })
})
