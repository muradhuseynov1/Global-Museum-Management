import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

describe('DeleteConfirmationDialog', () => {
  test('renders dialog content and responds to user input', () => {
    const handleClose = jest.fn();
    const handleDelete = jest.fn();

    render(<DeleteConfirmationDialog open={true} onClose={handleClose} onDelete={handleDelete} />);

    expect(screen.getByText(/are you sure you want to delete this museum/i)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(handleClose).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('delete-button'));
    expect(handleClose).toHaveBeenCalledTimes(2); 
    expect(handleDelete).toHaveBeenCalled();
  });
});
