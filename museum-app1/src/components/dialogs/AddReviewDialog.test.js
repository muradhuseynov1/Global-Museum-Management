import { render, screen, fireEvent } from '@testing-library/react';
import AddReviewDialog from './AddReviewDialog';

describe('AddReviewDialog', () => {
  const handleClose = jest.fn();
  const handleStarRating = jest.fn();
  const handleReviewText = jest.fn();
  const handleSubmitReview = jest.fn();

  beforeEach(() => {
    render(<AddReviewDialog open={true} onClose={handleClose} starRating={3} setStarRating={handleStarRating} reviewText="" setReviewText={handleReviewText} submitReview={handleSubmitReview} />);
  });

  test('renders rating and text fields correctly', () => {
    const rating = screen.getByTestId('rating');
    const reviewTextField = screen.getByTestId('review-text');
    expect(rating).toBeInTheDocument();
    expect(reviewTextField).toBeInTheDocument();
  });

  test('handles user interactions correctly', () => {
    const submitButton = screen.getByTestId('submit-button');
    const cancelButton = screen.getByTestId('cancel-button');

    fireEvent.click(cancelButton);
    expect(handleClose).toHaveBeenCalled();

    fireEvent.click(submitButton);
    expect(handleSubmitReview).toHaveBeenCalled();
  });
});
