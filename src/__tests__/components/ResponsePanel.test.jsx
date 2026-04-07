import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../../test/test-utils'
import ResponsePanel from '../../components/ResponsePanel'

// Mock Monaco
vi.mock('@monaco-editor/react', () => ({
  default: ({ value }) => <pre data-testid="mock-response-editor">{value}</pre>,
}))

describe('ResponsePanel', () => {
  it('shows empty state when no response', () => {
    render(<ResponsePanel response={null} loading={false} />)
    expect(screen.getByText('Response will appear here')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<ResponsePanel response={null} loading={true} />)
    expect(screen.getByText('Sending request...')).toBeInTheDocument()
  })

  it('shows status code for successful response', () => {
    render(<ResponsePanel response={{
      status: 200,
      statusText: 'OK',
      data: { result: 'success' },
      elapsed: 150,
      url: '/proxy/uat/api/test',
      error: null,
    }} loading={false} />)

    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('OK')).toBeInTheDocument()
    expect(screen.getByText('150ms')).toBeInTheDocument()
  })

  it('shows error response', () => {
    render(<ResponsePanel response={{
      status: 0,
      statusText: 'Network Error',
      data: null,
      elapsed: 50,
      url: null,
      error: 'Connection refused',
    }} loading={false} />)

    expect(screen.getByText('ERR')).toBeInTheDocument()
    expect(screen.getByText('Network Error')).toBeInTheDocument()
  })

  it('formats JSON response data', () => {
    render(<ResponsePanel response={{
      status: 200,
      statusText: 'OK',
      data: { MessageCode: 200, Message: 'OK' },
      elapsed: 100,
      url: '/proxy/uat/api/test',
      error: null,
    }} loading={false} />)

    const editor = screen.getByTestId('mock-response-editor')
    expect(editor.textContent).toContain('MessageCode')
    expect(editor.textContent).toContain('200')
  })
})
