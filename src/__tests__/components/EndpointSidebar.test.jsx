import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../test/test-utils'
import EndpointSidebar from '../../components/EndpointSidebar'

describe('EndpointSidebar', () => {
  it('renders three group headers', () => {
    render(<EndpointSidebar />)
    expect(screen.getByText('Upload APIs')).toBeInTheDocument()
    expect(screen.getByText('Retrieval APIs')).toBeInTheDocument()
    expect(screen.getByText('Utility APIs')).toBeInTheDocument()
  })

  it('renders endpoint names', () => {
    render(<EndpointSidebar />)
    expect(screen.getByText('UpdatePHRv1')).toBeInTheDocument()
    expect(screen.getByText('AllergyIntolerancev1')).toBeInTheDocument()
  })

  it('renders method badges', () => {
    render(<EndpointSidebar />)
    // Should have multiple POST and some GET badges
    const postBadges = screen.getAllByText('POST')
    expect(postBadges.length).toBeGreaterThan(0)
  })

  it('collapses group when header clicked', () => {
    render(<EndpointSidebar />)
    // UpdatePHRv1 should be visible initially
    expect(screen.getByText('UpdatePHRv1')).toBeInTheDocument()
    // Click Upload APIs header to collapse
    fireEvent.click(screen.getByText('Upload APIs'))
    // UpdatePHRv1 should be hidden now
    expect(screen.queryByText('UpdatePHRv1')).not.toBeInTheDocument()
  })

  it('expands group when collapsed header clicked again', () => {
    render(<EndpointSidebar />)
    fireEvent.click(screen.getByText('Upload APIs'))
    expect(screen.queryByText('UpdatePHRv1')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Upload APIs'))
    expect(screen.getByText('UpdatePHRv1')).toBeInTheDocument()
  })

  it('shows endpoint count per group', () => {
    render(<EndpointSidebar />)
    // Should show count badges — at least "10" for upload
    expect(screen.getByText('10')).toBeInTheDocument()
  })
})
