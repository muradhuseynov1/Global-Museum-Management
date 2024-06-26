import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CityIDTable from './CityIDTable';
import {
  collection,
  query,
  onSnapshot,
  getDoc,
  getDocs,
  where,
  doc
} from 'firebase/firestore';

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');

  return {
    ...originalModule,
    collection: jest.fn(),
    query: jest.fn(),
    onSnapshot: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    where: jest.fn(),
    doc: jest.fn(),
  };
});

jest.mock('../dialogs/CityEditDialog', () => () => <div>City Edit Dialog</div>);
jest.mock('../../components/settings/DeleteCityAccount', () => () => Promise.resolve(true));
jest.mock('../../components/dialogs/DeleteAccountDialog', () => () => <div>Delete Account Dialog</div>);

describe('CityIDTable Component', () => {
  const mockCityData = [
    { id: 'city1', assigned: true, cityName: 'City One', countryName: 'Country One', registrarDocID: 'doc1' },
    { id: 'city2', assigned: false, cityName: '', countryName: '', registrarDocID: 'doc2' },
  ];

  beforeEach(() => {
    const mockSnapshot = {
      docs: mockCityData.map((city, index) => ({
        id: `id-${index}`,
        data: () => city,
      })),
    };
    onSnapshot.mockImplementation((q, callback) => {
      callback(mockSnapshot);
      return jest.fn(); 
    });

    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockCityData[0],
    });

    getDocs.mockResolvedValue({
      empty: false,
      docs: [{
        id: 'doc1',
        data: () => ({ countryName: 'Country One' }),
      }],
    });

    where.mockReturnValue({});
    doc.mockReturnValue({});
    collection.mockReturnValue({});
    query.mockReturnValue({});
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

  test('renders without crashing', () => {
    render(<CityIDTable />);
    expect(screen.getByText('City ID')).toBeInTheDocument();
  });

  test('initial state is correct', async () => {
    render(<CityIDTable />);
    expect(screen.getByText('City ID')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('City One')).toBeInTheDocument();
      expect(screen.getByText('Country One')).toBeInTheDocument();
      expect(screen.getAllByText('N/A')).toHaveLength(2);
    });
  });
});
