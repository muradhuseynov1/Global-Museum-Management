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

export const boxContainer = {
    bgcolor: '#123456',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
};
  
export const paperStyle = {
    bgcolor: 'white',
    borderRadius: 2,
    width: '100%',
    p: 3,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
};
  
export const stepperStyle = {
    width: '100%',
    mb: 1,
};
  
export const buttonGroup = {
    display: 'flex',
    justifyContent: 'center',
    mt: 2,
    gap: 2,
};     
  
export const fullWidth = {
    mb: 2,
};
    