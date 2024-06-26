import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../firebase';
import { Button, Typography, Stepper, Step, StepLabel, Box, ThemeProvider } from '@mui/material';
import enGB from 'date-fns/locale/en-GB'; 
import "react-datepicker/dist/react-datepicker.css";
import currencyCodes from 'currency-codes';
import { registerLocale } from "react-datepicker";
import { CityContext } from '../../contexts/CityContext';
import * as styles from '../../styles/AddMuseumStyles';
import '../../styles/AddMuseum.css'
import MuseumDetailsForm from '../../components/forms/MuseumDetailsForm';
import ImageUpload from '../../components/inputs/ImageUpload';
import TicketPricingForm from '../../components/forms/TicketPricingForm';
import OperatingScheduleForm from '../../components/forms/OperatingScheduleForm';
import OperatingTimesForm from '../../components/forms/OperatingTimesForm';

registerLocale('en-GB', enGB);

const AddMuseum = () => {
  const { cityID } = useContext(CityContext);
  const navigate = useNavigate();
  const [museumData, setMuseumData] = useState({
    name: '',
    summary: '',
    history: '',
    address: '',
    daysAndHours: '',
    phoneNumber: '',
    website: '',
    ticketInfo: {
      adult: '',
      student: '',
      senior: '',
      minor: ''
    },
    currency: 'USD',
    openingTime: '',
    closingTime: '',
    slotLimit: 10, 
    openDays: [],
    timeSlots: {}
  });

  const [recurrence, setRecurrence] = useState('none');
  const [recurrenceStartDate, setRecurrenceStartDate] = useState(new Date());
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(new Date());
  const [museumCoverImage, setMuseumCoverImage] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Museum Details', 'Ticket Pricing', 'Operating Schedule'];
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = React.useState({});
  const [weekDays, setWeekDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });  


  const validationRules = {
    isNonEmptyString: (value) => value.trim() !== '' ? null : 'This field cannot be empty.',
    isValidUrl: (value) => /^https?:\/\/.+/.test(value) ? null : 'Enter a valid URL.',
    isValidPhoneNumber: (value) => /^\+?(\d.*){3,}$/.test(value) ? null : 'Enter a valid phone number.',
    isValidNumber: (value) => !isNaN(value) && parseFloat(value) >= 0 ? null : 'Enter a valid number.',
    isValidDateArray: (values) => values.every(date => date instanceof Date) ? null : 'Select valid dates.',
    isValidTime: (value) => /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/.test(value) ? null : 'Enter a valid time (HH:MM).',
    isMinimumLimit: (value, limit) => parseInt(value) >= limit ? null : `Minimum limit is ${limit}.`,
    isFileUploaded: (file) => file ? null : 'Please upload an image.'
  };
  
  const validateField = (rule, value, ...params) => {
    return validationRules[rule](value, ...params);
  };
  
  const getErrorMessages = (fields) => {
    return Object.keys(fields).reduce((errors, key) => {
      const [rule, value, ...params] = fields[key];
      const errorMessage = validateField(rule, value, ...params);
      if (errorMessage) errors[key] = errorMessage;
      return errors;
    }, {});
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        const errors = getErrorMessages({
          name: ['isNonEmptyString', museumData.name],
          summary: ['isNonEmptyString', museumData.summary],
          history: ['isNonEmptyString', museumData.history],
          address: ['isNonEmptyString', museumData.address],
          daysAndHours: ['isNonEmptyString', museumData.daysAndHours],
          phoneNumber: ['isValidPhoneNumber', museumData.phoneNumber],
          website: ['isValidUrl', museumData.website],
          coverImage: ['isFileUploaded', museumCoverImage]
        });
        return Object.keys(errors).length === 0 ? true : errors;
      case 1:
          const ticketErrors = getErrorMessages({
              ...Object.keys(museumData.ticketInfo).reduce((acc, key) => {
                  acc[`ticketInfo.${key}`] = ['isValidNumber', museumData.ticketInfo[key]];
                  return acc;
              }, {})
          });
          return Object.keys(ticketErrors).length === 0 ? true : ticketErrors;      
        case 2:
            const scheduleErrors = getErrorMessages({
              openDays: ['isValidDateArray', museumData.openDays],
              openingTime: ['isValidTime', museumData.openingTime],
              closingTime: ['isValidTime', museumData.closingTime],
              slotLimit: ['isMinimumLimit', museumData.slotLimit, 10]
            });
          return Object.keys(scheduleErrors).length === 0 ? true : scheduleErrors;        
      default:
        return false;
    }
  };

  const handleNext = () => {
    const validationResult = validateStep(activeStep);
    if (validationResult === true) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setErrors({});
    } else if (typeof validationResult === 'object' && Object.keys(validationResult).length > 0) {
      setErrors(validationResult);
    } else {
      alert('An unexpected error occurred. Please try again.');
    }
  };
  

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setMuseumCoverImage(e.target.files[0]);
    }
  };

  const handleDateSelect = (date) => {
    setMuseumData(prevState => {
      const existingDates = prevState.openDays;
      if (existingDates.find(d => d.getTime() === date.getTime())) {
        return { ...prevState, openDays: existingDates.filter(d => d.getTime() !== date.getTime()) };
      } else {
        return { ...prevState, openDays: [...existingDates, date] };
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMuseumData({ ...museumData, [name]: value });

    if (name === "currency") {
      setMuseumData(prevState => ({
        ...prevState,
        currency: value
      }));
    } else if (name.startsWith('ticketInfo.')) {
      const fieldName = name.split('.')[1];
      setMuseumData(prevState => ({
        ...prevState,
        ticketInfo: {
          ...prevState.ticketInfo,
          [fieldName]: value
        }
      }));
    } else {
      setMuseumData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const addTimeSlotsForDay = (day, start, end, timeSlots) => {
    let currentTime = start;
    if (!timeSlots[day.toDateString()]) {
        timeSlots[day.toDateString()] = [];
    }
    while (currentTime < end) {
        const slot = currentTime.toISOString();
        timeSlots[day.toDateString()].push({ time: slot, limit: museumData.slotLimit, booked: 0 });
        currentTime = new Date(currentTime.getTime() + 30*60000);
    }
  };

  const currencyList = currencyCodes.data.map((currency) => ({
    code: currency.code,
    name: `${currency.code} - ${currency.currency}`,
  })); 

  useEffect(() => {
    if (!cityID) {
      alert("City ID is not set.");
      return;
    }
  }, [cityID]);  

  useEffect(() => {
    const updateOpenDaysBasedOnRecurrence = () => {
      if (recurrence === 'none') {
        setMuseumData(prevState => ({
          ...prevState,
          openDays: []
        }));
        return;
      }
    
      const startDate = new Date(recurrenceStartDate);
      const endDate = new Date(recurrenceEndDate);
      let dates = [];
    
      if (recurrence === 'daily') {
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
      } else if (recurrence === 'weekly') {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dayIndex = d.getDay();
          const dayName = dayNames[dayIndex];
          if (weekDays[dayName]) {
            dates.push(new Date(d));
          }
        }
      }
    
      setMuseumData(prevState => ({
        ...prevState,
        openDays: dates
      }));
    };    
  
    updateOpenDaysBasedOnRecurrence();
  }, [recurrence, recurrenceStartDate, recurrenceEndDate, weekDays]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityID) {
      alert("City ID is not set.");
      return;
    }
    if (processing) return;
    setProcessing(true);

    const museumRef = collection(firestore, 'museums');
    const q = query(museumRef, where('name', '==', museumData.name), where('cityID', '==', cityID));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert('A museum with this name already exists in this city.');
      return;
    }

    const generatedTimeSlots = generateTimeSlots();

    try {
      const museumDataWithCityID = {
        ...museumData,
        cityID,
        timeSlots: generatedTimeSlots,
        museumCoverImage: '',
    };

    const docRef = await addDoc(museumRef, museumDataWithCityID);

    if (museumCoverImage) {
      const imageRef = ref(storage, `museums/${docRef.id}/museumCoverImage/${museumCoverImage.name}`);
      const snapshot = await uploadBytes(imageRef, museumCoverImage);
      const coverImageUrl = await getDownloadURL(snapshot.ref);

      await updateDoc(doc(firestore, 'museums', docRef.id), {
        museumCoverImage: coverImageUrl,
      });
    }
  
    alert('Museum added successfully');
    navigate('/city-dashboard');
    } catch (error) {
      console.error('Error adding museum: ', error);
      alert('An error occurred while adding the museum.');
    } finally {
      setProcessing(false);
    }
  };

  const generateTimeSlots = () => {
    const timeSlots = {};
    const openingHour = parseInt(museumData.openingTime.split(':')[0]);
    const openingMinutes = parseInt(museumData.openingTime.split(':')[1]);
    const closingHour = parseInt(museumData.closingTime.split(':')[0]);
    const closingMinutes = parseInt(museumData.closingTime.split(':')[1]);
  
    museumData.openDays.forEach(day => {
        const startTime = new Date(day.setHours(openingHour, openingMinutes));
        const endTime = new Date(day.setHours(closingHour, closingMinutes));
        addTimeSlotsForDay(day, startTime, endTime, timeSlots);
    });

    return timeSlots;
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <MuseumDetailsForm
              museumValue={museumData}
              handleMuseumChange={handleChange}
              errors={errors}
            />
            <ImageUpload
              handleMuseumImageChange={handleImageChange}
              coverImage={museumCoverImage}
              errors={errors}
            />
          </Box>
        );
      case 1:
        return (
          <TicketPricingForm
            museumTicketInfo={museumData.ticketInfo}
            handleMuseumChange={handleChange}
            museumCurrency={museumData.currency}
            museumCurrencyList={currencyList}
            errors={errors}
          />
        );
        case 2:
          return (
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Choose Opening Days:
              </Typography>
              <OperatingScheduleForm
                museumHandleSelectDate={handleDateSelect}
                museumOpenDays={museumData.openDays}
                museumRecurrence={recurrence}
                museumSetRecurrence={setRecurrence}
                museumWeekDays={weekDays}
                museumSetWeekDays={setWeekDays}
                museumRecurrenceStartDate={recurrenceStartDate}
                museumSetRecurrenceStartDate={setRecurrenceStartDate}
                museumRecurrenceEndDate={recurrenceEndDate}
                museumSetRecurrenceEndDate={setRecurrenceEndDate}
                errors={errors}
              />
              <OperatingTimesForm
                museumSlotLimit={museumData.slotLimit}
                museumHandleChange={handleChange}
                museumOpeningTime={museumData.openingTime}
                museumClosingTime={museumData.closingTime}
                errors={errors}
              />
            </Box>
          );        
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={styles.theme}>
      <styles.StyledBox>
        <styles.StyledContainer maxWidth="sm">
          <styles.StyledPaper elevation={6}>
            <Typography>Add Museum</Typography>
            <styles.StyledStepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </styles.StyledStepper>
            <styles.StyledForm onSubmit={handleSubmit}>
              {renderStepContent(activeStep)}
            </styles.StyledForm>
            <styles.StyledButtonsBox>
              {activeStep === 0 ? (
                <Button variant="outlined" onClick={() => navigate('/city-dashboard')}>
                  Cancel
                </Button>
              ) : (
                <Button color="inherit" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </styles.StyledButtonsBox>
          </styles.StyledPaper>
        </styles.StyledContainer>
      </styles.StyledBox>
    </ThemeProvider>
  );
};

export default AddMuseum;