import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { Button, ButtonGroup, Box, Tooltip, IconButton, createTheme, ThemeProvider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const BusyDaysDiagram = () => {
  const { id } = useParams();
  const [view, setView] = useState('Overall View'); 
  const [busyDaysData, setBusyDaysData] = useState([]);
  const [slotsData, setSlotsData] = useState([]); 

  const theme = createTheme({
    palette: {
      primary: {
        main: '#123456',
      },
    },
  });

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsRef = collection(firestore, "bookings");
      const q = query(bookingsRef, where("museumId", "==", id));
      const querySnapshot = await getDocs(q);
      const weekDaysCount = { "Monday": 0, "Tuesday": 0, "Wednesday": 0, "Thursday": 0, "Friday": 0, "Saturday": 0, "Sunday": 0 };
      const weekDaysSlots = { ...weekDaysCount }; 

      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        const bookingDate = new Date(booking.date.seconds * 1000);
        const dayOfWeek = bookingDate.toLocaleDateString('en-US', { weekday: 'long' });
        weekDaysCount[dayOfWeek]++;

        const totalSlots = parseInt(booking.tickets.adult) + parseInt(booking.tickets.senior) +
        parseInt(booking.tickets.student) + parseInt(booking.tickets.minor);

        console.log(`Adding ${totalSlots} slots for ${dayOfWeek}`, booking);

        weekDaysSlots[dayOfWeek] += totalSlots;
      });

      const overallChartData = Object.keys(weekDaysCount).map(day => ({
        name: day,
        Bookings: weekDaysCount[day]
      }));

      const slotsChartData = Object.keys(weekDaysSlots).map(day => ({
        name: day,
        Slots: weekDaysSlots[day]
      }));

      setBusyDaysData(overallChartData);
      setSlotsData(slotsChartData);
    };

    fetchBookings();
  }, [id]);

  const chartData = view === 'Overall View' ? busyDaysData : slotsData;
  const dataKey = view === 'Overall View' ? "Bookings" : "Slots";

  const descriptions  = {
    'Overall View': 'This chart shows the total number of bookings for each day of the week, providing an overall view of the busiest days.',
    'Slots View': 'This chart illustrates the total number of slots booked for each day of the week, offering insight into the distribution of visitor volume.'
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box mb={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ButtonGroup variant="contained" data-testid="view-buttons">
            <Button onClick={() => setView('Overall View')}
                    variant={view === 'Overall View' ? 'contained' : 'outlined'}
                    data-testid="overall-view-button">
              Overall View
            </Button>
            <Button onClick={() => setView('Slots View')}
                    variant={view === 'Slots View' ? 'contained' : 'outlined'}
                    data-testid="slots-view-button">
              Slots View
            </Button>
          </ButtonGroup>
          <Tooltip title={descriptions[view]} placement="top" arrow>
            <IconButton data-testid="info-icon">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <ResponsiveContainer width="100%" height={300} data-testid="chart-container">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <ChartTooltip />
            <Bar dataKey={dataKey} fill="#DD1439" />
          </BarChart>
        </ResponsiveContainer>
      </ThemeProvider>
    </>
  );
};

export default BusyDaysDiagram;
