import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import TouristAppBar from './TouristAppBar';
import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';
import { useMediaQuery } from '@mui/material';

jest.mock('../../hooks/useLogout', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    __esModule: true,
    ...originalModule,
    useMediaQuery: jest.fn(),
  };
});

describe('TouristAppBar Component', () => {
  const searchQuery = '';
  const setSearchQuery = jest.fn();
  const toggleBookingDialog = jest.fn();
  const mockLogout = jest.fn();
  const mockCurrentUser = { name: 'Test User' };

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
    useAuth.mockReturnValue({ currentUser: mockCurrentUser });
  });

  const renderComponent = (props = {}) =>
    render(
      <Router>
        <TouristAppBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleBookingDialog={toggleBookingDialog}
          {...props}
        />
      </Router>
    );

  test('renders the logo', () => {
    renderComponent();
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  test('renders search icon on mobile view', () => {
    useMediaQuery.mockReturnValue(true); 
    renderComponent();
    const searchIcon = screen.getByTestId('SearchIcon');
    expect(searchIcon).toBeInTheDocument();
  });

  test('renders search bar on desktop view', () => {
    useMediaQuery.mockReturnValue(false); 
    renderComponent({ showSearchBar: true });
    const searchBar = screen.getByPlaceholderText('Search...');
    expect(searchBar).toBeInTheDocument();
  });

  test('calls setSearchQuery on search input change', () => {
    renderComponent({ showSearchBar: true });
    const searchBar = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchBar, { target: { value: 'test' } });
    expect(setSearchQuery).toHaveBeenCalledWith('test');
  });

  test('calls logout function on logout button click', async () => {
    renderComponent();
    const logoutButton = screen.getByRole('button', { name: /Log out/i });
    
    await act(async () => {
      fireEvent.click(logoutButton);
    });
    
    expect(mockLogout).toHaveBeenCalled();
  });

  test('renders Bookings and Settings buttons for logged-in users', () => {
    renderComponent();
    const bookingsButton = screen.getByRole('button', { name: /Bookings/i });
    const settingsButton = screen.getByLabelText('settings');
    expect(bookingsButton).toBeInTheDocument();
    expect(settingsButton).toBeInTheDocument();
  });
});
