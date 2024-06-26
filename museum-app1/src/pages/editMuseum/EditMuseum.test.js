import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditMuseum from './EditMuseum';
import { firestore, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');

  return {
    ...originalModule,
    doc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
  };
});

jest.mock('firebase/storage', () => {
  const originalModule = jest.requireActual('firebase/storage');

  return {
    ...originalModule,
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
  };
});

jest.mock('../../components/forms/MuseumDetailsForm', () => ({ museumValue, handleMuseumChange, errors }) => (
  <div>
    <input
      name="name"
      value={museumValue.name}
      onChange={handleMuseumChange}
      placeholder="Museum Name"
    />
    <input
      name="summary"
      value={museumValue.summary}
      onChange={handleMuseumChange}
      placeholder="Summary"
    />
  </div>
));

jest.mock('../../components/inputs/ImageUpload', () => ({ handleMuseumImageChange, coverImage, errors }) => (
  <input type="file" onChange={handleMuseumImageChange} />
));

jest.mock('../../components/forms/TicketPricingForm', () => ({ museumTicketInfo, handleMuseumChange, museumCurrency, museumCurrencyList, errors }) => (
  <div>
    <input
      name="ticketInfo.adult"
      value={museumTicketInfo.adult}
      onChange={handleMuseumChange}
      placeholder="Adult Ticket Price"
    />
  </div>
));

jest.mock('../../components/forms/OperatingScheduleForm', () => ({
  museumHandleSelectDate,
  museumOpenDays,
  museumRecurrence,
  museumSetRecurrence,
  museumWeekDays,
  museumSetWeekDays,
  museumRecurrenceStartDate,
  museumSetRecurrenceStartDate,
  museumRecurrenceEndDate,
  museumSetRecurrenceEndDate,
  errors
}) => (
  <div>
    <input
      type="date"
      onChange={(e) => museumHandleSelectDate(new Date(e.target.value))}
    />
  </div>
));

describe('EditMuseum Component', () => {
  const mockMuseumData = {
    name: 'Mock Museum',
    summary: 'Mock Summary',
    history: 'Mock History',
    address: 'Mock Address',
    daysAndHours: 'Mock Days and Hours',
    phoneNumber: '1234567890',
    website: 'http://mockmuseum.com',
    currency: 'USD',
    openingTime: '09:00',
    closingTime: '17:00',
    openDays: [],
    timeSlots: {},
    ticketInfo: {
      adult: '10',
      student: '5',
      senior: '7',
      minor: '3',
    },
  };

  beforeEach(() => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockMuseumData,
    });

    updateDoc.mockResolvedValue();
    uploadBytes.mockResolvedValue({
      ref: {
        fullPath: 'mock/path/to/image.jpg'
      }
    });
    getDownloadURL.mockResolvedValue('http://mockurl.com/image.jpg');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
    console.warn.mockRestore();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/edit-museum/mockId']}>
        <Routes>
          <Route path="/edit-museum/:id" element={<EditMuseum />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders without crashing', async () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Museum Name')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Summary')).toBeInTheDocument();
    });
  });

  test('fetches and displays data correctly', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Museum Name').value).toBe('Mock Museum');
      expect(screen.getByPlaceholderText('Summary').value).toBe('Mock Summary');
    });
  });

  test('handles form changes', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Museum Name').value).toBe('Mock Museum');
    });

    fireEvent.change(screen.getByPlaceholderText('Museum Name'), { target: { value: 'Updated Museum' } });
    expect(screen.getByPlaceholderText('Museum Name').value).toBe('Updated Museum');
  });
});
