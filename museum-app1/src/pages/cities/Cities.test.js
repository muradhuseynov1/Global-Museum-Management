import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Cities from './Cities';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { act } from 'react-dom/test-utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    collection: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
  };
});

jest.mock('../../components/appBars/TouristAppBar', () => () => <div>TouristAppBar</div>);
jest.mock('../../components/dialogs/BookingDialog', () => () => <div>BookingDialog</div>);
jest.mock('../../components/dialogs/WeatherDialog', () => () => <div>WeatherDialog</div>);
jest.mock('../../components/grids/CityGrid', () => ({ cities }) => (
  <div>
    {cities.map(city => (
      <div key={city.cityID}>{city.cityName}</div>
    ))}
  </div>
));
jest.mock('../../components/footer/Footer', () => () => <div>Footer</div>);
jest.mock('../../styles/CitiesStyles', () => ({
  root: {},
}));

describe('Cities', () => {
  const mockCollection = jest.fn();
  const mockGetDocs = jest.fn();
  const mockQuery = jest.fn();
  const mockWhere = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    collection.mockImplementation(mockCollection);
    getDocs.mockImplementation(mockGetDocs);
    query.mockImplementation(mockQuery);
    where.mockImplementation(mockWhere);
    useNavigate.mockReturnValue(mockNavigate);

    mockCollection.mockReturnValue('mockCollection');
    mockQuery.mockReturnValue('mockQuery');
    mockWhere.mockReturnValue('mockWhere');
    mockGetDocs.mockResolvedValue({ docs: [] }); 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Cities component', async () => {
    useParams.mockReturnValue({ countryName: 'TestCountry' });

    await act(async () => {
      render(<Cities />);
    });

    expect(screen.getByText('TouristAppBar')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByText('Cities in TestCountry')).toBeInTheDocument();
  });

  test('fetches and displays cities', async () => {
    useParams.mockReturnValue({ countryName: 'TestCountry' });

    const mockCitySnapshot = {
      docs: [
        { id: '1', data: () => ({ cityName: 'City1', cityID: '1' }) },
        { id: '2', data: () => ({ cityName: 'City2', cityID: '2' }) },
      ],
    };

    mockGetDocs.mockResolvedValueOnce(mockCitySnapshot);

    await act(async () => {
      render(<Cities />);
    });

    await waitFor(() => {
      expect(screen.getByText('City1')).toBeInTheDocument();
      expect(screen.getByText('City2')).toBeInTheDocument();
    });
  });
});
