import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const Loading = () => {
  return (
    <Box style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      <CircularProgress size={80} />
      <Typography variant="h6" style={{ marginTop: 20 }}>
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;
