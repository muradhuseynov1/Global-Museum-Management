import { renderHook, act, waitFor } from '@testing-library/react';
import useAuth from './useAuth';
import { auth } from '../firebase';

jest.mock('../firebase', () => require('../__mocks__/firebase'));

describe('useAuth hook', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set loading to true initially and then to false', async () => {
        const fakeUser = { uid: '12345', email: 'user@example.com' };
        auth.onAuthStateChanged.mockImplementationOnce(callback => {
            setTimeout(() => callback(fakeUser), 10);
            return jest.fn();
        });
    
        const { result } = renderHook(() => useAuth());
        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.currentUser).toEqual(fakeUser);
    });     

    it('should allow a user to sign up', async () => {
        const email = 'newuser@example.com';
        const password = 'password123';
        const fakeUser = { uid: 'abc123', email };

        auth.createUserWithEmailAndPassword.mockResolvedValueOnce({
            user: fakeUser
        });

        const { result } = renderHook(() => useAuth());
        let signedUpUser;

        await act(async () => {
            signedUpUser = await result.current.signup(email, password);
        });

        expect(signedUpUser.user).toEqual(fakeUser);
        expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    });

    it('should handle logins', async () => {
        const email = 'user@example.com';
        const password = 'password123';
        const fakeUser = { uid: '12345', email };

        auth.signInWithEmailAndPassword.mockResolvedValueOnce({
            user: fakeUser
        });

        const { result } = renderHook(() => useAuth());
        let loggedInUser;

        await act(async () => {
            loggedInUser = await result.current.login(email, password);
        });

        expect(loggedInUser.user).toEqual(fakeUser);
        expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    });

    it('should handle logout', async () => {
        auth.signOut.mockResolvedValueOnce();

        const { result } = renderHook(() => useAuth());

        await act(async () => {
            await result.current.logout();
        });

        expect(auth.signOut).toHaveBeenCalled();
    });
});
