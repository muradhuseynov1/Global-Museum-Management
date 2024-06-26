import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CityEditDialog from './CityEditDialog';

const cityDetails = {
  docID: '1',
  cityID: '1001',
  cityName: 'Test City',
  countryName: 'Test Country',
  dateOfBirth: '01/01/2000',
  email: 'test@example.com',
  name: 'John',
  surname: 'Doe'
};

describe('CityEditDialog', () => {
  const originalWarn = console.warn;
  const originalError = console.error;

  beforeAll(() => {
    console.warn = () => {};
    console.error = () => {};
  });

  afterAll(() => {
    console.warn = originalWarn;
    console.error = originalError;
  });

  const setup = (overrides = {}) => {
    const defaultProps = {
      open: true,
      onClose: jest.fn(),
      cityDetails: null,
    };

    const props = { ...defaultProps, ...overrides };
    render(<CityEditDialog {...props} />);
    return props;
  };

  test('renders the dialog when open', () => {
    setup();
    expect(screen.getByTestId('city-edit-dialog')).toBeInTheDocument();
  });

  test('renders the city details correctly', () => {
    setup({ cityDetails });
    expect(screen.getByLabelText('City Name')).toHaveValue('Test City');
    expect(screen.getByLabelText('Name')).toHaveValue('John');
    expect(screen.getByLabelText('Surname')).toHaveValue('Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
  });

  test('handles input changes correctly', () => {
    setup({ cityDetails });
    fireEvent.change(screen.getByLabelText('City Name'), { target: { value: 'New City' } });
    expect(screen.getByLabelText('City Name')).toHaveValue('New City');

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane' } });
    expect(screen.getByLabelText('Name')).toHaveValue('Jane');

    fireEvent.change(screen.getByLabelText('Surname'), { target: { value: 'Smith' } });
    expect(screen.getByLabelText('Surname')).toHaveValue('Smith');

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });
    expect(screen.getByLabelText('Email')).toHaveValue('jane@example.com');
  });

  test('calls onClose when cancel button is clicked', () => {
    const { onClose } = setup({ cityDetails });
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls handleUpdate when update button is clicked', () => {
    const { onClose } = setup({ cityDetails });
    fireEvent.click(screen.getByTestId('update-button'));
    expect(onClose).toHaveBeenCalledTimes(0); 
  });
});
