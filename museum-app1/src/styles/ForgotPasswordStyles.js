import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#123456',
    },
  },
});

export const boxStyle = {
  bgcolor: '#123456',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  m: 0,
  p: 0,
  overflow: 'hidden',
  position: 'fixed',
  top: 0,
  left: 0,
  boxSizing: 'border-box',
};

export const containerStyle = {
  bgcolor: 'white',
  borderRadius: 2,
  boxShadow: 3,
  p: 2,
  m: 'auto'
};

export const boxInnerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
