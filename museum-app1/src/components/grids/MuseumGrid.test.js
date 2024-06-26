import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MuseumGrid from './MuseumGrid';

const mockMuseums = [
  { id: 1, name: 'Museum of Art', museumCoverImage: 'image1.jpg' },
  { id: 2, name: 'History Museum', museumCoverImage: 'image2.jpg' },
];

const mockPromptDeleteConfirmation = jest.fn();

const renderComponent = (searchQuery = '') => {
  render(
    <BrowserRouter>
      <MuseumGrid museums={mockMuseums} searchQuery={searchQuery} promptDeleteConfirmation={mockPromptDeleteConfirmation} />
    </BrowserRouter>
  );
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

test('renders museums based on search query', () => {
  renderComponent('Art');
  expect(screen.getByText('Museum of Art')).toBeInTheDocument();
  expect(screen.queryByText('History Museum')).toBeNull();
});

test('shows no museums found message if no museums match search query', () => {
  renderComponent('NonExistent');
  expect(screen.getByText('No such museum found.')).toBeInTheDocument();
});

test('calls promptDeleteConfirmation when delete button is clicked', () => {
  renderComponent();
  fireEvent.click(screen.getAllByLabelText('delete')[0]);
  expect(mockPromptDeleteConfirmation).toHaveBeenCalledWith(1);
});
