import React, { useState } from "react";
import { auth, firestore } from "../../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Button, TextField, Typography, Container, Box, createTheme, ThemeProvider } from '@mui/material';
import loginStyles from "../../styles/LoginStyles";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import '../../styles/Login.css';
import { validateLoginEmail, validateLoginPassword } from "../../components/utils/utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      primary: {
        main: '#123456',
      },
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailValidationResult = validateLoginEmail(email);
    const passwordValidationResult = validateLoginPassword(password);

    setEmailError(emailValidationResult);
    setPasswordError(passwordValidationResult);

    if (emailValidationResult || passwordValidationResult) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const collections = ['cityRegistrars', 'tourists', 'admins'];
      let userSnapshot;
      let collectionName;

      for (const collection of collections) {
        const userDocRef = doc(firestore, collection, user.uid);
        userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          collectionName = collection;
          break;
        }
      }

      if (userSnapshot && userSnapshot.exists()) {
        switch (collectionName) {
          case 'cityRegistrars':
            navigate('/city-dashboard');
            break;
          case "tourists":
            navigate('/tourist-dashboard');
            break;
          case "admins":
            navigate('/admin-dashboard');
            break;
          default:
            console.error("No data available for user in specified collections");
        }
      } else {
        console.error("No data available for user in specified collections");
      }
    } catch (error) {
      setEmailError("Invalid login credentials.Please double-chech your email/password.");
      setPasswordError("Invalid login credentials.Please double-chech your email/password.");
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={loginStyles.mainContainer}>
        <Container component="main" maxWidth="xs" sx={loginStyles.formContainer}>
          <Box sx={loginStyles.form}>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
              <TextField
                error={!!emailError}
                helperText={emailError}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                data-testid="password-input"
                key={showPassword ? 'password' : 'text'}
                error={!!passwordError}
                helperText={passwordError}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={loginStyles.submitButton}
              >
                Login
              </Button>
              {error && <Typography color="error">{error}</Typography>}
              <Typography sx={{ mt: 2, textAlign: 'center' }}>
                <Link to="/forgot-password" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                  Forgot password?
                </Link>
              </Typography>
              <Box sx={loginStyles.linkContainer}>
                <Button
                  component={Link}
                  to="/signup"
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Sign up here
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
