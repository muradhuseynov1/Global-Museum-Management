import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, createMemoryRouter, RouterProvider } from 'react-router-dom';
import Login from './Login';

jest.mock('../../firebase', () => ({
  auth: { signInWithEmailAndPassword: jest.fn() },
  firestore: { doc: jest.fn() }
}));
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({
    user: { uid: '123' }
  }))
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({
    id: '123',
    set: jest.fn(),
    get: jest.fn()
  })),
  getDoc: jest.fn(() => Promise.resolve({
    exists: () => true,
    data: () => ({ role: 'city' })
  }))
}));

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe('Login Component', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('updates email and password on user input', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByTestId('password-input').querySelector('input');

    await act(async () => {
       userEvent.type(emailInput, 'test@example.com');
       userEvent.type(passwordInput, 'password123');
    });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
