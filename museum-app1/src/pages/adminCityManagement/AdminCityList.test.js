import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminCityList from './AdminCityList';
import { collection, getDocs, addDoc, query, where, getFirestore } from 'firebase/firestore';
import { act } from 'react-dom/test-utils';

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'test-uuid')
  };
});

jest.mock('@mui/material/styles', () => {
  const originalModule = jest.requireActual('@mui/material/styles');
  return {
    ...originalModule,
    createTheme: jest.fn(() => ({})),
    ThemeProvider: ({ children }) => children,
  };
});

jest.mock('@mui/material/Tooltip', () => ({ title, children }) => <div>{children}</div>);

jest.mock('../../components/appBars/AdminAppBar', () => () => <div>AdminAppBar</div>);
jest.mock('../../components/footer/Footer', () => () => <div>Footer</div>);
jest.mock('../../components/tables/CityIDTable', () => ({ cityIDs }) => (
  <div>
    {cityIDs.map((cityID) => (
      <div key={cityID.id}>{cityID.id}</div>
    ))}
  </div>
));
jest.mock('../../styles/AdminCityListStyles', () => ({
  background: {}
}));

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    getFirestore: jest.fn(),
    collection: jest.fn(),
    getDocs: jest.fn(),
    addDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
  };
});

describe('AdminCityList', () => {
  const mockCollection = jest.fn();
  const mockGetDocs = jest.fn();
  const mockAddDoc = jest.fn();
  const mockQuery = jest.fn();
  const mockWhere = jest.fn();
  const mockGetFirestore = jest.fn();

  beforeEach(() => {
    collection.mockImplementation(mockCollection);
    getDocs.mockImplementation(mockGetDocs);
    addDoc.mockImplementation(mockAddDoc);
    query.mockImplementation(mockQuery);
    where.mockImplementation(mockWhere);
    getFirestore.mockImplementation(mockGetFirestore);

    mockCollection.mockReturnValue('mockCollection');
    mockQuery.mockReturnValue('mockQuery');
    mockWhere.mockReturnValue('mockWhere');
    mockGetFirestore.mockReturnValue('mockFirestoreInstance');

    mockGetDocs.mockResolvedValue({ docs: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the AdminCityList component', async () => {
    await act(async () => {
      render(<AdminCityList />);
    });

    expect(screen.getByText('AdminAppBar')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByText('City Management')).toBeInTheDocument();
    expect(screen.getByText('Generate City ID')).toBeInTheDocument();
  });
});
