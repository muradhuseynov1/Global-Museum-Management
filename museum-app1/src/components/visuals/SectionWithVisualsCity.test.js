import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SectionWithVisualsCity from './SectionWithVisualsCity';
import { UploadButton } from '../utils/utils';

jest.mock('../utils/utils', () => ({
  ...jest.requireActual('../utils/utils'),
  UploadButton: ({ label, onUpload }) => (
    <button onClick={() => {
      const event = { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } };
      onUpload(event);
    }}>{label}</button>
  )
}));

const mockSections = [
  {
    title: 'Section 1',
    content: 'Content for section 1',
    visuals: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    sectionKey: 'section1'
  },
  {
    title: 'Section 2',
    content: 'Content for section 2',
    visuals: ['https://example.com/image3.jpg'],
    sectionKey: 'section2'
  }
];

const mockUploadImage = jest.fn();
const mockDeleteImage = jest.fn();

test('renders sections correctly', () => {
  render(<SectionWithVisualsCity sections={mockSections} uploadImage={mockUploadImage} deleteImage={mockDeleteImage} />);
  
  mockSections.forEach(section => {
    expect(screen.getByText(section.title)).toBeInTheDocument();
    expect(screen.getByText(section.content)).toBeInTheDocument();
  });

  mockSections.forEach(section => {
    const images = screen.getAllByAltText(`${section.title} visual`);
    expect(images).toHaveLength(section.visuals.length);
    images.forEach((img, index) => {
      expect(img).toHaveAttribute('src', section.visuals[index]);
    });
  });
});

test('handles image upload', () => {
  render(<SectionWithVisualsCity sections={mockSections} uploadImage={mockUploadImage} deleteImage={mockDeleteImage} />);

  const uploadButton = screen.getByText('Upload Section 1 Image');
  fireEvent.click(uploadButton);

  expect(mockUploadImage).toHaveBeenCalledWith('section1', expect.any(File));
});

test('handles image deletion', () => {
  render(<SectionWithVisualsCity sections={mockSections} uploadImage={mockUploadImage} deleteImage={mockDeleteImage} />);

  const deleteButton = screen.getByTestId('delete-section1-visual-0');
  fireEvent.click(deleteButton);

  expect(mockDeleteImage).toHaveBeenCalledWith('https://example.com/image1.jpg', 'section1');
});
