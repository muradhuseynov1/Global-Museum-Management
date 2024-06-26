import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BookingDialog from './BookingDialog';

describe('BookingDialog', () => {
  const setup = (overrides = {}) => {
    const defaultProps = {
      bookings: [
        {
          id: '1',
          museumName: 'Museum A',
          date: { seconds: Math.floor(Date.now() / 1000) + 86400 }, 
          timeSlot: new Date().setHours(10, 0, 0, 0), 
        },
        {
          id: '2',
          museumName: 'Museum B',
          date: { seconds: Math.floor(Date.now() / 1000) - 86400 }, 
          timeSlot: new Date().setHours(12, 0, 0, 0), 
        },
      ],
      sortConfig: { key: 'museumName', direction: 'asc' },
      requestSort: jest.fn(),
      isBookingDialogOpen: true,
      toggleBookingDialog: jest.fn(),
      handleBookingClick: jest.fn(),
    };

    const props = { ...defaultProps, ...overrides };
    render(<BookingDialog {...props} />);
    return props;
  };

  test('renders the booking dialog when open', () => {
    setup();
    expect(screen.getByTestId('booking-dialog')).toBeInTheDocument();
  });

  test('renders booking rows correctly', () => {
    setup();
    expect(screen.getByTestId('booking-1')).toBeInTheDocument();
    expect(screen.getByTestId('booking-2')).toBeInTheDocument();
  });

  test('calls requestSort with correct key when sorting by museum name', () => {
    const { requestSort } = setup();
    fireEvent.click(screen.getByTestId('sort-museumName'));
    expect(requestSort).toHaveBeenCalledWith('museumName');
  });

  test('calls requestSort with correct key when sorting by date', () => {
    const { requestSort } = setup();
    fireEvent.click(screen.getByTestId('sort-date'));
    expect(requestSort).toHaveBeenCalledWith('date');
  });

  test('calls handleBookingClick with correct id when booking row is clicked', () => {
    const { handleBookingClick } = setup();
    fireEvent.click(screen.getByTestId('booking-1'));
    expect(handleBookingClick).toHaveBeenCalledWith('1');
  });
});
