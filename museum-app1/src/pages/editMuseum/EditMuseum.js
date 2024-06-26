import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Box, Typography, Step, StepLabel, ThemeProvider } from '@mui/material';
import currencyCodes from 'currency-codes';
import { registerLocale } from "react-datepicker";
import enGB from 'date-fns/locale/en-GB'; 
import "react-datepicker/dist/react-datepicker.css";
import MuseumDetailsForm from '../../components/forms/MuseumDetailsForm';
import ImageUpload from '../../components/inputs/ImageUpload';
import TicketPricingForm from '../../components/forms/TicketPricingForm';
import OperatingScheduleForm from '../../components/forms/OperatingScheduleForm';
import * as styles from '../../styles/EditMuseumStyles';

registerLocale('en-GB', enGB); 

const EditMuseum = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [museumData, setMuseumData] = useState({
    name: '',
    summary: '',
    history: '',
    address: '',
    daysAndHours: '',
    phoneNumber: '',
    website: '',
    currency: 'USD',
    openingTime: '',
    closingTime: '',
    openDays: [],
    timeSlots: {},
    ticketInfo: {
      adult: '',
      student: '',
      senior: '',
      minor: '',
    },
  });

  const [currency, setCurrency] = useState('USD'); 
  const [recurrence, setRecurrence] = useState('none');
  const [weekDays, setWeekDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });  
  const [recurrenceStartDate, setRecurrenceStartDate] = useState(new Date());
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(new Date());
  const [slotLimit, setSlotLimit] = useState(10);
  const [museumCoverImage, setMuseumCoverImage] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = React.useState({});
  const steps = ['Museum Details', 'Ticket Pricing', 'Operating Schedule'];
  const isNonEmptyString = (str) => str.trim() !== '';
  const allValuesAreNonEmpty = (obj) => Object.values(obj).every(isNonEmptyString);

  useEffect(() => {
    const fetchMuseumData = async () => {
      const museumDocRef = doc(firestore, "museums", id);
      const museumDocSnap = await getDoc(museumDocRef);
  
      if (museumDocSnap.exists()) {
        const data = museumDocSnap.data();
        setMuseumData(data); 
        setCurrency(data.currency || 'USD'); 
        setSlotLimit(data.slotLimit || 10); 
  
        if (data.openDays) {
          const openDaysAsDates = data.openDays.map(day => day.toDate ? day.toDate() : new Date(day));
          setMuseumData(prev => ({ ...prev, openDays: openDaysAsDates }));
        }
      } else {
        //console.log("No such museum!");
        console.error("No such museum!");
      }
    };
  
    fetchMuseumData();
  }, [id]);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('ticketInfo.')) {
        const fieldName = name.split('.')[1];
        setMuseumData(prev => ({
            ...prev,
            ticketInfo: {
                ...prev.ticketInfo,
                [fieldName]: value,
            },
        }));
    } else {
        setMuseumData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
        setMuseumCoverImage(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTimeSlots = generateTimeSlots();
  
    const updatedData = {
      ...museumData,
      currency, 
      slotLimit, 
      timeSlots: updatedTimeSlots
    };

    if (museumCoverImage) {
      const imageRef = ref(storage, `museumCoverImages/${museumCoverImage.name}`);
      try {
          const snapshot = await uploadBytes(imageRef, museumCoverImage);
          const downloadURL = await getDownloadURL(snapshot.ref);
          updatedData.museumCoverImage = downloadURL; 
      } catch (error) {
          console.error("Error uploading image: ", error);
      }
    }
  
    const museumDocRef = doc(firestore, "museums", id);
  
    try {
      await updateDoc(museumDocRef, updatedData);
      navigate('/city-dashboard');
    } catch (error) {
      console.error("Error updating museum: ", error);
    }
  };  

  const currencyList = currencyCodes.data.map((currency) => ({
    code: currency.code,
    name: `${currency.code} - ${currency.currency}`,
  }));

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

  const validateStep = (step) => {
    switch (step) {
      case 0:
          const isMuseumDetailsValid =
            isNonEmptyString(museumData.name) &&
            isNonEmptyString(museumData.summary) &&
            isNonEmptyString(museumData.history) &&
            isNonEmptyString(museumData.address) &&
            isNonEmptyString(museumData.daysAndHours) 
          const isPhoneNumberValid = isNonEmptyString(museumData.phoneNumber);
          const isWebsiteValid = /^https?:\/\/.+/.test(museumData.website); 

        return isMuseumDetailsValid && isPhoneNumberValid && isWebsiteValid;
      case 1:
        const ticketInfoValid = allValuesAreNonEmpty(museumData.ticketInfo) &&
                                Object.values(museumData.ticketInfo).every((price) => !isNaN(price) && parseFloat(price) >= 0);
        return ticketInfoValid;
      case 2:
        const openDaysValid = museumData.openDays.length > 0 &&
                              museumData.openDays.every(date => date instanceof Date);
        const timeValid = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/.test(museumData.openingTime) &&
                          /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/.test(museumData.closingTime);
        const slotLimitValid = parseInt(museumData.slotLimit) >= 10;
        console.log('Validating Operating Schedule:', openDaysValid, timeValid, slotLimitValid, 'Open Days:', museumData.openDays);
        return openDaysValid && timeValid && slotLimitValid;
      default:
        return false;
    }
  };  

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      alert('Please fill all the fields correctly before proceeding.');
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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

  const generateTimeSlots = () => {
    const timeSlots = {};
    const openingHour = parseInt(museumData.openingTime.split(':')[0], 10);
    const openingMinutes = parseInt(museumData.openingTime.split(':')[1], 10);
    const closingHour = parseInt(museumData.closingTime.split(':')[0], 10);
    const closingMinutes = parseInt(museumData.closingTime.split(':')[1], 10);
  
    museumData.openDays.forEach(day => {
      const startTime = new Date(day.setHours(openingHour, openingMinutes));
      const endTime = new Date(day.setHours(closingHour, closingMinutes));
      let currentTime = startTime;
      if (!timeSlots[day.toDateString()]) {
        timeSlots[day.toDateString()] = [];
      }
      while (currentTime < endTime) {
        const slot = currentTime.toISOString();
        timeSlots[day.toDateString()].push({ time: slot, limit: slotLimit, booked: 0 });
        currentTime = new Date(currentTime.getTime() + 30 * 60000); 
      }
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
            museumCurrency={currency}
            museumCurrencyList={currencyList}
            errors={errors}
          />
        );
      case 2:
        return (
          <Box sx={{ width: '100%' }} >
            <Typography variant="h6" gutterBottom>
              Modify Opening Days:
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
            <TextField
              label="Slot Limit"
              type="number"
              name="slotLimit"
              value={slotLimit}
              onChange={(e) => setSlotLimit(e.target.value)}
              fullWidth
              sx={{ my: 2 }}
            />
            <TextField
              label="Opening Time"
              type="time"
              name="openingTime"
              value={museumData.openingTime}
              onChange={handleChange}
              fullWidth
              sx={{ my: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Closing Time"
              type="time"
              name="closingTime"
              value={museumData.closingTime}
              onChange={handleChange}
              fullWidth
              sx={{ my: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        );
      default:
        return "Unknown step";
    }
  };
  
  return (
    <ThemeProvider theme={styles.theme}>
      <styles.StyledBox>
        <styles.StyledContainer maxWidth="sm">
          <styles.StyledPaper elevation={6}>
            <Typography>Edit Museum</Typography>
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

export default EditMuseum;
