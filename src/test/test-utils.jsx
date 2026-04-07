import { render } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'

function renderWithProviders(ui, options = {}) {
  function Wrapper({ children }) {
    return <AuthProvider>{children}</AuthProvider>
  }
  return render(ui, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/react'
export { renderWithProviders as render }
