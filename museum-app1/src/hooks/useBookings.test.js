import { renderHook, act, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import useBookings from './useBookings'; 

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

const mockUser = { uid: 'testUserId' };
const mockBookings = [
  { id: '1', date: '2023-05-01', otherData: 'data1' },
  { id: '2', date: '2023-05-02', otherData: 'data2' },
];

describe('useBookings Hook', () => {
  const mockNavigate = jest.fn();
  const originalError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });
    getDocs.mockResolvedValue({
      docs: mockBookings.map(booking => ({
        id: booking.id,
        data: () => booking,
      })),
    });
    
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterEach(() => {
    console.error = originalError; 
  });

  test('fetches and sorts bookings correctly', async () => {
    const { result } = renderHook(() => useBookings({ auth: {} }, { firestore: {} }));

    await waitFor(() => {
      expect(getDocs).toHaveBeenCalled();
      expect(result.current.bookings).toEqual(mockBookings.sort((a, b) => new Date(b.date) - new Date(a.date)));
    });
  });

  test('toggles booking dialog correctly', () => {
    const { result } = renderHook(() => useBookings({ auth: {} }, { firestore: {} }));

    act(() => {
      result.current.toggleBookingDialog();
    });
    expect(result.current.isBookingDialogOpen).toBe(true);

    act(() => {
      result.current.toggleBookingDialog();
    });
    expect(result.current.isBookingDialogOpen).toBe(false);
  });

  test('sorts bookings by date correctly', async () => {
    const { result } = renderHook(() => useBookings({ auth: {} }, { firestore: {} }));

    await waitFor(() => {
      expect(getDocs).toHaveBeenCalled();
    });

    act(() => {
      result.current.requestSort('date');
    });

    expect(result.current.sortConfig).toEqual({ key: 'date', direction: 'ascending' });

    act(() => {
      result.current.requestSort('date');
    });

    expect(result.current.sortConfig).toEqual({ key: 'date', direction: 'descending' });
  });

  test('handles booking click correctly', async () => {
    const { result } = renderHook(() => useBookings({ auth: {} }, { firestore: {} }));

    await waitFor(() => {
      expect(getDocs).toHaveBeenCalled();
    });

    act(() => {
      result.current.handleBookingClick('1');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/ticket/1');
  });
});
