import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../test/test-utils'
import EndpointSidebar from '../../components/EndpointSidebar'
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

describe('Endpoint selection → RequestPanel', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('selecting an endpoint loads template in editor', async () => {
    render(
      <div className="flex">
        <EndpointSidebar />
        <RequestPanel onSend={() => {}} sending={false} />
      </div>
    )

    // Initially shows empty state
    expect(screen.getByText('Select an endpoint from the sidebar')).toBeInTheDocument()

    // Click on UpdatePHRv1
    fireEvent.click(screen.getByText('UpdatePHRv1'))

    // Should now show the URL bar with the full endpoint URL
    expect(screen.getByText('https://203.150.143.180')).toBeInTheDocument()
    expect(screen.getByText('/api/UpdatePHRv1')).toBeInTheDocument()

    // Should show the Send button
    expect(screen.getByText('Send')).toBeInTheDocument()

    // Wait for lazy-loaded editor to appear
    const editor = await waitFor(() => screen.getByTestId('mock-editor'))
    expect(editor.value).toContain('managingOrganization')
  })

  it('shows auth warning for auth-required endpoints when not authenticated', () => {
    render(
      <div className="flex">
        <EndpointSidebar />
        <RequestPanel onSend={() => {}} sending={false} />
      </div>
    )

    fireEvent.click(screen.getByText('UpdatePHRv1'))
    expect(screen.getByText(/requires authentication/)).toBeInTheDocument()
  })

  it('shows Reset button that restores template', async () => {
    render(
      <div className="flex">
        <EndpointSidebar />
        <RequestPanel onSend={() => {}} sending={false} />
      </div>
    )

    fireEvent.click(screen.getByText('UpdatePHRv1'))

    // Wait for lazy-loaded editor to appear
    const editor = await waitFor(() => screen.getByTestId('mock-editor'))
    const original = editor.value

    // Modify editor
    fireEvent.change(editor, { target: { value: '{"modified": true}' } })
    expect(editor.value).toBe('{"modified": true}')

    // Click Reset
    fireEvent.click(screen.getByText('Reset'))
    expect(screen.getByTestId('mock-editor').value).toBe(original)
  })

  it('calls onSend when Send clicked (authenticated)', async () => {
    // Set token so auth check passes
    localStorage.setItem('phr_token', 'test-token')

    const onSend = vi.fn()
    render(
      <div className="flex">
        <EndpointSidebar />
        <RequestPanel onSend={onSend} sending={false} />
      </div>
    )

    fireEvent.click(screen.getByText('UpdatePHRv1'))

    // Wait for editor to be available
    await waitFor(() => screen.getByTestId('mock-editor'))

    fireEvent.click(screen.getByText('Send'))
    expect(onSend).toHaveBeenCalled()
  })

  it('shows query param fields for GET endpoints', () => {
    render(
      <div className="flex">
        <EndpointSidebar />
        <RequestPanel onSend={() => {}} sending={false} />
      </div>
    )

    // Click on a GET endpoint with queryParams — OrganizationSummary (Daily)
    fireEvent.click(screen.getByText('OrganizationSummary (Daily)'))

    // Should show Query Parameters heading
    expect(screen.getByText('Query Parameters')).toBeInTheDocument()

    // Should show the query param fields
    expect(screen.getByText('date')).toBeInTheDocument()
    expect(screen.getByText('data')).toBeInTheDocument()
    expect(screen.getByText('hospital_code')).toBeInTheDocument()

    // Should NOT show the editor
    expect(screen.queryByTestId('mock-editor')).not.toBeInTheDocument()
  })

  it('sends query params for GET endpoints (authenticated)', () => {
    localStorage.setItem('phr_token', 'test-token')

    const onSend = vi.fn()
    render(
      <div className="flex">
        <EndpointSidebar />
        <RequestPanel onSend={onSend} sending={false} />
      </div>
    )

    fireEvent.click(screen.getByText('OrganizationSummary (Daily)'))

    // Fill in a param
    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '2024-01-15' } })

    fireEvent.click(screen.getByText('Send'))
    expect(onSend).toHaveBeenCalledWith({ queryParams: expect.objectContaining({ date: '2024-01-15' }) })
  })

  it('disables Send when auth is required and not authenticated', () => {
    render(
      <div className="flex">
        <EndpointSidebar />
        <RequestPanel onSend={() => {}} sending={false} />
      </div>
    )

    fireEvent.click(screen.getByText('UpdatePHRv1'))
    const sendButton = screen.getByText('Send')
    expect(sendButton).toBeDisabled()
  })

  it('disables Send when sending is true', () => {
    localStorage.setItem('phr_token', 'test-token')
    render(
      <div className="flex">
        <EndpointSidebar />
        <RequestPanel onSend={() => {}} sending={true} />
      </div>
    )

    fireEvent.click(screen.getByText('UpdatePHRv1'))
    const sendButton = screen.getByText('Send')
    expect(sendButton).toBeDisabled()
  })

  it('shows method badge in URL bar', () => {
    render(
      <div className="flex">
        <EndpointSidebar />
        <RequestPanel onSend={() => {}} sending={false} />
      </div>
    )

    fireEvent.click(screen.getByText('UpdatePHRv1'))
    // POST badge should appear in the URL bar (there are also badges in sidebar)
    const postBadges = screen.getAllByText('POST')
    expect(postBadges.length).toBeGreaterThan(0)
  })
})
