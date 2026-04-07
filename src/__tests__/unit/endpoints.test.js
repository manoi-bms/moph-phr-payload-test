import { describe, it, expect } from 'vitest'
import { endpoints, getEndpointsByGroup, getEndpointById, getGroupLabel } from '../../config/endpoints'

describe('endpoints', () => {
  it('every endpoint has required fields', () => {
    endpoints.forEach(ep => {
      expect(ep).toHaveProperty('id')
      expect(ep).toHaveProperty('name')
      expect(ep).toHaveProperty('group')
      expect(ep).toHaveProperty('method')
      expect(ep).toHaveProperty('path')
      expect(ep).toHaveProperty('description')
      expect(typeof ep.authRequired).toBe('boolean')
    })
  })

  it('all groups are valid', () => {
    const validGroups = ['upload', 'retrieval', 'utility']
    endpoints.forEach(ep => {
      expect(validGroups).toContain(ep.group)
    })
  })

  it('all methods are valid', () => {
    endpoints.forEach(ep => {
      expect(['GET', 'POST']).toContain(ep.method)
    })
  })

  it('has upload endpoints', () => {
    expect(getEndpointsByGroup('upload').length).toBeGreaterThanOrEqual(10)
  })

  it('has retrieval endpoints', () => {
    expect(getEndpointsByGroup('retrieval').length).toBeGreaterThanOrEqual(15)
  })

  it('has utility endpoints', () => {
    expect(getEndpointsByGroup('utility').length).toBeGreaterThanOrEqual(10)
  })

  it('getEndpointById returns correct endpoint', () => {
    const ep = getEndpointById('update-phr-v1')
    expect(ep).toBeDefined()
    expect(ep.name).toBe('UpdatePHRv1')
  })

  it('getEndpointById returns undefined for unknown id', () => {
    expect(getEndpointById('nonexistent')).toBeUndefined()
  })

  it('getGroupLabel returns correct labels', () => {
    expect(getGroupLabel('upload')).toBe('Upload APIs')
    expect(getGroupLabel('retrieval')).toBe('Retrieval APIs')
    expect(getGroupLabel('utility')).toBe('Utility APIs')
  })

  it('all endpoint ids are unique', () => {
    const ids = endpoints.map(e => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
