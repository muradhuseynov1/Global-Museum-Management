import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import OperatingTimesForm from './OperatingTimesForm';

describe('OperatingTimesForm', () => {
  const mockHandleChange = jest.fn();
  const initialProps = {
    museumSlotLimit: 100,
    museumHandleChange: mockHandleChange,
    museumOpeningTime: '09:00',
    museumClosingTime: '18:00',
    errors: {}
  };

  it('renders correctly', () => {
    const { getByLabelText } = render(<OperatingTimesForm {...initialProps} />);
    expect(getByLabelText('Slot Limit').value).toBe('100');
    expect(getByLabelText('Opening Time').value).toBe('09:00');
    expect(getByLabelText('Closing Time').value).toBe('18:00');
  });

  it('calls handleChange on input change', () => {
    const { getByLabelText } = render(<OperatingTimesForm {...initialProps} />);
    const slotLimitInput = getByLabelText('Slot Limit');
    fireEvent.change(slotLimitInput, { target: { value: '150' } });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('displays errors when present', () => {
    const errorProps = {
      ...initialProps,
      errors: {
        slotLimit: 'Invalid slot limit',
        openingTime: 'Invalid opening time',
        closingTime: 'Invalid closing time'
      }
    };
    const { getByText } = render(<OperatingTimesForm {...errorProps} />);
    expect(getByText('Invalid slot limit')).toBeInTheDocument();
    expect(getByText('Invalid opening time')).toBeInTheDocument();
    expect(getByText('Invalid closing time')).toBeInTheDocument();
  });
});
