import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RouterComponent from './Router'; 
import useAuth from '../hooks/useAuth';
import App from '../App';
import RoleSelection from '../pages/selectRole/RoleSelection';
import CityDashboard from '../pages/cityDashboard/CityDashboard';

jest.mock('../hooks/useAuth');
const mockUseAuth = useAuth;

jest.mock('../App', () => () => <div>App Component Content</div>);
jest.mock('../pages/selectRole/RoleSelection', () => () => <div>Role Selection Content</div>);
jest.mock('../pages/cityDashboard/CityDashboard', () => () => <div>City Dashboard Content</div>);

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div>{children}</div>,
  };
});

describe('RouterComponent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (initialEntries) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <RouterComponent />
      </MemoryRouter>
    );
  };

  test('renders App component for / route', () => {
    mockUseAuth.mockReturnValue({ currentUser: null, loading: false });

    renderWithRouter(['/']);

    expect(screen.getByText('App Component Content')).toBeInTheDocument();
  });

  test('renders RoleSelection component for /signup route', () => {
    mockUseAuth.mockReturnValue({ currentUser: null, loading: false });

    renderWithRouter(['/signup']);

    expect(screen.getByText('Role Selection Content')).toBeInTheDocument();
  });

  test('redirects to home for protected routes when not authenticated', async () => {
    mockUseAuth.mockReturnValue({ currentUser: null, loading: false });

    renderWithRouter(['/city-dashboard']);

    await waitFor(() => expect(screen.getByText('App Component Content')).toBeInTheDocument());
  });

  test('renders CityDashboard component for /city-dashboard route when authenticated', () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: '123' }, loading: false });

    renderWithRouter(['/city-dashboard']);

    expect(screen.getByText('City Dashboard Content')).toBeInTheDocument();
  });
});
