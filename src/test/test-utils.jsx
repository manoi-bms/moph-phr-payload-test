import { render } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { EndpointProvider } from '../context/EndpointContext'

function renderWithProviders(ui, options = {}) {
  function Wrapper({ children }) {
    return (
      <AuthProvider>
        <EndpointProvider>
          {children}
        </EndpointProvider>
      </AuthProvider>
    )
  }
  return render(ui, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/react'
export { renderWithProviders as render }
