import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MuseumContactInfo from './MuseumContactInfo';
import L from 'leaflet';

const mockMuseum = {
  address: '123 Museum St.',
  phoneNumber: '123-456-7890',
  website: 'https://museum.com',
  daysAndHours: 'Mon-Fri 9am-5pm',
  name: 'Museum of Art'
};

const mockGeocodedCoords = { lat: 40.712776, lng: -74.005974 };
const mockCustomIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
  shadowSize: [50, 64],
  shadowAnchor: [4, 62]
});

test('renders contact information correctly', () => {
  render(<MuseumContactInfo museum={mockMuseum} isGeocodingComplete={false} geocodedCoords={null} customIcon={null} />);
  
  expect(screen.getByText('Contact')).toBeInTheDocument();
  expect(screen.getByText('123 Museum St.')).toBeInTheDocument();
  expect(screen.getByText('123-456-7890')).toBeInTheDocument();
  expect(screen.getByText('https://museum.com')).toBeInTheDocument();
  expect(screen.getByText('Mon-Fri 9am-5pm')).toBeInTheDocument();
});

test('renders map when geocoding is complete', async () => {
  render(<MuseumContactInfo museum={mockMuseum} isGeocodingComplete={true} geocodedCoords={mockGeocodedCoords} customIcon={mockCustomIcon} />);
  
  expect(screen.getByTestId('map-container')).toBeInTheDocument();
});

test('renders children correctly', () => {
  render(
    <MuseumContactInfo museum={mockMuseum} isGeocodingComplete={false} geocodedCoords={null} customIcon={null}>
      <div>Additional Info</div>
    </MuseumContactInfo>
  );
  
  expect(screen.getByText('Additional Info')).toBeInTheDocument();
});
