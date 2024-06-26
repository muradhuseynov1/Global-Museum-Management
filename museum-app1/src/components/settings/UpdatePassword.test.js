import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import UpdatePassword from './UpdatePassword';
import { auth, EmailAuthProvider } from '../../firebase';
import { updatePassword, reauthenticateWithCredential } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      email: 'test@example.com',
    },
  })),
  updatePassword: jest.fn(),
  reauthenticateWithCredential: jest.fn(),
  EmailAuthProvider: {
    credential: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('UpdatePassword Component', () => {
  beforeEach(() => {
    render(
      <Router>
        <UpdatePassword />
      </Router>
    );
  });

  it('renders the form correctly', () => {
    expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Password/i })).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    const currentPasswordInput = screen.getByLabelText(/Current Password/i);
    const newPasswordInput = screen.getByLabelText(/New Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

    fireEvent.change(currentPasswordInput, { target: { value: 'currentPassword' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'confirmPassword' } });

    expect(currentPasswordInput.value).toBe('currentPassword');
    expect(newPasswordInput.value).toBe('newPassword');
    expect(confirmPasswordInput.value).toBe('confirmPassword');
  });

  it('shows alert if passwords do not match', () => {
    window.alert = jest.fn();

    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newPassword' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'differentPassword' } });

    fireEvent.submit(screen.getByRole('button', { name: /Update Password/i }));

    expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
  });

  it('updates password successfully', async () => {
    window.alert = jest.fn();

    fireEvent.change(screen.getByLabelText(/Current Password/i), { target: { value: 'currentPassword' } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newPassword' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'newPassword' } });

    reauthenticateWithCredential.mockResolvedValue();
    updatePassword.mockResolvedValue();

    fireEvent.submit(screen.getByRole('button', { name: /Update Password/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Password updated successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    });
  });

  it('handles firebase errors correctly', async () => {
    window.alert = jest.fn();

    fireEvent.change(screen.getByLabelText(/Current Password/i), { target: { value: 'currentPassword' } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newPassword' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'newPassword' } });

    const error = { code: 'auth/wrong-password', message: 'The current password is incorrect.' };
    reauthenticateWithCredential.mockRejectedValue(error);

    fireEvent.submit(screen.getByRole('button', { name: /Update Password/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('The current password is incorrect.');
    });
  });
});
