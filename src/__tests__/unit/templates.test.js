import { describe, it, expect } from 'vitest'
import { templates } from '../../config/templates'
import { endpoints } from '../../config/endpoints'

describe('templates', () => {
  it('every POST endpoint has a template', () => {
    const postEndpoints = endpoints.filter(e => e.method === 'POST')
    postEndpoints.forEach(ep => {
      expect(templates).toHaveProperty(ep.id)
      expect(templates[ep.id]).not.toBeNull()
    })
  })

  it('all templates are valid objects', () => {
    Object.entries(templates).forEach(([id, template]) => {
      if (template !== null) {
        expect(typeof template).toBe('object')
        // Verify it can be serialized to valid JSON
        expect(() => JSON.stringify(template)).not.toThrow()
      }
    })
  })

  it('upload templates have managingOrganization', () => {
    const uploadEps = endpoints.filter(e => e.group === 'upload' && e.id !== 'self-observation')
    uploadEps.forEach(ep => {
      const tpl = templates[ep.id]
      expect(tpl).toHaveProperty('managingOrganization')
    })
  })

  it('upload templates use test hospital code 00000', () => {
    const uploadEps = endpoints.filter(e => e.group === 'upload' && e.id !== 'self-observation')
    uploadEps.forEach(ep => {
      const tpl = templates[ep.id]
      expect(tpl.managingOrganization.identifier.value).toBe('00000')
    })
  })

  it('retrieval templates have cid field', () => {
    const retrievalEps = endpoints.filter(e => e.group === 'retrieval')
    retrievalEps.forEach(ep => {
      const tpl = templates[ep.id]
      expect(tpl).toHaveProperty('cid')
    })
  })
})
