import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import DeleteAccountDialog from './DeleteAccountDialog';

describe('DeleteAccountDialog', () => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();

  it('renders correctly when open', () => {
    render(<DeleteAccountDialog open={true} onClose={onClose} onConfirm={onConfirm} />);

    expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete this account/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<DeleteAccountDialog open={false} onClose={onClose} onConfirm={onConfirm} />);

    expect(screen.queryByText(/confirm deletion/i)).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<DeleteAccountDialog open={true} onClose={onClose} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByText(/cancel/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<DeleteAccountDialog open={true} onClose={onClose} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
