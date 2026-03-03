import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RoomCard, type Room } from './RoomCard'

const mockRoom: Room = {
  id: '1',
  roomNumber: 'A-101',
  rent: 15000,
  managementFee: 1500,
  status: 'available',
}

describe('RoomCard', () => {
  it('renders room information correctly', () => {
    render(<RoomCard room={mockRoom} />)
    
    expect(screen.getByText('A-101')).toBeInTheDocument()
    expect(screen.getByText('空房')).toBeInTheDocument()
    expect(screen.getByText('$15,000')).toBeInTheDocument()
    expect(screen.getByText('$1,500')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const onClick = vi.fn()
    render(<RoomCard room={mockRoom} onClick={onClick} />)
    
    fireEvent.click(screen.getByText('A-101'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<RoomCard room={mockRoom} isLoading={true} />)
    
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('displays different status correctly', () => {
    const statuses: Room['status'][] = ['available', 'occupied', 'maintenance', 'reserved']
    const statusLabels = ['空房', '已出租', '維護中', '已預訂']

    statuses.forEach((status, index) => {
      const room = { ...mockRoom, status }
      render(<RoomCard room={room} />)
      expect(screen.getByText(statusLabels[index])).toBeInTheDocument()
    })
  })
})
