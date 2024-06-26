import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Settings from './Settings';
import { useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../../components/settings/UpdateProfile', () => () => <div>UpdateProfile Component</div>);
jest.mock('../../components/settings/UpdatePassword', () => () => <div>UpdatePassword Component</div>);
jest.mock('../../components/settings/SettingsDrawer', () => ({ options, onOptionSelected, selectedOption }) => (
  <div>
    {Object.keys(options).map(option => (
      <button
        key={option}
        onClick={() => onOptionSelected(options[option])}
        data-testid={options[option]}
      >
        {option}
      </button>
    ))}
  </div>
));

describe('Settings', () => {
  test('renders the Settings component for city user type', () => {
    useParams.mockReturnValue({ userType: 'city' });

    render(<Settings />);

    expect(screen.getByText('UpdateProfile Component')).toBeInTheDocument();
    expect(screen.getByTestId('updateprofileinfo')).toBeInTheDocument();
    expect(screen.getByTestId('updatepassword')).toBeInTheDocument();
  });

  test('renders the Settings component for tourist user type', () => {
    useParams.mockReturnValue({ userType: 'tourist' });

    render(<Settings />);

    expect(screen.getByText('UpdateProfile Component')).toBeInTheDocument();
    expect(screen.getByTestId('updateprofileinfo')).toBeInTheDocument();
    expect(screen.getByTestId('updatepassword')).toBeInTheDocument();
  });

  test('handles setting selection', () => {
    useParams.mockReturnValue({ userType: 'city' });

    render(<Settings />);

    fireEvent.click(screen.getByTestId('updatepassword'));

    expect(screen.getByText('UpdatePassword Component')).toBeInTheDocument();
  });
});
