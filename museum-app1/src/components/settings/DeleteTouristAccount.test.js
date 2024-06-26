import { firestore, functions } from '../../firebase';
import { deleteDoc, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { deleteUser, getAuth } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import DeleteTouristAccount from './DeleteTouristAccount';

// Firebase Firestore functions
jest.mock('firebase/firestore', () => ({
    deleteDoc: jest.fn(),
    doc: jest.fn((_, docId) => ({
        id: docId,
        exists: jest.fn(),
        data: jest.fn(),
        ref: { id: 'mockedDocRef' }
    })),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    getFirestore: jest.fn()
}));

// Firebase Auth functions
jest.mock('firebase/auth', () => ({
    deleteUser: jest.fn(),
    getAuth: jest.fn(() => ({
        currentUser: {
            delete: jest.fn()
        }
    }))
}));

jest.mock('firebase/functions', () => ({
    httpsCallable: jest.fn(),
}));

jest.mock('../../firebase', () => ({
    firestore: {},
    functions: {},
}));

describe('DeleteTouristAccount', () => {
    let originalConsoleError;
    let originalConsoleLog;

    beforeEach(() => {
        originalConsoleError = console.error;
        originalConsoleLog = console.log;
        console.error = jest.fn();
        console.log = jest.fn();

        jest.clearAllMocks();
    });

    afterEach(() => {
        console.error = originalConsoleError;
        console.log = originalConsoleLog;
    });

    it('should delete tourist account and associated bookings', async () => {
        const userId = 'testUserId';
        const mockDocs = [
            { ref: 'bookingRef1' },
            { ref: 'bookingRef2' },
            { ref: 'bookingRef3' },
        ];

        getDoc.mockResolvedValue({ exists: () => true });
        getDocs.mockResolvedValue({ docs: mockDocs });
        deleteDoc.mockResolvedValue();
        const mockDeleteUserAccount = jest.fn().mockResolvedValue({ data: { success: true } });
        httpsCallable.mockReturnValue(mockDeleteUserAccount);

        const result = await DeleteTouristAccount(userId);

        expect(result).toBe(true);
        expect(getDocs).toHaveBeenCalledTimes(1); 
        expect(deleteDoc).toHaveBeenCalledTimes(4); 
        expect(mockDeleteUserAccount).toHaveBeenCalledTimes(1);
    });

    it('should handle errors if the tourist document does not exist', async () => {
        const userId = 'testUserId';

        getDoc.mockResolvedValue({ exists: () => false });

        const result = await DeleteTouristAccount(userId);

        expect(result).toBe(false);
        expect(getDocs).not.toHaveBeenCalled();
        expect(deleteDoc).not.toHaveBeenCalled();
        expect(httpsCallable).not.toHaveBeenCalled();
    });

    it('should handle errors during the deletion process', async () => {
        const userId = 'test-user-id';
        
        getDoc.mockRejectedValue(new Error('Something went wrong'));

        const result = await DeleteTouristAccount(userId);

        expect(result).toBe(false);
        expect(getDoc).toHaveBeenCalledTimes(1); 
        expect(deleteDoc).not.toHaveBeenCalled(); 
        expect(deleteUser).not.toHaveBeenCalled(); 
    });
});
