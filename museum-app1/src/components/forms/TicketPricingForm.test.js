import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TicketPricingForm from './TicketPricingForm';

describe('TicketPricingForm', () => {
  const mockHandleMuseumChange = jest.fn();
  const props = {
    museumTicketInfo: { adult: 20, child: 10 },
    handleMuseumChange: mockHandleMuseumChange,
    museumCurrency: 'USD',
    museumCurrencyList: [{ code: 'USD', name: 'US Dollar' }, { code: 'EUR', name: 'Euro' }],
    errors: {}
  };

  it('renders correctly', () => {
    const { getByLabelText } = render(<TicketPricingForm {...props} />);
    expect(getByLabelText('Adult Ticket Price')).toHaveValue(20);

    const dropdown = getByLabelText('Currency');
    fireEvent.mouseDown(dropdown);  
    const option = screen.getByRole('option', { name: 'US Dollar' });
    
    expect(option.textContent).toBe('US Dollar');
  });

  it('calls handleMuseumChange when input changes', () => {
    const { getByLabelText } = render(<TicketPricingForm {...props} />);
    const input = getByLabelText('Adult Ticket Price');
    fireEvent.change(input, { target: { value: 30 } });
    expect(mockHandleMuseumChange).toHaveBeenCalled();
  });
});
