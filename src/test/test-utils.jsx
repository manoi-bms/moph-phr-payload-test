import { render } from '@testing-library/react'

// Will be expanded with providers in later tasks
function renderWithProviders(ui, options = {}) {
  return render(ui, { ...options })
}

export * from '@testing-library/react'
export { renderWithProviders as render }
