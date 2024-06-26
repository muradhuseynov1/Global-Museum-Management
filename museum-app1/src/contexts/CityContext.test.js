import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CityProvider, { CityContext } from './CityContext';
import { doc, getDoc } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock('../hooks/useAuth');

const mockUser = { uid: 'test-uid' };
const mockCityID = 'test-city-id';

const renderWithProvider = (ui) => {
  return render(
    <CityProvider>
      {ui}
    </CityProvider>
  );
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.useFakeTimers();
});

afterEach(() => {
  console.error.mockRestore();
  jest.useRealTimers();
});

test('fetches and provides cityID correctly for logged-in user', async () => {
  useAuth.mockReturnValue({ currentUser: mockUser });

  getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => ({ cityID: mockCityID }),
  });

  renderWithProvider(
    <CityContext.Consumer>
      {({ cityID, loading }) => (
        <>
          <div data-testid="loading">{loading ? 'Loading...' : 'Loaded'}</div>
          <div data-testid="cityID">{cityID}</div>
        </>
      )}
    </CityContext.Consumer>
  );

  expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');

  act(() => {
    jest.runAllTimers();
  });

  await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('Loaded'));
  expect(screen.getByTestId('cityID')).toHaveTextContent(mockCityID);
});

test('handles no logged-in user case correctly', async () => {
  useAuth.mockReturnValue({ currentUser: null });

  renderWithProvider(
    <CityContext.Consumer>
      {({ cityID, loading }) => (
        <>
          <div data-testid="loading">{loading ? 'Loading...' : 'Loaded'}</div>
          <div data-testid="cityID">{cityID}</div>
        </>
      )}
    </CityContext.Consumer>
  );

  expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');

  act(() => {
    jest.runAllTimers();
  });

  await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('Loaded'));
  expect(screen.getByTestId('cityID')).toBeEmptyDOMElement();
});

test('handles error fetching cityID correctly', async () => {
  useAuth.mockReturnValue({ currentUser: mockUser });

  getDoc.mockRejectedValueOnce(new Error('Error fetching cityID'));

  renderWithProvider(
    <CityContext.Consumer>
      {({ cityID, loading }) => (
        <>
          <div data-testid="loading">{loading ? 'Loading...' : 'Loaded'}</div>
          <div data-testid="cityID">{cityID}</div>
        </>
      )}
    </CityContext.Consumer>
  );

  expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');

  act(() => {
    jest.runAllTimers();
  });

  await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('Loaded'));
  expect(screen.getByTestId('cityID')).toBeEmptyDOMElement();
});
