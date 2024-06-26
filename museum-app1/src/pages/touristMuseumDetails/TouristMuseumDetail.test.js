import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import TouristMuseumDetail from './TouristMuseumDetail';
import useAuth from '../../hooks/useAuth';
import useMuseumDetails from '../../hooks/useMuseumDetails';
import useBookings from '../../hooks/useBookings';
import { useParams } from 'react-router-dom';

jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useMuseumDetails');
jest.mock('../../hooks/useBookings');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('TouristMuseumDetail Component', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ id: 'test-museum-id' });
    useAuth.mockReturnValue({ currentUser: { uid: '123' } });
    useMuseumDetails.mockReturnValue({
      museum: {
        name: 'Test Museum',
        summary: 'Summary of the museum',
        history: 'History of the museum'
      },
      carouselImages: [],
      summaryImages: [],
      historyImages: [],
      isGeocodingComplete: true,
      geocodedCoords: [],
    });
    useBookings.mockReturnValue({
      bookings: [],
      isBookingDialogOpen: false,
      toggleBookingDialog: jest.fn(),
      handleBookingClick: jest.fn(),
      requestSort: jest.fn(),
      sortConfig: { key: 'museumName', direction: 'asc' },
    });
  });

  test('renders without crashing', () => {
    render(
      <Router>
        <TouristMuseumDetail />
      </Router>
    );
  });

  test('displays museum name', () => {
    render(
      <Router>
        <TouristMuseumDetail />
      </Router>
    );
    expect(screen.getByText('Test Museum')).toBeInTheDocument();
  });

  test('shows CircularProgress when no museum data', () => {
    useMuseumDetails.mockReturnValue({
      museum: null,
      carouselImages: [],
      summaryImages: [],
      historyImages: [],
      isGeocodingComplete: false,
      geocodedCoords: [],
    });

    render(
      <Router>
        <TouristMuseumDetail />
      </Router>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('opens AddReviewDialog when Add Review button is clicked', () => {
    render(
      <Router>
        <TouristMuseumDetail />
      </Router>
    );

    const addReviewButton = screen.getByText('Add Review');
    fireEvent.click(addReviewButton);
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('opens BusyDaysDiagram when Busy Days button is clicked', () => {
    render(
      <Router>
        <TouristMuseumDetail />
      </Router>
    );

    const busyDaysButton = screen.getByText('Busy Days');
    fireEvent.click(busyDaysButton);
    expect(screen.getByText('Busy Days of the Week')).toBeInTheDocument();
  });
});
