import { styled } from '@mui/material/styles';
import { Box, Container, Paper, Stepper } from '@mui/material';
import { createTheme } from '@mui/material/styles';

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
  borderRadius: theme.shape.borderRadius * 2,
  width: '100%',
  padding: theme.spacing(3),
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  width: '100%',
}));

export const StyledFormBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  paddingTop: theme.spacing(2),
}));

export const StyledButtonBox = styled(Box)({
  flex: '1 1 auto',
});
