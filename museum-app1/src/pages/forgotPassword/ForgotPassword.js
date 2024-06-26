import React, { useState } from "react";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, ThemeProvider } from '@mui/material';
import { theme, boxStyle, containerStyle, boxInnerStyle } from '../../styles/ForgotPasswordStyles';
import { validateLoginEmail } from '../../components/utils/utils';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();

    const error = validateLoginEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      setMessage("If the email address you provided exists in our database, you will receive a password reset email shortly.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={boxStyle}>
        <Container component="main" maxWidth="xs" sx={containerStyle}>
          <Box sx={boxInnerStyle}>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <form onSubmit={handleSendEmail} style={{ width: '100%' }}>
              <TextField
                type="email"
                label="Email"
                variant="outlined"
                margin="normal"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Send
              </Button>
            </form>
            {emailSent && <Typography color="primary">{message}</Typography>}
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" sx={{ mt: 1 }}>
                Back to Login
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ForgotPassword;
