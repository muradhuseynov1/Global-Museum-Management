import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import SettingsDrawer from './SettingsDrawer';

// useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockOptions = {
  Option1: 'option1',
  Option2: 'option2',
  Option3: 'option3',
};

const mockOnOptionSelected = jest.fn();

describe('SettingsDrawer Component', () => {
  it('renders without crashing', () => {
    render(
      <Router>
        <SettingsDrawer
          options={mockOptions}
          onOptionSelected={mockOnOptionSelected}
          selectedOption="option1"
          userType="city"
        />
      </Router>
    );

    fireEvent.click(screen.getByRole('button'));

    Object.keys(mockOptions).forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('calls onOptionSelected when an option is clicked', () => {
    render(
      <Router>
        <SettingsDrawer
          options={mockOptions}
          onOptionSelected={mockOnOptionSelected}
          selectedOption="option1"
          userType="city"
        />
      </Router>
    );

    fireEvent.click(screen.getByRole('button'));

    fireEvent.click(screen.getByText('Option2'));
    expect(mockOnOptionSelected).toHaveBeenCalledWith('option2');
  });

  it('navigates to the correct dashboard based on userType', () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

    render(
      <Router>
        <SettingsDrawer
          options={mockOptions}
          onOptionSelected={mockOnOptionSelected}
          selectedOption="option1"
          userType="city"
        />
      </Router>
    );

    fireEvent.click(screen.getByRole('button'));

    fireEvent.click(screen.getByRole('button', { name: /Back to Dashboard/i }));
    expect(navigate).toHaveBeenCalledWith('/city-dashboard');
  });
});
