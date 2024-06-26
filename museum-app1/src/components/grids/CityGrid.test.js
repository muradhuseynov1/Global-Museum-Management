import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import { BrowserRouter as Router } from 'react-router-dom';
import CityGrid from './CityGrid';

describe('CityGrid', () => {
  const mockCities = [
    { cityID: 1, cityName: 'City One' },
    { cityID: 2, cityName: 'City Two' },
  ];
  const mockMuseums = {
    1: [{ id: 1, name: 'Museum One' }],
    2: [{ id: 2, name: 'Museum Two' }],
  };
  const handleCityClick = jest.fn();
  const fetchWeatherData = jest.fn();

  it('renders cities correctly', () => {
    render(
      <Router>
        <CityGrid
          cities={mockCities}
          handleCityClick={handleCityClick}
          fetchWeatherData={fetchWeatherData}
          cityMuseums={mockMuseums}
          loading={false}
        />
      </Router>
    );

    expect(screen.getByText('City One')).toBeInTheDocument();
    expect(screen.getByText('City Two')).toBeInTheDocument();
  });

  it('calls handleCityClick when an accordion is expanded', () => {
    render(
      <Router>
        <CityGrid
          cities={mockCities}
          handleCityClick={handleCityClick}
          fetchWeatherData={fetchWeatherData}
          cityMuseums={mockMuseums}
          loading={false}
        />
      </Router>
    );

    fireEvent.click(screen.getByText('City One'));
    expect(handleCityClick).toHaveBeenCalledWith(mockCities[0]);
  });

  it('calls fetchWeatherData when the Show Weather button is clicked', () => {
    render(
      <Router>
        <CityGrid
          cities={mockCities}
          handleCityClick={handleCityClick}
          fetchWeatherData={fetchWeatherData}
          cityMuseums={mockMuseums}
          loading={false}
        />
      </Router>
    );

    const cityOneShowWeatherButton = screen.getAllByText('Show Weather')[0];
    fireEvent.click(cityOneShowWeatherButton);
    expect(fetchWeatherData).toHaveBeenCalledWith('City One');
  });

  it('renders loading indicator when loading is true', () => {
    render(
      <Router>
        <CityGrid
          cities={mockCities}
          handleCityClick={handleCityClick}
          fetchWeatherData={fetchWeatherData}
          cityMuseums={mockMuseums}
          loading={true}
        />
      </Router>
    );

    fireEvent.click(screen.getByText('City One')); 
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders museums correctly when not loading', () => {
    render(
      <Router>
        <CityGrid
          cities={mockCities}
          handleCityClick={handleCityClick}
          fetchWeatherData={fetchWeatherData}
          cityMuseums={mockMuseums}
          loading={false}
        />
      </Router>
    );

    fireEvent.click(screen.getByText('City One'));
    expect(screen.getByText('Museum One')).toBeInTheDocument();

    fireEvent.click(screen.getByText('City Two'));
    expect(screen.getByText('Museum Two')).toBeInTheDocument();
  });
});
