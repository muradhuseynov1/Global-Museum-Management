import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import MuseumDetails from './MuseumDetail';
import useAuth from '../../hooks/useAuth';
import useMuseumDetails from '../../hooks/useMuseumDetails';

jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useMuseumDetails');

describe('MuseumDetails Component', () => {
  beforeEach(() => {
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
      setCarouselImages: jest.fn(),
      setSummaryImages: jest.fn(),
      setHistoryImages: jest.fn()
    });
  });

  test('renders without crashing', () => {
    render(
      <Router>
        <MuseumDetails />
      </Router>
    );
  });

  test('displays museum name', () => {
    render(
      <Router>
        <MuseumDetails />
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
      setCarouselImages: jest.fn(),
      setSummaryImages: jest.fn(),
      setHistoryImages: jest.fn()
    });

    render(
      <Router>
        <MuseumDetails />
      </Router>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
