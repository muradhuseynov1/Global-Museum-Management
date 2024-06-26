import React from 'react';
import { Box, Card, CardActions, CardMedia, Grid, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { UploadButton } from '../utils/utils';
import { Container } from '@mui/system';

const SectionWithVisualsCity = ({ sections, uploadImage, deleteImage }) => {
  return sections.map((section, index) => (
    <Container maxWidth="lg" key={index} sx={{ mt: 5, mb: 4 }}>
      <Box key={index}
        sx={{
          my: 4,
          p: 3.5,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          {section.title}
          <UploadButton label={`Upload ${section.title} Image`} onUpload={(e) => uploadImage(section.sectionKey, e.target.files[0])} />
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{section.content}</Typography>
        <Grid container spacing={2}>
          {section.visuals.map((image, imgIndex) => (
            <Grid item xs={12} sm={3} key={imgIndex}> 
              <Card>
                <a href={image} target="_blank" rel="noopener noreferrer">
                  <CardMedia component="img" height="140" image={image} alt={`${section.title} visual`} />
                </a>
                <CardActions>
                  <IconButton 
                    data-testid={`delete-${section.sectionKey}-visual-${imgIndex}`}
                    onClick={() => deleteImage(image, section.sectionKey)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  ));
};

export default SectionWithVisualsCity;
