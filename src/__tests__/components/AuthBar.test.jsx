import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../test/test-utils'
import AuthBar from '../../components/AuthBar'

describe('AuthBar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders app title', () => {
    render(<AuthBar onLoginClick={() => {}} />)
    expect(screen.getByText('MOPH PHR API Tester')).toBeInTheDocument()
  })

  it('shows not authenticated state', () => {
    render(<AuthBar onLoginClick={() => {}} />)
    expect(screen.getByText('Not authenticated')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('shows UAT environment by default', () => {
    render(<AuthBar onLoginClick={() => {}} />)
    expect(screen.getByText('UAT')).toBeInTheDocument()
  })

  it('toggles environment on click', () => {
    render(<AuthBar onLoginClick={() => {}} />)
    fireEvent.click(screen.getByText('UAT'))
    expect(screen.getByText('Production')).toBeInTheDocument()
  })

  it('calls onLoginClick when Login button clicked', () => {
    const mockFn = vi.fn()
    render(<AuthBar onLoginClick={mockFn} />)
    fireEvent.click(screen.getByText('Login'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
