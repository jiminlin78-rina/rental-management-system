import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HelloWorld from './HelloWorld'

describe('HelloWorld', () => {
  it('renders hello world text', () => {
    render(<HelloWorld />)
    
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('starts with initial count of 0', () => {
    render(<HelloWorld />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('increments count on + button click', () => {
    render(<HelloWorld />)
    
    fireEvent.click(screen.getByText('+'))
    expect(screen.getByText('1')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('+'))
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('decrements count on - button click', () => {
    render(<HelloWorld />)
    
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('+'))
    expect(screen.getByText('2')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('-'))
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('resets count on reset button click', () => {
    render(<HelloWorld />)
    
    fireEvent.click(screen.getByText('+'))
    fireEvent.click(screen.getByText('+'))
    expect(screen.getByText('2')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Reset'))
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('prevents negative count', () => {
    render(<HelloWorld />)
    
    fireEvent.click(screen.getByText('-'))
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('calls onCountChange callback', () => {
    const onCountChange = vi.fn()
    render(<HelloWorld onCountChange={onCountChange} />)
    
    fireEvent.click(screen.getByText('+'))
    expect(onCountChange).toHaveBeenCalledWith(1)
    
    fireEvent.click(screen.getByText('+'))
    expect(onCountChange).toHaveBeenCalledWith(2)
  })
})
