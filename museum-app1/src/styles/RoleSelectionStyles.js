import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#123456',
      light: '#345678'
    },
    common: {
      white: '#ffffff'
    }
  },
});

export const containerStyle = {
  bgcolor: '#123456',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  m: 0,
  p: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  minWidth: '100vw'
};

export const cardStyle = {
  width: 200,
  height: 250,
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: 6
  }
};

export const buttonStyle = {
  bgcolor: 'white',
  color: 'primary.main',
  '&:hover': {
    bgcolor: 'primary.light',
    color: 'common.white',
    boxShadow: 6
  }
};

export const typographyStyle = {
  textAlign: 'center',
  color: 'white',
  mb: 4
};

export const tooltipStyle = {
  backgroundColor: '#ffffff',
  color: '#123456',
  fontSize: '1rem',
  borderRadius: '4px',
  padding: '10px'
};

export const iconBoxStyle = {
  position: 'fixed',
  bottom: '16px',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  textAlign: 'center'
};
