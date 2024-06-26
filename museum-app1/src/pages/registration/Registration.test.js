import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Registration from './Registration'; // Corrected import
import { auth, firestore } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('../../firebase', () => ({
  auth: {},
  firestore: {},
}));

describe('Registration Component', () => {
  const setup = (role) => {
    render(
      <Router>
        <Registration role={role} />
      </Router>
    );
  };

  test('renders tourist registration form', () => {
    setup('tourist');
    expect(screen.getByText('Tourist Registration')).toBeInTheDocument();
  });

});
