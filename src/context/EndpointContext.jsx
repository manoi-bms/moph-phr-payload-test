import { createContext, useContext, useState, useCallback } from 'react'
import { getEndpointById } from '../config/endpoints'
import { templates } from '../config/templates'

const EndpointContext = createContext(null)

export function EndpointProvider({ children }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null)
  const [requestBody, setRequestBody] = useState('')

  const selectEndpoint = useCallback((endpointId) => {
    const ep = getEndpointById(endpointId)
    if (!ep) return
    setSelectedEndpoint(ep)
    const template = templates[endpointId]
    setRequestBody(template ? JSON.stringify(template, null, 2) : '')
  }, [])

  const resetTemplate = useCallback(() => {
    if (!selectedEndpoint) return
    const template = templates[selectedEndpoint.id]
    setRequestBody(template ? JSON.stringify(template, null, 2) : '')
  }, [selectedEndpoint])

  return (
    <EndpointContext.Provider value={{
      selectedEndpoint,
      requestBody,
      setRequestBody,
      selectEndpoint,
      resetTemplate,
    }}>
      {children}
    </EndpointContext.Provider>
  )
}

export const useEndpoint = () => {
  const ctx = useContext(EndpointContext)
  if (!ctx) throw new Error('useEndpoint must be used within EndpointProvider')
  return ctx
}
