import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import thesisIcon from '../../assets/thesis_icon1.png';

const Footer = () => {
  const theme = useTheme();

  const footerStyle = {
    backgroundColor: '#123456', 
    color: theme.palette.getContrastText('#123456'), 
    padding: theme.spacing(2),
    marginTop: 'auto', 
    zIndex: theme.zIndex.appBar
  };

  const contentStyle = {
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: theme.spacing(2)
  };

  return (
    <Box component="footer" sx={footerStyle}>
      <Container maxWidth="lg">
        <Box sx={contentStyle}>
          <img src={thesisIcon} alt="Logo" style={{ width: '50px', height: '50px' }} />
          <Box>
            <Typography variant="subtitle2" color="inherit" gutterBottom>
              Global Museum Management
            </Typography>
            <Typography variant="caption" color="inherit">
              © {new Date().getFullYear()} Global Museum Management. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
