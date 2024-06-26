import { createTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { Box, Container, Paper, Stepper } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#123456',
      light: '#345678',
    },
    common: {
      white: '#ffffff',
    },
  },
});

export const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#123456',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StyledContainer = styled(Container)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  padding: theme.spacing(3),
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  width: '100%',
}));

export const StyledForm = styled('form')({
  width: '100%',
});

export const StyledButtonsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));
