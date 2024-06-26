import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CommonRegistrationForm from './CommonRegistrationForm';

describe('CommonRegistrationForm', () => {
  const originalWarn = console.warn;
  beforeAll(() => {
    console.warn = (...args) => {
      if (args[0].includes('The `renderInput` prop has been removed in version 6.0 of the Date and Time Pickers.')) {
        return;
      }
      originalWarn(...args);
    };
  });

  afterAll(() => {
    console.warn = originalWarn;
  });
  const setup = () => {
    const formData = {
      name: '',
      surname: '',
      dateOfBirth: null,
      email: '',
      password: '',
      confirmPassword: '',
    };
    const formErrors = {
      name: '',
      surname: '',
      dateOfBirth: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    const handleInputChange = jest.fn();
    const validateForm = jest.fn();
    const handleDateChange = jest.fn();
    
    render(
      <CommonRegistrationForm
        formData={formData}
        formErrors={formErrors}
        handleInputChange={handleInputChange}
        validateForm={validateForm}
        handleDateChange={handleDateChange}
      />
    );

    return { handleInputChange, validateForm, handleDateChange };
  };

  test('renders all input fields correctly', () => {
    setup();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('surname-input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM/DD/YYYY')).toBeInTheDocument(); 
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPassword-input')).toBeInTheDocument();
  });
  

  test('calls handleInputChange on input change', () => {
    const { handleInputChange } = setup();
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John' } });
    expect(handleInputChange).toHaveBeenCalled();
  });

  test('calls validateForm on input blur', () => {
    const { validateForm } = setup();
    fireEvent.blur(screen.getByTestId('name-input'));
    expect(validateForm).toHaveBeenCalled();
  });

  test('displays error messages correctly', () => {
    const formData = {
      name: '',
      surname: '',
      dateOfBirth: null,
      email: '',
      password: '',
      confirmPassword: '',
    };
    const formErrors = {
      name: 'Name is required',
      surname: 'Surname is required',
      dateOfBirth: 'Date of birth is required',
      email: 'Email is invalid',
      password: 'Password is too short',
      confirmPassword: 'Passwords do not match',
    };
    render(
      <CommonRegistrationForm
        formData={formData}
        formErrors={formErrors}
        handleInputChange={() => {}}
        validateForm={() => {}}
        handleDateChange={() => {}}
      />
    );

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Surname is required')).toBeInTheDocument();
    expect(screen.getByTestId('dateOfBirth-error')).toHaveTextContent('Date of birth is required');
    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    expect(screen.getByText('Password is too short')).toBeInTheDocument();
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});
