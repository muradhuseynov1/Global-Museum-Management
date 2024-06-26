import React, { useState } from 'react';
import { auth, firestore } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { 
    doc, setDoc, 
    collection, getDocs, 
    query, where, updateDoc, 
} from 'firebase/firestore'; 
import { useNavigate, useParams, Link } from 'react-router-dom';
import { TextField, Button, FormControl, InputLabel, 
  Select, MenuItem, Box, Typography, 
  Paper, Stepper, Step, StepLabel, 
  Container, ThemeProvider } from '@mui/material';
import { getData } from 'country-list';
import * as styles from '../../styles/RegistrationStyles';
import { format } from 'date-fns';
import { validateEmail, validatePassword, capitalizeName, isAtLeast18YearsOld } from '../../components/utils/utils';
import CommonRegistrationForm from '../../components/forms/CommonRegistrationForm';

const Registration = () => {
  const { role } = useParams();  
  const [formData, setFormData] = useState({
    name:'',
    countryName: '', 
    dateOfBirth: null,
  });
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Registrar Details', 'City Details'];
  const [formErrors, setFormErrors] = useState({});
  const countries = getData().map(({ code, name }) => ({
    code: code,
    name: name
  }));

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'name' || name === 'surname') {
      value = capitalizeName(value);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = async () => {
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
      errors.dateOfBirth = "You must be at least 18 years old to register";
    }
    if (!formData.password) {
        errors.password = "This field cannot be empty";
    } else if (!validatePassword(formData.password)) {
        errors.password = "Password does not meet requirements: Password should contain at least 6 characters, including UPPER/lowercase and numbers and special characters";
    }
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";

    if (role === 'city') {
        if (!formData.cityName) {
            errors.cityName = "This field cannot be empty";
        } else {
            formData.cityName = capitalizeName(formData.cityName);
        }
        if (!formData.cityID) {
            errors.cityID = "This field cannot be empty";
        } else {
            const isValid = await isValidCityID(formData.cityID);
            if (!isValid) {
                errors.cityID = "Invalid or already assigned City ID";
            }
        }
        if (!formData.countryName || formData.countryName === "") {
            errors.countryName = "Please select a country";
        }
    }

    if (Object.keys(errors).length > 0) {
      errors.general = "Please correct the errors in the form before submitting.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDateChange = (newValue) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      dateOfBirth: newValue,
    }));
  };

  const isValidCityID = async (cityID) => {
    const cityIDQuery = query(collection(firestore, "cityIDs"), where("id", "==", cityID), where("assigned", "==", false));
    const querySnapshot = await getDocs(cityIDQuery);
    return !querySnapshot.empty; 
  };
    
  const markCityIDAsAssigned = async (cityID, cityName) => {
    const cityIDDocRef = (await getDocs(query(collection(firestore, "cityIDs"), where("id", "==", cityID)))).docs[0].ref;
    await updateDoc(cityIDDocRef, { 
      assigned: true, 
      cityName: cityName 
    });
  };          

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValidForm = await validateForm();
    if (!isValidForm) {
      console.log("Form validation failed", formErrors);
      return;
    }
    
    if (role === 'city') {
      const cityID = formData.cityID;
      const isValid = await isValidCityID(cityID);
      if (!isValid) {
        alert("Invalid or already assigned City ID");
        return;
      }
      if (!formData.cityID || !formData.cityName || !formData.countryName) {
        alert("Please fill all city-specific fields.");
        return; 
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      const collectionName = role === 'city' ? 'cityRegistrars' : 'tourists';
      const userDocRef = doc(firestore, collectionName, user.uid);
      const { password, confirmPassword, dateOfBirth, ...otherData } = formData;

      const formattedDOB = formData.dateOfBirth ? format(formData.dateOfBirth.toDate(), 'MM/dd/yyyy') : null;
      if (role === 'city') {
        const documentData = {
          email: formData.email,
          cityID: formData.cityID,
          countryName: formData.countryName,
          dateOfBirth: formattedDOB,
          ...otherData
        };

        await setDoc(userDocRef, documentData);
        await markCityIDAsAssigned(formData.cityID, formData.cityName);
      } else {
        const documentData = {
          email: formData.email,   
          id: user.uid,
          dateOfBirth: formattedDOB,
          ...otherData
        };
        delete documentData.countryName;
        await setDoc(userDocRef, documentData);
      }
      navigate('/'); 
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };
    
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <CommonRegistrationForm
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
              validateForm={validateForm}
              handleDateChange={handleDateChange}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField 
              label="City Name" 
              name="cityName" 
              value={formData.cityName} 
              onChange={handleInputChange}  
              data-testid="city-name-input"
              onBlur={() => validateForm()}
              fullWidth 
              sx={{ mb: 2 }} 
              error={!!formErrors.cityName}
              helperText={formErrors.cityName}
            />
            <TextField 
              label="City ID" 
              name="cityID" 
              value={formData.cityID} 
              onChange={handleInputChange}
              data-testid="city-id-input"
              onBlur={() => validateForm()}  
              fullWidth 
              sx={{ mb: 2 }}
              error={!!formErrors.cityID}
              helperText={formErrors.cityID}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                name="countryName"
                value={formData.countryName}
                onChange={handleInputChange}
                data-testid="country-select"
                onBlur={() => validateForm()}  
                error={!!formErrors.countryName}
                helperText={formErrors.countryName}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={styles.theme}>
      <Box sx={styles.boxContainer}>
        <Container maxWidth="sm">
          <Paper elevation={6} sx={styles.paperStyle}>
            <Typography variant="h5" gutterBottom>
              {role === 'city' ? 'City Registration' : 'Tourist Registration'}
            </Typography>
    
            {role === 'city' && (
              <>
                <Stepper activeStep={activeStep} alternativeLabel sx={styles.stepperStyle}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <form onSubmit={handleFormSubmit}>
                  {renderStepContent(activeStep)}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
                    {activeStep === 0 ? (
                      <Button variant="outlined" fullWidth data-testid="cancel-button" onClick={() => navigate('/')}>
                          Cancel
                      </Button>
                      ) : (
                      <Button color="inherit" fullWidth data-testid="back-button" onClick={handleBack}>
                          Back
                      </Button>
                    )}
                    {activeStep < steps.length - 1 && (
                      <Button variant="contained" color="primary" data-testid="next-button" fullWidth onClick={handleNext}>
                        Next
                      </Button>
                    )}
                    {activeStep === steps.length - 1 && (
                      <Button type="submit" variant="contained" data-testid="finish-button" fullWidth color="primary">
                        Finish
                      </Button>
                    )}
                  </Box>
                </form>
              </>
            )}
    
            {role === 'tourist' && (
              <form onSubmit={handleFormSubmit}>
                <>
                <CommonRegistrationForm
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  validateForm={validateForm}
                  handleDateChange={handleDateChange}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }}>
                    <Link to="/" style={{ textDecoration: 'none', width: '100%' }}>
                      <Button variant="outlined" fullWidth>Cancel</Button>
                    </Link>
                  </Box>
                  <Box sx={{ flex: '1 1 auto' }}>
                    <Button type="submit" variant="contained" color="primary" data-testid="submit-button" fullWidth>Submit</Button>
                  </Box>
                </Box>
                </>
              </form>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );      
};

export default Registration;