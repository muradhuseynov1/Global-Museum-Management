import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Rating, TextField, Button
} from '@mui/material';

const AddReviewDialog = ({ open, onClose, starRating, setStarRating, reviewText, setReviewText, submitReview }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ bgcolor: '#123456', color: 'white', fontSize: '1.25rem' }}>Add Your Review</DialogTitle>
      <DialogContent sx={{ bgcolor: '#f4f6f8', '& .MuiTextField-root': { margin: '8px 0' } }}>
        <Rating
          data-testid="rating"
          name="simple-controlled"
          value={starRating}
          onChange={(event, newValue) => {
            setStarRating(newValue);
          }}
          sx={{ marginBottom: '20px', color: '#ffbf47' }}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Review"
          type="text"
          fullWidth
          variant="outlined"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          multiline
          rows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#123456',
              },
              '&:hover fieldset': {
                borderColor: '#123456',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#123456',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#123456',
            },
            '& .MuiInputLabel-root.Mui-focused': {
                color: '#123456',
            },
            backgroundColor: 'white',
          }}
          data-testid="review-text"
        />
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#f4f6f8', p: '16px' }}>
        <Button onClick={onClose} sx={{ color: '#123456', fontWeight: 'bold' }} data-testid="cancel-button">Cancel</Button>
        <Button onClick={submitReview} sx={{ color: '#123456', fontWeight: 'bold', backgroundColor: '#ffd617', '&:hover': { backgroundColor: '#ffc107' } }} data-testid="submit-button">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddReviewDialog;
