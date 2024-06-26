import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import CountryGrid from './CountryGrid';

describe('CountryGrid', () => {
  const mockCountries = ['Country One', 'Country Two'];
  const getCountryCode = jest.fn((country) => country.split(' ')[1].toUpperCase());

  it('renders countries correctly', () => {
    render(
      <Router>
        <CountryGrid countries={mockCountries} getCountryCode={getCountryCode} />
      </Router>
    );

    mockCountries.forEach((country) => {
      expect(screen.getByText(country)).toBeInTheDocument();
    });
  });

  it('calls getCountryCode for each country', () => {
    render(
      <Router>
        <CountryGrid countries={mockCountries} getCountryCode={getCountryCode} />
      </Router>
    );

    mockCountries.forEach((country) => {
      expect(getCountryCode).toHaveBeenCalledWith(country);
    });
  });

  it('links to the correct URL for each country', () => {
    render(
      <Router>
        <CountryGrid countries={mockCountries} getCountryCode={getCountryCode} />
      </Router>
    );

    mockCountries.forEach((country) => {
      const link = screen.getByText(country).closest('a');
      expect(link).toHaveAttribute('href', `/cities/${country}`);
    });
  });
});
