import React from 'react';
import { Box, Card, CardMedia, Container, Typography } from '@mui/material';
import Slider from 'react-slick';

const SectionWithVisualsTourist = ({ sections }) => {
  return sections.map((section, index) => {
    const sliderSettings = {
      dots: false,
      infinite: section.visuals.length > 4,
      speed: 500,
      slidesToShow: Math.min(4, section.visuals.length),
      slidesToScroll: Math.min(4, section.visuals.length),
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: section.visuals.length > 3,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: section.visuals.length > 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: section.visuals.length > 1
          }
        }
      ]
    };

    return (
      <Container maxWidth="lg" key={index} sx={{ mt: 5, mb: 4 }}>
        <Box
          sx={{
            my: 4,
            p: 3.5,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
          <Typography variant="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {section.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{section.content}</Typography>
          <Slider {...sliderSettings}>
            {section.visuals.map((image, imgIndex) => (
              <Box key={imgIndex} sx={{ padding: '0 0px' }}>
                <Card sx={{ margin: '0 10px' }}>
                  <a href={image} target="_blank" rel="noopener noreferrer">
                    <CardMedia component="img" height="140" image={image} alt={`${section.title} visual ${imgIndex}`} />
                  </a>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    );
  });
};

export default SectionWithVisualsTourist;
