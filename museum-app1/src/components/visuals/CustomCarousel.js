import Carousel from 'react-material-ui-carousel';
import React from 'react';
import { Box, IconButton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import DeleteIcon from '@mui/icons-material/Delete';
import { LazyImage } from '../utils/utils';

const CarouselItem = ({ image, onDelete }) => (
  <Box
    sx={{
      backgroundColor: '#e7eaee',
      position: 'relative', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '500px'
    }}
  >
    <LazyImage src={image} alt="Carousel" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
    {onDelete && (
      <IconButton
        aria-label="delete"
        onClick={(e) => {
          e.stopPropagation(); 
          onDelete();
        }}
        sx={{
          position: 'absolute',
          color: 'rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          borderRadius: '50%', 
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
            color: 'rgba(255, 255, 255, 1)', 
          },
          pointerEvents: 'auto',
        }}
      >
        <DeleteIcon fontSize="large" />
      </IconButton>
    )}
  </Box>
);

const CustomCarousel = ({ images, onDelete, emptyMessage }) => {
  if (images.length === 0) {
    return <div><strong>{emptyMessage}</strong></div>;
  }

  return (
    <Carousel
      NextIcon={<NavigateNextIcon aria-label="Next" />}
      PrevIcon={<NavigateBeforeIcon aria-label="Previous" />}
      navButtonsProps={{ className: 'carouselNavigationIcon' }}
      navButtonsWrapperProps={{ className: 'carouselNavigationIconWrapper' }}
      animation="slide"
    >
      {images.map((image, index) => (
        <CarouselItem 
          key={index} 
          image={image} 
          onDelete={onDelete ? () => onDelete(image) : null}
        />
      ))}
    </Carousel>
  );
};

export default CustomCarousel;
