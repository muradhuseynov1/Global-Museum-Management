import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import ReauthenticationDialog from './ReauthenticationDialog';

describe('ReauthenticationDialog', () => {
  const onClose = jest.fn();
  const onDelete = jest.fn();
  const onPasswordChange = jest.fn();

  it('renders correctly when open', () => {
    render(<ReauthenticationDialog open={true} onClose={onClose} onDelete={onDelete} currentPassword="" onPasswordChange={onPasswordChange} />);

    expect(screen.getByText(/re-authenticate to delete account/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your current password to confirm account deletion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<ReauthenticationDialog open={false} onClose={onClose} onDelete={onDelete} currentPassword="" onPasswordChange={onPasswordChange} />);

    expect(screen.queryByText(/re-authenticate to delete account/i)).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<ReauthenticationDialog open={true} onClose={onClose} onDelete={onDelete} currentPassword="" onPasswordChange={onPasswordChange} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<ReauthenticationDialog open={true} onClose={onClose} onDelete={onDelete} currentPassword="" onPasswordChange={onPasswordChange} />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onPasswordChange when the password field is changed', () => {
    render(<ReauthenticationDialog open={true} onClose={onClose} onDelete={onDelete} currentPassword="" onPasswordChange={onPasswordChange} />);

    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'new-password' } });
    expect(onPasswordChange).toHaveBeenCalledTimes(1);
  });
});
