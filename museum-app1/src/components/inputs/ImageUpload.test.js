import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ImageUpload from './ImageUpload';

const mockHandleMuseumImageChange = jest.fn();
const mockCoverImage = 'mock-image-url';
const mockErrors = { coverImage: 'Error uploading image' };

const renderComponent = (props) => {
  return render(<ImageUpload {...props} />);
};

test('renders upload button', () => {
  renderComponent({ handleMuseumImageChange: mockHandleMuseumImageChange, coverImage: '', errors: {} });

  const uploadButton = screen.getByText('Upload Museum Cover Image');
  expect(uploadButton).toBeInTheDocument();
});

test('calls handleMuseumImageChange when a file is selected', () => {
  renderComponent({ handleMuseumImageChange: mockHandleMuseumImageChange, coverImage: '', errors: {} });

  const fileInput = screen.getByLabelText('Upload Museum Cover Image');
  const file = new File(['dummy content'], 'example.png', { type: 'image/png' });

  fireEvent.change(fileInput, { target: { files: [file] } });

  expect(mockHandleMuseumImageChange).toHaveBeenCalled();
  expect(mockHandleMuseumImageChange).toHaveBeenCalledWith(expect.anything());
});

test('displays error message when there is an error', () => {
  renderComponent({ handleMuseumImageChange: mockHandleMuseumImageChange, coverImage: '', errors: mockErrors });

  const errorMessage = screen.getByText(mockErrors.coverImage);
  expect(errorMessage).toBeInTheDocument();
  expect(errorMessage).toHaveStyle({ color: 'rgb(211, 47, 47)' }); 
});

test('displays success message when image is uploaded', () => {
  renderComponent({ handleMuseumImageChange: mockHandleMuseumImageChange, coverImage: mockCoverImage, errors: {} });

  const successMessage = screen.getByText('Cover Image uploaded successfully!');
  expect(successMessage).toBeInTheDocument();
});
