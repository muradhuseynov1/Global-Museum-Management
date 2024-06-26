import { jest } from '@jest/globals';

// Auth Mocks
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();
const mockOnAuthStateChanged = jest.fn();
const mockDeleteUser = jest.fn();

const auth = {
    createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
    signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
    signOut: mockSignOut,
    onAuthStateChanged: mockOnAuthStateChanged,
    currentUser: {
        delete: mockDeleteUser
    }
};

// Firestore Mocks
const mockDeleteDoc = jest.fn();
const mockDoc = jest.fn();
const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockGetDocs = jest.fn();
const mockGetDoc = jest.fn();

const firestore = {
    deleteDoc: mockDeleteDoc,
    doc: mockDoc,
    collection: mockCollection,
    query: mockQuery,
    where: mockWhere,
    getDocs: mockGetDocs,
    getDoc: mockGetDoc,
    FieldPath: { documentId: jest.fn() }
};

// Storage Mocks
const mockRef = jest.fn();
const mockListAll = jest.fn();
const mockDeleteObject = jest.fn();

const storage = {
    ref: mockRef,
    listAll: mockListAll,
    deleteObject: mockDeleteObject
};

export { auth, firestore, storage };
