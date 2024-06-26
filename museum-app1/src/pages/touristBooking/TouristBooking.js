import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { firestore, auth } from '../../firebase';
import { doc, getDoc, updateDoc, collection, addDoc  } from 'firebase/firestore';
import "react-datepicker/dist/react-datepicker.css";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Step, StepLabel, Button, Typography, Checkbox, FormControlLabel, Box,
        Grid, TextField, CircularProgress, Divider, IconButton, Tooltip, createTheme, ThemeProvider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import * as styles from '../../styles/TouristBookingStyles';

const TouristBooking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user] = useAuthState(auth);
  const [museum, setMuseum] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [sendEmail, setSendEmail] = useState(false);
  const steps = ['Choose Tickets', 'Select Date', 'Select Time Slot', 'Summary'];
  const [activeStep, setActiveStep] = useState(0);
  const [ticketCounts, setTicketCounts] = useState({
    adult: 0,
    student: 0,
    senior: 0,
    minor: 0
  });

  const isAnyTicketChosen = () => {
    return Object.values(ticketCounts).some(count => count > 0);
  };

  useEffect(() => {
    const fetchMuseumData = async () => {
      const docRef = doc(firestore, 'museums', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const openDays = data.openDays.map(timestamp => 
          new Date(timestamp.seconds * 1000)
        );
        console.log("Fetched time slots:", data.timeSlots);
        setMuseum({ ...data, openDays, ticketInfo: data.ticketInfo, currency: data.currency, });
      }
    };

    fetchMuseumData();
  }, [id]);

  const handleDateSelect = (date) => {
    if (isAnyTicketChosen()) {
      setSelectedDate(date);
    } else {
      alert("Please select at least one ticket before choosing a date.");
    }
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleTicketCountChange = (category, count) => {
    setTicketCounts(prev => ({ ...prev, [category]: count }));
  };

  const availableDates = museum?.openDays.map(timestamp => 
    new Date(timestamp.seconds * 1000)
  );  
   console.log("Available Dates:", availableDates);

   const showTimeSlots = selectedDate && museum?.timeSlots[selectedDate.toDateString()];

   const isSlotAvailable = (timeSlot) => {
    const totalTicketsToBook = Object.values(ticketCounts).reduce((sum, count) => sum + parseInt(count), 0);
    return (timeSlot.limit - timeSlot.booked) >= totalTicketsToBook;
  };

  const confirmBooking = async () => {
      if (!selectedTimeSlot || !museum) {
          alert("Please select a time slot.");
          return;
      }

      const totalTicketsToBook = Object.values(ticketCounts).reduce((sum, count) => sum + parseInt(count), 0);
      const museumRef = doc(firestore, 'museums', id);
      const museumSnap = await getDoc(museumRef);

      if (!museumSnap.exists()) {
          alert("Museum data not found.");
          return;
      }

      const museumData = museumSnap.data();
      const dateStr = selectedDate.toDateString();
      const timeSlotStr = selectedTimeSlot;
      const timeSlots = museumData.timeSlots[dateStr] || [];

      const slotIndex = timeSlots.findIndex(slot => slot.time === timeSlotStr);
      if (slotIndex === -1) {
          alert("Time slot not found.");
          return;
      }

      const slot = timeSlots[slotIndex];
      if (slot.booked + totalTicketsToBook > slot.limit) {
          alert("Not enough tickets available for this slot.");
          return;
      }

      slot.booked += totalTicketsToBook;
      timeSlots[slotIndex] = slot;


      try {
        await updateDoc(museumRef, {
            [`timeSlots.${dateStr}`]: timeSlots
        });

        const bookingData = {
            museumName: museumData.name,
            museumId: id,
            date: selectedDate,
            timeSlot: selectedTimeSlot,
            tickets: ticketCounts,
            touristId: user?.uid 
        };

        await addDoc(collection(firestore, 'bookings'), bookingData);
        alert('Booking confirmed!');

        if (sendEmail && user?.email) {
          try {
              const response = await fetch('http://localhost:3001/send-ticket', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      bookingDetails: bookingData,
                      userEmail: user.email
                  }),
              });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Email sent successfully:', responseData);
            } catch (error) {
              console.error('Error sending email:', error);
              console.error('Error details:', error.message);
            }
        }

        navigate(`/tourist-dashboard`);
    } catch (error) {
        console.error("Booking failed:", error);
        alert("Booking could not be completed. Please try again.");
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !isAnyTicketChosen()) {
      alert('Please select at least one ticket.');
      return;
    }
  
    if (activeStep === 1 && !selectedDate) {
      alert('Please select a date.');
      return;
    }
  
    if (activeStep === steps.length - 1) {
      confirmBooking();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const calculateTotalPrice = () => {
    if (!museum) return 0; 
  
    let total = 0;
    for (const [category, count] of Object.entries(ticketCounts)) {
      total += (museum.ticketInfo[category] || 0) * count;
    }
    return total;
  };

  const renderStepContent = (stepIndex) => {

    if (!museum) { 
      return <CircularProgress />;
    }
    switch (stepIndex) {
      case 0:
        const totalPrice = calculateTotalPrice();
        return (
          <Grid container spacing={2}>
            {Object.keys(ticketCounts).map((category) => (
              <Grid item xs={12} sm={6} key={category}>
                <TextField
                  label={`${category.charAt(0).toUpperCase() + category.slice(1)} Tickets`}
                  type="number"
                  value={ticketCounts[category]}
                  onChange={(e) => handleTicketCountChange(category, parseInt(e.target.value))}
                  InputProps={{ inputProps: { min: 0 } }} 
                  fullWidth
                />
                <Typography variant="body2" gutterBottom>
                  Price for {category}: {museum.currency} {(museum.ticketInfo[category] || 0) * ticketCounts[category]}
                </Typography>
              </Grid>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, mx: 2 }}>
              <Typography variant="h6">
                Total Price: {museum.currency} {totalPrice}
              </Typography>
              <Tooltip
                title={
                  <React.Fragment>
                    {Object.keys(ticketCounts).map(category => (
                      <Typography key={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}: {museum.currency} {museum.ticketInfo[category] || 0} each
                      </Typography>
                    ))}
                  </React.Fragment>
                }
                arrow
              >
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        );
      case 1:
        return (
          <div>
            <DatePicker
              inline
              selected={selectedDate}
              onSelect={handleDateSelect}
              showMonthDropdown
              showYearDropdown
              dropdownMode='select'
              includeDates={museum?.openDays}
              minDate={new Date()}
              locale="en-GB"
            />
          </div>
        );
      case 2:
        return (
          <div>
            {showTimeSlots && showTimeSlots
              .filter(isSlotAvailable)
              .map(({ time, limit, booked }) => (
                <Button
                  key={time}
                  variant={selectedTimeSlot === time ? "contained" : "outlined"}
                  onClick={() => handleTimeSlotSelect(time)}
                  style={{ marginRight: '10px', marginBottom: '10px' }}
                >
                  {new Date(time).toLocaleTimeString()} - Available: {limit - booked}
                </Button>
              ))
            }
            <div style={{ marginTop: '20px' }}>
              <FormControlLabel
                control={<Checkbox checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />}
                label="Send the PDF ticket by email"
              />
            </div>
          </div>
        );
        case 3:
          const totalPriceSummary = calculateTotalPrice();
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Booking Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6"><strong>Museum:</strong> {museum.name}</Typography>
              <Typography variant="h6"><strong>Date:</strong> {selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'}</Typography>
              <Typography variant="h6"><strong>Time:</strong> {selectedTimeSlot ? new Date(selectedTimeSlot).toLocaleTimeString() : 'Not selected'}</Typography>
              <Typography variant="h6"><strong>Address:</strong> {museum.address}</Typography>
              <Divider sx={{ my: 2 }} />
              {Object.keys(ticketCounts).filter(category => ticketCounts[category] > 0).map((category) => (
                <Typography key={category} variant="h6">
                  <strong>{`${category.charAt(0).toUpperCase() + category.slice(1)} Tickets:`}</strong> {ticketCounts[category]} x {museum.currency} {museum.ticketInfo[category] || 0}
                </Typography>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" sx={{ mt: 2 }}><strong>Total Price:</strong> {museum.currency} {totalPriceSummary.toFixed(2)}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>Please be on time to your booking.</Typography>
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
            <styles.StyledStepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </styles.StyledStepper>
            <div>
              {activeStep === steps.length ? (
                <Typography>All steps completed - booking is being confirmed.</Typography>
              ) : (
                <div>
                  {renderStepContent(activeStep)}
                  <styles.StyledFormBox>
                    {activeStep === 0 ? (
                      <Button
                        color="inherit"
                        onClick={() => navigate(`/tourist-museum/${id}`)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                        Back
                      </Button>
                    )}
                    <styles.StyledButtonBox />
                    <Button onClick={handleNext}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </styles.StyledFormBox>
                </div>
              )}
            </div>
          </styles.StyledPaper>
        </styles.StyledContainer>
      </styles.StyledBox>
    </ThemeProvider>
  );
};

export default TouristBooking;
