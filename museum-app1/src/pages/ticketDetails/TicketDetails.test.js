import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TicketDetails from './TicketDetails';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../../components/appBars/TouristAppBar', () => () => <div>TouristAppBar</div>);
jest.mock('../../components/footer/Footer', () => () => <div>Footer</div>);

jest.mock('../../firebase', () => ({
  firestore: jest.fn(),
}));

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn();
});

describe('TicketDetails', () => {
  const mockUseParams = useParams;
  const mockDoc = doc;
  const mockGetDoc = getDoc;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ bookingId: 'test-booking-id' });
  });

  test('fetches and displays booking details', async () => {
    const mockBookingData = {
      museumName: 'Test Museum',
      date: { seconds: 1627849200 }, 
      timeSlot: '2021-08-01T10:00:00Z',
    };

    mockDoc.mockReturnValue('mockDocRef');
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      id: 'test-booking-id',
      data: () => mockBookingData,
    });

    render(<TicketDetails />);

    await waitFor(() => {
      expect(screen.getByText('Test Museum')).toBeInTheDocument();
      expect(screen.getByText('8/1/2021')).toBeInTheDocument(); 
    });

    expect(screen.getByText(/Time:/)).toBeInTheDocument();
  });
});
