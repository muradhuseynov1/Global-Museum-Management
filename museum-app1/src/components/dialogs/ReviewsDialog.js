import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography,
  Box, Rating, Divider, Button, Tooltip
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import StarIcon from '@mui/icons-material/Star';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ReviewsDialog = ({ open, onClose, reviews, setSortMethod, sortMethod, setSortDirection, sortDirection, formatTimestamp }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#123456', color: 'white' }}>
        Comments
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: -3 }}>
          <Tooltip title="Sort by date">
            <IconButton onClick={() => setSortMethod('date')} color="inherit" aria-label="Sort by date">
              <EventNoteIcon sx={{ color: sortMethod === 'date' ? '#FFCC00' : 'white' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sort by stars">            
            <IconButton onClick={() => setSortMethod('stars')} color="inherit" aria-label="Sort by stars">
              <StarIcon sx={{ color: sortMethod === 'stars' ? '#FFCC00' : 'white' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sorting direction">
            <IconButton onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')} color="inherit" aria-label="Toggle sort direction">
              {sortDirection === 'desc' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ padding: '24px', backgroundColor: '#f4f6f8' }}>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Box key={index} sx={{ mb: 3, backgroundColor: 'white', borderRadius: '4px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <Typography variant="subtitle1" component="div" sx={{ mb: 1, fontWeight: 'bold', color: '#123456' }}>
                {review.userName} - {formatTimestamp(review.timestamp)}
              </Typography>
              <Rating value={review.rating} readOnly size="small" sx={{ color: '#ffbf47' }} />
              <Typography variant="body1" sx={{ mt: 2, color: '#4a4a4a' }}>
                {review.text}
              </Typography>
              {index < reviews.length - 1 && <Divider light sx={{ mt: 2, backgroundColor: '#dee2e6' }} />}
            </Box>
          ))
        ) : (
          <Typography sx={{ mt: 2, fontStyle: 'italic', color: '#123456' }}>No reviews yet.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#f4f6f8', p: '16px' }}>
        <Button onClick={onClose} sx={{ color: '#123456', fontWeight: 'bold' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReviewsDialog;
