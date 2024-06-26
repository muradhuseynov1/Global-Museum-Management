import { render, screen, fireEvent } from '@testing-library/react';
import ReviewsDialog from './ReviewsDialog';

const mockReviews = [
  {
    userName: "John Doe",
    timestamp: 1625097600000, 
    rating: 4,
    text: "Great service!",
  },
  {
    userName: "Jane Smith",
    timestamp: 1625011200000,
    rating: 5,
    text: "Outstanding experience.",
  },
];

const mockFormatTimestamp = jest.fn(timestamp => new Date(timestamp).toLocaleDateString());

describe('ReviewsDialog', () => {
  it('should render reviews correctly', () => {
    render(<ReviewsDialog
      open={true}
      onClose={jest.fn()}
      reviews={mockReviews}
      setSortMethod={jest.fn()}
      sortMethod='date'
      setSortDirection={jest.fn()}
      sortDirection='desc'
      formatTimestamp={mockFormatTimestamp}
    />);

    expect(screen.getByText('Great service!')).toBeInTheDocument();
    expect(screen.getByText('Outstanding experience.')).toBeInTheDocument();
    expect(mockFormatTimestamp).toHaveBeenCalledTimes(mockReviews.length);
  });

  it('should handle sort method changes to stars', () => {
    const setSortMethod = jest.fn();
    render(<ReviewsDialog
      open={true}
      onClose={jest.fn()}
      reviews={mockReviews}
      setSortMethod={setSortMethod}
      sortMethod='date'
      setSortDirection={jest.fn()}
      sortDirection='desc'
      formatTimestamp={mockFormatTimestamp}
    />);

    fireEvent.click(screen.getByLabelText('Sort by stars'));
    expect(setSortMethod).toHaveBeenCalledWith('stars');
  });

  it('should handle sort method changes to date', () => {
    const setSortMethod = jest.fn();
    render(<ReviewsDialog
      open={true}
      onClose={jest.fn()}
      reviews={mockReviews}
      setSortMethod={setSortMethod}
      sortMethod='stars' 
      setSortDirection={jest.fn()}
      sortDirection='desc'
      formatTimestamp={mockFormatTimestamp}
    />);

    fireEvent.click(screen.getByLabelText('Sort by date'));
    expect(setSortMethod).toHaveBeenCalledWith('date');
  });

  it('should toggle sort direction', () => {
    const setSortDirection = jest.fn();
    render(<ReviewsDialog
      open={true}
      onClose={jest.fn()}
      reviews={mockReviews}
      setSortMethod={jest.fn()}
      sortMethod='date'
      setSortDirection={setSortDirection}
      sortDirection='desc' 
      formatTimestamp={mockFormatTimestamp}
    />);

    fireEvent.click(screen.getByLabelText('Toggle sort direction'));
    expect(setSortDirection).toHaveBeenCalledWith('asc');
  });

  it('should close dialog on close button click', () => {
    const handleClose = jest.fn();
    render(<ReviewsDialog
      open={true}
      onClose={handleClose}
      reviews={mockReviews}
      setSortMethod={jest.fn()}
      sortMethod='date'
      setSortDirection={jest.fn()}
      sortDirection='desc'
      formatTimestamp={mockFormatTimestamp}
    />);

    fireEvent.click(screen.getByText('Close'));
    expect(handleClose).toHaveBeenCalled();
  });
});
