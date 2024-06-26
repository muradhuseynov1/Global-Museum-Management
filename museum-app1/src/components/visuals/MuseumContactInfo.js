import React from 'react';
import { Container, Grid, Typography, Box, Link, Paper } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { styled } from '@mui/material/styles';

const CustomLink = styled(Link)(({ theme }) => ({
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme.palette.secondary.main,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: 400,
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const MuseumContactInfo = ({ museum, isGeocodingComplete, geocodedCoords, customIcon, children }) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 9, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} mt={6}>
          <Box sx={{ mt: 2, mb: 2, p:3, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h4" component="h2" color="textPrimary" gutterBottom>
            Contact
          </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Address:</strong> {museum.address}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Telephone:</strong> {museum.phoneNumber}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Website: </strong>
              <CustomLink href={museum.website} target="_blank" rel="noopener noreferrer">
                {museum.website}
              </CustomLink>
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Opening Hours:</strong> {museum.daysAndHours}
            </Typography>
          </Box>
          {children}
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            {museum && isGeocodingComplete && geocodedCoords && (
              <MapContainer center={[geocodedCoords.lat, geocodedCoords.lng]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[geocodedCoords.lat, geocodedCoords.lng]} icon={customIcon}>
                  <Popup>{museum.name} is located here.</Popup>
                </Marker>
              </MapContainer>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MuseumContactInfo;
