import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import RoleSelection from './RoleSelection';

jest.mock('../../assets/cityRole.png', () => 'cityRole.png');
jest.mock('../../assets/touristRole.png', () => 'touristRole.png');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RoleSelection', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('should render the RoleSelection component', () => {
    render(
      <MemoryRouter>
        <RoleSelection />
      </MemoryRouter>
    );

    expect(screen.getByText('Select Your Role')).toBeInTheDocument();
    expect(screen.getByText('City Registrar')).toBeInTheDocument();
    expect(screen.getByText('Tourist')).toBeInTheDocument();
    expect(screen.getByAltText('City Registrar')).toHaveAttribute('src', 'cityRole.png');
    expect(screen.getByAltText('Tourist')).toHaveAttribute('src', 'touristRole.png');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should have the correct links for role cards', () => {
    render(
      <MemoryRouter>
        <RoleSelection />
      </MemoryRouter>
    );

    const cityRegistrarLink = screen.getByRole('link', { name: /City Registrar/i });
    expect(cityRegistrarLink).toHaveAttribute('href', '/signup/city');

    const touristLink = screen.getByRole('link', { name: /Tourist/i });
    expect(touristLink).toHaveAttribute('href', '/signup/tourist');
  });

  it('should navigate to the home page when Cancel button is clicked', () => {
    render(
      <MemoryRouter>
        <RoleSelection />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
