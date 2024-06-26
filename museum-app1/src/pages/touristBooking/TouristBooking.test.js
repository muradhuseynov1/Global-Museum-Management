import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router, useParams, useNavigate } from 'react-router-dom';
import TouristBooking from './TouristBooking';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../../firebase', () => ({
  firestore: {},
  auth: {},
}));

jest.mock('react-datepicker', () => (props) => <div>DatePicker {props.selected}</div>);
jest.mock('../../components/appBars/TouristAppBar', () => () => <div>TouristAppBar</div>);
jest.mock('../../components/dialogs/BookingDialog', () => () => <div>BookingDialog</div>);
jest.mock('../../components/footer/Footer', () => () => <div>Footer</div>);
jest.mock('../../styles/TouristBookingStyles', () => ({
  theme: {},
  StyledBox: (props) => <div {...props} />,
  StyledContainer: (props) => <div {...props} />,
  StyledPaper: (props) => <div {...props} />,
  StyledStepper: (props) => <div {...props} />,
  StyledFormBox: (props) => <div {...props} />,
  StyledButtonBox: (props) => <div {...props} />,
}));

describe('TouristBooking', () => {
  const mockUseParams = useParams;
  const mockUseNavigate = useNavigate;
  const mockUseAuthState = useAuthState;
  const mockDoc = doc;
  const mockGetDoc = getDoc;
  let originalConsoleError;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: 'test-museum-id' });
    mockUseNavigate.mockReturnValue(jest.fn());
    mockUseAuthState.mockReturnValue([{ uid: 'test-user-id' }, false, null]);
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test('renders the TouristBooking component', async () => {
    const mockMuseumData = {
      name: 'Test Museum',
      openDays: [{ seconds: 1627849200 }],
      timeSlots: { '2021-08-01': [{ time: '10:00 AM', limit: 10, booked: 0 }] },
      ticketInfo: { adult: 10, student: 5, senior: 7, minor: 3 },
      currency: 'USD',
    };

    mockDoc.mockReturnValue('mockDocRef');
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockMuseumData,
    });

    render(
      <Router>
        <TouristBooking />
      </Router>
    );

    expect(screen.getByText('Choose Tickets')).toBeInTheDocument();
  });
});
