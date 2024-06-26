import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ForgotPassword from './ForgotPassword';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { BrowserRouter as Router } from 'react-router-dom';
import { validateLoginEmail } from '../../components/utils/utils';

jest.mock('firebase/auth');
jest.mock('../../components/utils/utils');

describe('ForgotPassword', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should render the ForgotPassword component', () => {
        render(
            <Router>
                <ForgotPassword />
            </Router>
        );

        expect(screen.getByText('Reset Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Back to Login' })).toBeInTheDocument();
    });

    it('should show an error message when email is invalid', async () => {
        const invalidEmail = 'invalid-email';
        validateLoginEmail.mockReturnValue('Invalid email address');

        render(
            <Router>
                <ForgotPassword />
            </Router>
        );

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: invalidEmail } });
        fireEvent.click(screen.getByRole('button', { name: 'Send' }));

        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    it('should send a password reset email when email is valid', async () => {
        const validEmail = 'test@example.com';
        validateLoginEmail.mockReturnValue('');
        sendPasswordResetEmail.mockResolvedValue();

        render(
            <Router>
                <ForgotPassword />
            </Router>
        );

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: validEmail } });
        fireEvent.click(screen.getByRole('button', { name: 'Send' }));

        await waitFor(() => expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, validEmail));

        await waitFor(() => {
            expect(screen.getByText('If the email address you provided exists in our database, you will receive a password reset email shortly.')).toBeInTheDocument();
        });
    });
});
