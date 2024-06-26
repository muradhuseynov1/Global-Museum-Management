import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CityDashboard from './CityDashboard';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import useAuth from '../../hooks/useAuth';
import { act } from 'react-dom/test-utils';

jest.mock('../../hooks/useAuth');

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    collection: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    deleteDoc: jest.fn(),
  };
});

jest.mock('firebase/auth', () => {
  const originalModule = jest.requireActual('firebase/auth');
  return {
    ...originalModule,
    onAuthStateChanged: jest.fn(),
  };
});

jest.mock('firebase/storage', () => {
  const originalModule = jest.requireActual('firebase/storage');
  return {
    ...originalModule,
    ref: jest.fn(),
    deleteObject: jest.fn(),
  };
});

jest.mock('../../components/appBars/CityAppBar', () => () => <div>CityAppBar</div>);
jest.mock('../../components/dialogs/DeleteConfirmationDialog', () => ({ open, onClose, onDelete }) => (
  open && (
    <div>
      DeleteConfirmationDialog
      <button onClick={onClose}>Close</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  )
));
jest.mock('../../components/loading/Loading', () => () => <div>Loading...</div>);
jest.mock('../../components/grids/MuseumGrid', () => ({ museums, promptDeleteConfirmation }) => (
  <div>
    {museums.map(museum => (
      <div key={museum.id}>
        {museum.name}
        <button data-testid={`delete-${museum.id}`} onClick={() => promptDeleteConfirmation(museum.id)}>Delete</button>
      </div>
    ))}
  </div>
));
jest.mock('../../components/footer/Footer', () => () => <div>Footer</div>);
jest.mock('../../styles/CityDashboardStyles', () => ({
  dashboardBackground: {},
  dashboardTitle: {},
}));

describe('CityDashboard', () => {
  const mockOnAuthStateChanged = onAuthStateChanged;
  const mockGetDocs = getDocs;
  const mockGetDoc = getDoc;
  const mockDeleteDoc = deleteDoc;
  const mockDeleteObject = deleteObject;
  const mockUseAuth = useAuth;

  beforeAll(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'test-uid' } });
  });

  afterAll(() => {
    window.alert.mockRestore();
  });

  test('renders the CityDashboard component', async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'test-uid' });
      return jest.fn();
    });

    await act(async () => {
      render(<CityDashboard />);
    });

    expect(screen.getByText('CityAppBar')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  test('fetches and displays museums', async () => {
    const mockCityID = 'test-city-id';
    const mockCitySnapshot = {
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({ cityID: mockCityID, name: 'Test Registrar' }),
    };
    const mockMuseumSnapshot = {
      docs: [
        { id: '1', data: () => ({ name: 'Museum1' }) },
        { id: '2', data: () => ({ name: 'Museum2' }) },
      ],
    };

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'test-uid' });
      return jest.fn();
    });

    mockGetDoc.mockResolvedValue(mockCitySnapshot);
    mockGetDocs.mockResolvedValue(mockMuseumSnapshot);

    await act(async () => {
      render(<CityDashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Museum1')).toBeInTheDocument();
      expect(screen.getByText('Museum2')).toBeInTheDocument();
    });
  });
});
