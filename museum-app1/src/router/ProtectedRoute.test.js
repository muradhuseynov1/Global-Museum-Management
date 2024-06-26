import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; 
import useAuth from '../hooks/useAuth';
import Loading from '../components/loading/Loading';

jest.mock('../hooks/useAuth');
const mockUseAuth = useAuth;

jest.mock('../components/loading/Loading', () => () => <div>Loading...</div>);

describe('ProtectedRoute', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders Loading component when loading is true', () => {
        mockUseAuth.mockReturnValue({ currentUser: null, loading: true });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('redirects to home when there is no currentUser', async () => {
        mockUseAuth.mockReturnValue({ currentUser: null, loading: false });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Home Page')).toBeInTheDocument());
    });

    test('renders children when there is a currentUser', () => {
        mockUseAuth.mockReturnValue({ currentUser: { uid: '123' }, loading: false });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
});
