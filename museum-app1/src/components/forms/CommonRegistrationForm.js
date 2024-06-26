import React, { useState } from 'react';
import { TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const CommonRegistrationForm = ({ formData, formErrors, handleInputChange, validateForm, handleDateChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        onBlur={() => validateForm()}
        fullWidth
        sx={{ mb: 2 }}
        error={!!formErrors.name}
        helperText={formErrors.name}
        inputProps={{ 'data-testid': 'name-input' }}
      />
      <TextField
        label="Surname"
        name="surname"
        value={formData.surname}
        onChange={handleInputChange}
        onBlur={() => validateForm()}
        fullWidth
        sx={{ mb: 2 }}
        error={!!formErrors.surname}
        helperText={formErrors.surname}
        inputProps={{ 'data-testid': 'surname-input' }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField 
              {...params} 
              onBlur={() => validateForm()} 
              error={!!formErrors.dateOfBirth}
              sx={{ mb: 2 }}
              fullWidth
              inputProps={{ ...params.inputProps, 'data-testid': 'dateOfBirth-input' }}
            />
          )}
          inputFormat="MM/DD/YYYY"
        />
      </LocalizationProvider>
      {formErrors.dateOfBirth && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }} data-testid="dateOfBirth-error">
          {formErrors.dateOfBirth}
        </Typography>
      )}
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        onBlur={() => validateForm()}
        fullWidth
        sx={{ mb: 2, mt: 2 }}
        error={!!formErrors.email}
        helperText={formErrors.email}
        inputProps={{ 'data-testid': 'email-input' }}
      />
      <TextField
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleInputChange}
        onBlur={() => validateForm()}
        fullWidth
        sx={{ mb: 2 }}
        error={!!formErrors.password}
        helperText={formErrors.password}
        inputProps={{ 'data-testid': 'password-input' }}
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
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleInputChange}
        onBlur={() => validateForm()}
        fullWidth
        sx={{ mb: 2 }}
        error={!!formErrors.confirmPassword}
        helperText={formErrors.confirmPassword}
        inputProps={{ 'data-testid': 'confirmPassword-input' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={toggleConfirmPasswordVisibility}
                edge="end"
              >
                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default CommonRegistrationForm;
