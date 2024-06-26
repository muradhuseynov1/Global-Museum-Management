import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BusyDaysDiagram from './BusyDaysDiagram';
import { firestore } from '../../firebase';
import { getDocs } from 'firebase/firestore';

jest.mock('../../firebase', () => ({
  firestore: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

const mockData = [
  {
    id: '1',
    data: () => ({
      date: { seconds: 1620000000 },
      tickets: { adult: '2', senior: '1', student: '1', minor: '1' },
    }),
  },
  {
    id: '2',
    data: () => ({
      date: { seconds: 1620000000 },
      tickets: { adult: '1', senior: '0', student: '0', minor: '0' },
    }),
  },
];

describe('BusyDaysDiagram Component', () => {
  beforeEach(() => {
    getDocs.mockResolvedValue(mockData);
  });

  test('changes view when buttons are clicked', async () => {
    await act(async () => {
        render(
          <BrowserRouter>
            <BusyDaysDiagram />
          </BrowserRouter>
        );
      });

    const overallViewButton = screen.getByTestId('overall-view-button');
    const slotsViewButton = screen.getByTestId('slots-view-button');

    fireEvent.click(slotsViewButton);
    expect(slotsViewButton).toHaveClass('MuiButton-contained');
    expect(overallViewButton).toHaveClass('MuiButton-outlined');

    fireEvent.click(overallViewButton);
    expect(overallViewButton).toHaveClass('MuiButton-contained');
    expect(slotsViewButton).toHaveClass('MuiButton-outlined');
  });
});
