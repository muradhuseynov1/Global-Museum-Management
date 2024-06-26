import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TouristForm from './TouristForm';

describe('TouristForm', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((message) => {
      if (message.includes('The `renderInput` prop has been removed in version 6.0')) {
        return;
      }
      console.warn(message);
    });
  });

  afterAll(() => {
    console.warn.mockRestore();
  });

  test('renders the form with initial empty values', () => {
    render(<TouristForm currentTourist={null} onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/name/i, { selector: 'input[name="name"]' })).toHaveValue('');
    expect(screen.getByLabelText(/surname/i, { selector: 'input[name="surname"]' })).toHaveValue('');
    expect(screen.getByLabelText(/email/i, { selector: 'input[name="email"]' })).toHaveValue('');
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue('');
  });

  test('renders the form with initial values when editing a tourist', () => {
    const currentTourist = {
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      dateOfBirth: '01/01/2000',
    };

    render(<TouristForm currentTourist={currentTourist} onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/name/i, { selector: 'input[name="name"]' })).toHaveValue('John');
    expect(screen.getByLabelText(/surname/i, { selector: 'input[name="surname"]' })).toHaveValue('Doe');
    expect(screen.getByLabelText(/email/i, { selector: 'input[name="email"]' })).toHaveValue('john.doe@example.com');
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue('01/01/2000');
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<TouristForm currentTourist={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const cancelButton = screen.getByText(/cancel/i);

    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
