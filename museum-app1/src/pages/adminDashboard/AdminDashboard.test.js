import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminDashboard from './AdminDashboard';
import useAuth from '../../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

jest.mock('../../hooks/useAuth');
jest.mock('firebase/firestore');
jest.mock('../../components/appBars/AdminAppBar', () => () => <div>AdminAppBar Mock</div>);
jest.mock('../../components/footer/Footer', () => () => <div>Footer Mock</div>);

describe('AdminDashboard', () => {
    const currentUser = { uid: 'testUid' };

    beforeEach(() => {
        useAuth.mockReturnValue({ currentUser });
    });

    it('should render the AdminDashboard with admin name when currentUser is present', async () => {
        getDoc.mockResolvedValue({
            exists: jest.fn(() => true),
            data: jest.fn(() => ({ name: 'Test Admin' })),
        });

        render(<AdminDashboard />);

        await waitFor(() => expect(screen.getByText('Welcome, Test Admin')).toBeInTheDocument());

        expect(screen.getByText('AdminAppBar Mock')).toBeInTheDocument();
        expect(screen.getByText('Footer Mock')).toBeInTheDocument();
        expect(screen.getByText('This is your dashboard where you can manage the administration of the portal.')).toBeInTheDocument();
    });

    it('should render the AdminDashboard with default name when document does not exist', async () => {
        getDoc.mockResolvedValue({
            exists: jest.fn(() => false),
        });

        render(<AdminDashboard />);

        await waitFor(() => expect(screen.getByText('Welcome, Admin')).toBeInTheDocument());

        expect(screen.getByText('AdminAppBar Mock')).toBeInTheDocument();
        expect(screen.getByText('Footer Mock')).toBeInTheDocument();
        expect(screen.getByText('This is your dashboard where you can manage the administration of the portal.')).toBeInTheDocument();
    });

    it('should render the AdminDashboard with default name when there is no currentUser', async () => {
        useAuth.mockReturnValue({ currentUser: null });

        render(<AdminDashboard />);

        expect(screen.getByText('Welcome, Admin')).toBeInTheDocument();
        expect(screen.getByText('AdminAppBar Mock')).toBeInTheDocument();
        expect(screen.getByText('Footer Mock')).toBeInTheDocument();
        expect(screen.getByText('This is your dashboard where you can manage the administration of the portal.')).toBeInTheDocument();
    });
});
