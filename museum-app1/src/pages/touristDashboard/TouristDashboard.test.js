import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TouristDashboard from './TouristDashboard';
import { auth, firestore } from '../../firebase';
import useBookings from '../../hooks/useBookings';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('../../firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid',
    },
  },
  firestore: {},
}));

jest.mock('../../hooks/useBookings', () => jest.fn());

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../../components/dialogs/BookingDialog', () => () => <div data-testid="booking-dialog">BookingDialog</div>);
jest.mock('../../components/appBars/TouristAppBar', () => () => <div data-testid="tourist-app-bar">TouristAppBar</div>);
jest.mock('../../components/grids/CountryGrid', () => () => <div data-testid="country-grid">CountryGrid</div>);
jest.mock('../../components/footer/Footer', () => () => <div data-testid="footer">Footer</div>);

test('renders TouristDashboard component without crashing', async () => {
  useBookings.mockReturnValue({
    bookings: [],
    isBookingDialogOpen: false,
    toggleBookingDialog: jest.fn(),
    handleBookingClick: jest.fn(),
    requestSort: jest.fn(),
    sortConfig: {},
  });

  getDocs.mockResolvedValue({
    docs: [
      { data: () => ({ countryName: 'Country1' }) },
      { data: () => ({ countryName: 'Country2' }) },
    ],
  });
  getDoc.mockResolvedValue({
    exists: jest.fn(() => true),
    data: jest.fn(() => ({ name: 'Test User' })),
  });

  onAuthStateChanged.mockImplementation((auth, callback) => {
    callback({ uid: 'test-uid' });
    return jest.fn();
  });

  render(<TouristDashboard />);

  await waitFor(() => {
    expect(screen.getByTestId('tourist-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome to Tourist Dashboard, Test User');
    expect(screen.getByTestId('country-grid')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});
