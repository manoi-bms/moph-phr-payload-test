import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../test/test-utils'
import AuthModal from '../../components/AuthModal'

describe('AuthModal', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders nothing when not open', () => {
    const { container } = render(<AuthModal isOpen={false} onClose={() => {}} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders three tabs when open', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />)
    // "Login" appears both as a tab and as the submit button, so use getAllByText
    expect(screen.getAllByText('Login').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Paste JWT')).toBeInTheDocument()
    expect(screen.getByText('Fixed Token')).toBeInTheDocument()
  })

  it('shows login form by default', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByPlaceholderText('cvp_user')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('FFFFFFFFFFFFFFFF')).toBeInTheDocument()
  })

  it('switches to Paste JWT tab', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />)
    fireEvent.click(screen.getByText('Paste JWT'))
    expect(screen.getByPlaceholderText(/eyJhbGci/)).toBeInTheDocument()
  })

  it('switches to Fixed Token tab with defaults', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />)
    fireEvent.click(screen.getByText('Fixed Token'))
    // Should show the default token preview
    expect(screen.getByText(/Bearer 00000:\{F5168AEE/)).toBeInTheDocument()
  })

  it('calls onClose when Fixed Token submitted', () => {
    const onClose = vi.fn()
    render(<AuthModal isOpen={true} onClose={onClose} />)
    fireEvent.click(screen.getByText('Fixed Token'))
    fireEvent.click(screen.getByText('Set Fixed Token'))
    expect(onClose).toHaveBeenCalled()
  })

  it('disables Login button when fields are empty', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />)
    // Login button should be disabled when user/password are empty
    const loginBtns = screen.getAllByText('Login')
    // The submit button is the one that's a button type=submit (the last one)
    const submitBtn = loginBtns[loginBtns.length - 1]
    expect(submitBtn).toBeDisabled()
  })

  it('disables Paste JWT button when empty', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />)
    fireEvent.click(screen.getByText('Paste JWT'))
    expect(screen.getByText('Set Token')).toBeDisabled()
  })
})
