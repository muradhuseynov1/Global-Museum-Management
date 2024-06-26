import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Grid, Container, Box, Button, ThemeProvider, Tooltip  } from '@mui/material';
import { theme, containerStyle, cardStyle, buttonStyle, typographyStyle, tooltipStyle, iconBoxStyle } from '../../styles/RoleSelectionStyles';
import InfoIcon from '@mui/icons-material/Info';
import cityRole from '../../assets/cityRole.png';
import touristRole from '../../assets/touristRole.png';

const RoleSelection = () => {
  const navigate = useNavigate();
  const roles = [
    {
      name: "City Registrar",
      image: cityRole,
      link: "/signup/city"
    },
    {
      name: "Tourist",
      image: touristRole,
      link: "/signup/tourist"
    }
  ];

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={containerStyle}>
        <Typography variant="h4" sx={typographyStyle}>Select Your Role</Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ maxWidth: '100%' }}>
          {roles.map((role, index) => (
            <Grid item key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={cardStyle}>
                <CardActionArea component={Link} to={role.link}>
                  <CardMedia component="img" image={role.image} alt={role.name} sx={{ objectFit: 'cover' }} />
                  <CardContent>
                    <Typography gutterBottom variant="subtitle1" component="div" textAlign="center">
                      {role.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button onClick={handleCancel} variant="contained" sx={buttonStyle}>
            Cancel
          </Button>
        </Box>
        <Box sx={iconBoxStyle}>
          <Tooltip
            title={
              <Typography sx={{ fontSize: '1.25rem' }}>
                If you are a City Registrar, please contact system administrators via email: "husenovmurad24@gmail.com" to receive your unique City ID to register in the application.
              </Typography>
            }
            arrow
            placement="top"
          >
            <InfoIcon fontSize="large" sx={{ color: 'white' }} />
          </Tooltip>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RoleSelection;
