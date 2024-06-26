import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UpdateProfile from './UpdateProfile';
import { BrowserRouter } from 'react-router-dom';
import { auth, firestore } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const originalWarn = console.warn;
const originalError = console.error;
beforeAll(() => {
    console.warn = (...args) => {
        if (/The `renderInput` prop has been removed/.test(args[0])) {
            return;
        }
        originalWarn.call(console, ...args);
    };

    console.error = (...args) => {
        if (/A component is changing the uncontrolled value of a picker to be controlled/.test(args[0])) {
            return;
        }
        originalError.call(console, ...args);
    };

    window.alert = jest.fn();
});

afterAll(() => {
    console.warn = originalWarn;
    console.error = originalError;
});

jest.mock('../../firebase', () => ({
    auth: {
        currentUser: { uid: 'testUserId' },
    },
    firestore: {},
}));

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
}));

jest.mock('../dialogs/ReauthenticationDialog', () => ({
    __esModule: true,
    default: ({ open, onClose, onDelete, currentPassword, onPasswordChange }) => (
        open && (
            <div>
                <button onClick={onClose}>Close</button>
                <button onClick={onDelete}>Delete</button>
                <input value={currentPassword} onChange={onPasswordChange} />
            </div>
        )
    )
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('UpdateProfile Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('submits the form successfully', async () => {
        getDoc.mockResolvedValueOnce({
            exists: () => true,
            data: () => ({
                name: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                dateOfBirth: '2022-01-01'
            })
        });
        updateDoc.mockResolvedValueOnce();

        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <BrowserRouter>
                    <UpdateProfile userType="city" />
                </BrowserRouter>
            </LocalizationProvider>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /update profile/i }));
        });

        await waitFor(() => {
            expect(updateDoc).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/city-dashboard');
        });
    });
});
