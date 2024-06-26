import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import * as Firebase from '../firebase';
import useLogout from './useLogout';

jest.mock('../firebase', () => ({
    auth: {
      currentUser: {
        uid: '123456',
        email: 'user@example.com'
      },
    }
}));
  
jest.mock('firebase/auth', () => {
    const actualAuth = jest.requireActual('firebase/auth');
  
    return {
      getAuth: jest.fn(() => ({
        currentUser: {
          uid: '123456',
          email: 'user@example.com'
        },
        signOut: jest.fn(),
      })),
      signOut: jest.fn(),
    };
});
  
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('useLogout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    signOut.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('calls signOut and navigates to the home page', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockImplementation(() => mockNavigate);

    const { result } = renderHook(() => useLogout());

    act(() => {
      result.current.logout();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(signOut).toHaveBeenCalledWith(Firebase.auth);
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
