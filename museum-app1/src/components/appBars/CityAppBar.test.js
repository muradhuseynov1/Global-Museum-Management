import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CityAppBar from './CityAppBar';
import useLogout from '../../hooks/useLogout';
import { useMediaQuery } from '@mui/material';

jest.mock('../../hooks/useLogout', () => ({
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

describe('CityAppBar Component', () => {
  const currentUser = true;
  const searchQuery = '';
  const setSearchQuery = jest.fn();
  const cityID = '12345';
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
  });

  const renderComponent = (props = {}) =>
    render(
      <Router>
        <CityAppBar currentUser={currentUser} searchQuery={searchQuery} setSearchQuery={setSearchQuery} cityID={cityID} {...props} />
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
    const searchIcon = screen.getByLabelText('toggle search');
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
    const logoutButton = screen.getByRole('button', { name: 'logout' });
    
    await act(async () => {
      fireEvent.click(logoutButton);
    });
    
    expect(mockLogout).toHaveBeenCalled();
  });

  test('renders Add Museum and Settings buttons for logged-in users', () => {
    renderComponent();
    const addMuseumButton = screen.getByLabelText('add museum');
    const settingsButton = screen.getByLabelText('settings');
    expect(addMuseumButton).toBeInTheDocument();
    expect(settingsButton).toBeInTheDocument();
  });
});
