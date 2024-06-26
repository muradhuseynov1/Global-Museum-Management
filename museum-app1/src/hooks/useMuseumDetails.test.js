import { renderHook, waitFor } from '@testing-library/react';
import useMuseumDetails from './useMuseumDetails';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { geocodeAddressInReact } from '../components/utils/utils';

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  
  return {
    ...originalModule,
    doc: jest.fn(),
    getDoc: jest.fn(),
  };
});

jest.mock('../components/utils/utils', () => ({
  geocodeAddressInReact: jest.fn(),
}));

describe('useMuseumDetails', () => {
  const mockMuseumData = {
    name: 'Mock Museum',
    address: 'Mock Address',
    carouselImages: ['image1.jpg', 'image2.jpg'],
    summaryImages: ['summary1.jpg'],
    historyImages: ['history1.jpg'],
  };

  beforeEach(() => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockMuseumData,
    });

    geocodeAddressInReact.mockResolvedValue({
      lat: 40.712776,
      lng: -74.005974,
    });
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

  test('fetches and sets museum data correctly', async () => {
    const { result } = renderHook(() => useMuseumDetails('mockId'));

    await waitFor(() => expect(result.current.museum).toEqual(mockMuseumData));

    expect(result.current.carouselImages).toEqual(mockMuseumData.carouselImages);
    expect(result.current.summaryImages).toEqual(mockMuseumData.summaryImages);
    expect(result.current.historyImages).toEqual(mockMuseumData.historyImages);
  });

  test('geocodes address correctly', async () => {
    const { result } = renderHook(() => useMuseumDetails('mockId'));

    await waitFor(() => expect(result.current.isGeocodingComplete).toBe(true));

    expect(result.current.geocodedCoords).toEqual({
      lat: 40.712776,
      lng: -74.005974,
    });
  });

  test('handles non-existent museum', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false,
    });

    const { result } = renderHook(() => useMuseumDetails('mockId'));

    await waitFor(() => expect(result.current.museum).toBe(null));

    expect(result.current.carouselImages).toEqual([]);
    expect(result.current.summaryImages).toEqual([]);
    expect(result.current.historyImages).toEqual([]);
  });

  test('handles errors during fetch', async () => {
    getDoc.mockRejectedValueOnce(new Error('Fetch error'));

    const { result } = renderHook(() => useMuseumDetails('mockId'));

    await waitFor(() => expect(result.current.museum).toBe(null));

    expect(result.current.carouselImages).toEqual([]);
    expect(result.current.summaryImages).toEqual([]);
    expect(result.current.historyImages).toEqual([]);
  });
});
