import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminAppBar from './AdminAppBar';
import useLogout from '../../hooks/useLogout';

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

describe('AdminAppBar Component', () => {
  const searchQuery = '';
  const setSearchQuery = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    useLogout.mockReturnValue({ logout: mockLogout });
  });

  const renderComponent = (props = {}) =>
    render(
      <Router>
        <AdminAppBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} {...props} />
      </Router>
    );

  test('renders the logo', () => {
    renderComponent();
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  test('calls logout function on logout button click', async () => {
    renderComponent();
    const logoutButton = screen.getByRole('button', { name: 'logout' });
    
    await act(async () => {
      fireEvent.click(logoutButton);
    });
    
    expect(mockLogout).toHaveBeenCalled();
  });
});
