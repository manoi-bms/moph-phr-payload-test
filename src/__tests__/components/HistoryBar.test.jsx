import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../test/test-utils'
import HistoryBar from '../../components/HistoryBar'

describe('HistoryBar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders nothing when history is empty and collapsed', () => {
    const { container } = render(<HistoryBar onReplay={() => {}} />)
    expect(container.innerHTML).toBe('')
  })

  it('shows history count in toggle button when entries exist', () => {
    localStorage.setItem('phr_history', JSON.stringify([
      { id: '1', timestamp: new Date().toISOString(), endpointName: 'Test', method: 'POST', status: 200, elapsed: 100 }
    ]))
    render(<HistoryBar onReplay={() => {}} />)
    expect(screen.getByText(/History \(1\)/)).toBeInTheDocument()
  })

  it('expands on click to show entries', () => {
    localStorage.setItem('phr_history', JSON.stringify([
      { id: '1', timestamp: new Date().toISOString(), endpointName: 'UpdatePHRv1', method: 'POST', status: 200, elapsed: 150 }
    ]))
    render(<HistoryBar onReplay={() => {}} />)
    fireEvent.click(screen.getByText(/History/))
    expect(screen.getByText('UpdatePHRv1')).toBeInTheDocument()
    expect(screen.getByText('150ms')).toBeInTheDocument()
  })

  it('calls onReplay when entry clicked', () => {
    const onReplay = vi.fn()
    localStorage.setItem('phr_history', JSON.stringify([
      { id: '1', timestamp: new Date().toISOString(), endpointName: 'UpdatePHRv1', method: 'POST', status: 200, elapsed: 150, endpointId: 'update-phr-v1' }
    ]))
    render(<HistoryBar onReplay={onReplay} />)
    fireEvent.click(screen.getByText(/History/))
    fireEvent.click(screen.getByText('UpdatePHRv1'))
    expect(onReplay).toHaveBeenCalledWith(expect.objectContaining({ endpointName: 'UpdatePHRv1' }))
  })

  it('shows Clear button when expanded', () => {
    localStorage.setItem('phr_history', JSON.stringify([
      { id: '1', timestamp: new Date().toISOString(), endpointName: 'Test', method: 'POST', status: 200, elapsed: 100 }
    ]))
    render(<HistoryBar onReplay={() => {}} />)
    fireEvent.click(screen.getByText(/History/))
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })
})
