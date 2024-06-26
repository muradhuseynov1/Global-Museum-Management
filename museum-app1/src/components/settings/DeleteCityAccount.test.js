import { deleteDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import DeleteCityAccount from './DeleteCityAccount';

// Firebase Firestore functions
jest.mock('firebase/firestore', () => ({
    deleteDoc: jest.fn(),
    doc: jest.fn((_, docId) => ({
        id: docId,
        exists: jest.fn(),
        data: jest.fn()
    })),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
}));

// Firebase Functions
jest.mock('firebase/functions', () => ({
    httpsCallable: jest.fn(),
}));

jest.mock('../../firebase', () => ({
    firestore: {},
    functions: {},
}));

describe('DeleteCityAccount', () => {
    let originalConsoleError;

    beforeEach(() => {
        originalConsoleError = console.error;
        console.error = jest.fn();

        jest.clearAllMocks();
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    it('should delete city account and associated data', async () => {
        const userId = 'test-user-id';
        const cityId = 'test-city-id';

        getDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({ cityID: cityId })
        });

        getDocs.mockResolvedValue({
            docs: [{ id: 'doc1', ref: { id: 'doc1' } }, { id: 'doc2', ref: { id: 'doc2' } }]
        });

        const mockDeleteUserAccount = jest.fn().mockResolvedValue({ data: { success: true } });
        httpsCallable.mockReturnValue(mockDeleteUserAccount);

        const result = await DeleteCityAccount(userId);

        expect(result).toBe(true);
        expect(getDoc).toHaveBeenCalledTimes(1);
        expect(deleteDoc).toHaveBeenCalledTimes(9); 
        expect(mockDeleteUserAccount).toHaveBeenCalledTimes(1);
    });

    it('should handle errors during deletion', async () => {
        const userId = 'test-user-id';
        
        getDoc.mockResolvedValue({
            exists: () => false
        });

        const result = await DeleteCityAccount(userId);

        expect(result).toBe(false);
        expect(getDoc).toHaveBeenCalledTimes(1);
    });
});
