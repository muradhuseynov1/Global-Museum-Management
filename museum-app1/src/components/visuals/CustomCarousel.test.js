import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomCarousel from './CustomCarousel';

const images = ['image1.jpg', 'image2.jpg'];
const emptyMessage = 'No images available';

test('renders carousel with images', () => {
  render(<CustomCarousel images={images} emptyMessage={emptyMessage} />);
  
  const renderedImages = screen.getAllByAltText('Carousel');
  expect(renderedImages).toHaveLength(images.length);
  renderedImages.forEach((img, index) => {
    expect(img).toHaveAttribute('src', images[index]);
  });

  expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
});

test('renders empty message when no images are provided', () => {
  render(<CustomCarousel images={[]} emptyMessage={emptyMessage} />);
  
  expect(screen.getByText(emptyMessage)).toBeInTheDocument();
});

test('handles delete button click', () => {
  const onDelete = jest.fn();
  render(<CustomCarousel images={images} onDelete={onDelete} emptyMessage={emptyMessage} />);
  
  const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
  expect(deleteButtons).toHaveLength(1);

  fireEvent.click(deleteButtons[0]);
  
  expect(onDelete).toHaveBeenCalledWith(images[0]);
});
