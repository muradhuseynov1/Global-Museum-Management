import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TouristTable from './TouristTable';
import { collection, getDocs } from 'firebase/firestore';

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  
  return {
    ...originalModule,
    collection: jest.fn(),
    getDocs: jest.fn(),
  };
});

jest.mock('../../components/dialogs/DeleteAccountDialog', () => ({ open, onClose, onConfirm }) => (
  <div>
    {open && (
      <div>
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    )}
  </div>
));

jest.mock('../../components/settings/DeleteTouristAccount', () => jest.fn().mockResolvedValue(true));

describe('TouristTable Component', () => {
  const mockTouristData = [
    { id: 'tourist1', name: 'John', surname: 'Doe', email: 'john@example.com', dateOfBirth: '1990-01-01' },
    { id: 'tourist2', name: 'Jane', surname: 'Smith', email: 'jane@example.com', dateOfBirth: '1995-05-15' },
  ];

  beforeEach(() => {
    getDocs.mockResolvedValue({
      docs: mockTouristData.map(data => ({
        id: data.id,
        data: () => data,
      })),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', async () => {
    render(<TouristTable onEdit={jest.fn()} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  test('fetches and displays data correctly', async () => {
    render(<TouristTable onEdit={jest.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });
});
