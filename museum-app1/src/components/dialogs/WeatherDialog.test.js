import { render, screen, fireEvent } from '@testing-library/react';
import WeatherDialog from './WeatherDialog';
import ResizeObserver from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserver;

const mockWeatherData = {
  city: { name: 'New York' },
  list: [
    { dt: 1651369200, main: { temp: 16, feels_like: 15 }, weather: [{ icon: '10d', description: 'rainy' }] },
  ]
};

describe('WeatherDialog', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation((msg) => {
      if (msg.includes('The width(0) and height(0) of chart should be greater than 0')) {
        return;
      }
      console.warn(msg);
    });
  });
  
  test('should render weather information correctly', () => {
    render(<WeatherDialog isOpen={true} onClose={() => {}} weatherData={mockWeatherData} />);
    expect(screen.getByText(/New York/)).toBeInTheDocument();
    expect(screen.getByText('16 °C')).toBeInTheDocument();
  });

  test('close button triggers onClose', () => {
    const handleClose = jest.fn();
    render(<WeatherDialog isOpen={true} onClose={handleClose} weatherData={mockWeatherData} />);
    fireEvent.click(screen.getByText('Close'));
    expect(handleClose).toHaveBeenCalled();
  });
});
