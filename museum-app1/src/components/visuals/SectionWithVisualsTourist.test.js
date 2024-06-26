import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SectionWithVisualsTourist from './SectionWithVisualsTourist';

const mockSections = [
  {
    title: 'Tourist Spot 1',
    content: 'Description for tourist spot 1',
    visuals: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
  },
  {
    title: 'Tourist Spot 2',
    content: 'Description for tourist spot 2',
    visuals: ['https://example.com/image3.jpg']
  }
];

test('renders sections correctly', () => {
  render(<SectionWithVisualsTourist sections={mockSections} />);
  
  mockSections.forEach(section => {
    expect(screen.getByText(section.title)).toBeInTheDocument();
    expect(screen.getByText(section.content)).toBeInTheDocument();
  });

  mockSections.forEach(section => {
    section.visuals.forEach((image, index) => {
      expect(screen.getByAltText(`${section.title} visual ${index}`)).toHaveAttribute('src', image);
    });
  });
});
