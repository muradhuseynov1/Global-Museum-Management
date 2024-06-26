import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { validateEmail, capitalizeName, isAtLeast18YearsOld } from '../../components/utils/utils';
import { Container } from '@mui/system';

const TouristForm = ({ currentTourist, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    dateOfBirth: null,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (currentTourist) {
      setFormData({
        ...currentTourist,
        dateOfBirth: currentTourist.dateOfBirth ? dayjs(currentTourist.dateOfBirth, 'MM/DD/YYYY') : null,
      });
    }
  }, [currentTourist]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'name' || name === 'surname') {
      value = capitalizeName(value);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dateOfBirth: date }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name) errors.name = "This field cannot be empty";
    if (!formData.surname) errors.surname = "This field cannot be empty";
    if (!formData.email) {
      errors.email = "This field cannot be empty";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Please enter a complete date of birth";
    } else if (!isAtLeast18YearsOld(formData.dateOfBirth)) {
      errors.dateOfBirth = "Tourist must be at least 18 years old";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const { email, dateOfBirth, ...otherData } = formData;
    otherData.dateOfBirth = dateOfBirth ? dateOfBirth.format('MM/DD/YYYY') : null;
  
    try {
      const emailQuery = query(collection(firestore, 'tourists'), where('email', '==', email));
      const emailSnapshot = await getDocs(emailQuery);
      const emailExists = !emailSnapshot.empty;
  
      if (currentTourist) {
        if (email !== currentTourist.email && emailExists) {
          setFormErrors({ email: 'This email is already in use.' });
          return;
        }
  
        const userDocRef = doc(firestore, 'tourists', currentTourist.id);
        await updateDoc(userDocRef, { email, ...otherData });
      } else {
        if (emailExists) {
          setFormErrors({ email: 'This email is already in use.' });
          return;
        }
  
        const userCredential = await createUserWithEmailAndPassword(auth, email, 'TemporaryPassword123');
        const user = userCredential.user;
        const userDocRef = doc(firestore, 'tourists', user.uid);
        await setDoc(userDocRef, { email, ...otherData });
      }
      onSave();
    } catch (error) {
      console.error('Error saving tourist:', error.message);
      setFormErrors({ submit: 'An error occurred while saving the tourist. Please try again.' });
    }
  };

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 600, width: '100%' }}>
        <Typography variant="h5" align='center' gutterBottom sx={{ mb: 3, mt: 2 }}>
          {currentTourist ? 'Edit Tourist' : 'Add Tourist'}
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            label="Surname"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
            error={!!formErrors.surname}
            helperText={formErrors.surname}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{ mb: 2 }}
                  error={!!formErrors.dateOfBirth}
                  helperText={formErrors.dateOfBirth}
                />
              )}
              inputFormat="MM/DD/YYYY"
            />
          </LocalizationProvider>
          {formErrors.dateOfBirth && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {formErrors.dateOfBirth}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 2 }}>
            <Button variant="outlined" onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default TouristForm;
