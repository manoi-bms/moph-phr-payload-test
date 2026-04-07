import { render } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import { EndpointProvider } from '../context/EndpointContext'
import { HistoryProvider } from '../context/HistoryContext'

function renderWithProviders(ui, options = {}) {
  function Wrapper({ children }) {
    return (
      <AuthProvider>
        <EndpointProvider>
          <HistoryProvider>
            {children}
          </HistoryProvider>
        </EndpointProvider>
      </AuthProvider>
    )
  }
  return render(ui, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/react'
export { renderWithProviders as render }
