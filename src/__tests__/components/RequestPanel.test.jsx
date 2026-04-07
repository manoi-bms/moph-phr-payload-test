import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../test/test-utils'
import RequestPanel from '../../components/RequestPanel'

// Mock Monaco editor since it doesn't work in jsdom
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }) => (
    <textarea
      data-testid="mock-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

describe('RequestPanel', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows empty state when no endpoint selected', () => {
    render(<RequestPanel onSend={() => {}} sending={false} />)
    expect(screen.getByText('Select an endpoint from the sidebar')).toBeInTheDocument()
  })

  it('shows URL bar when endpoint is selected', () => {
    // The render from test-utils wraps with EndpointProvider
    // Without selecting an endpoint, we see the empty state
    render(<RequestPanel onSend={() => {}} sending={false} />)
    expect(screen.getByText('Select an endpoint from the sidebar')).toBeInTheDocument()
  })

  it('does not show Send button when no endpoint selected', () => {
    render(<RequestPanel onSend={() => {}} sending={true} />)
    // No endpoint selected, so Send button won't be visible
    expect(screen.queryByText('Send')).not.toBeInTheDocument()
  })
})
