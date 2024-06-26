import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import QRCode from 'qrcode.react';
import { Typography, Paper, Grid, CircularProgress, Box, Container } from '@mui/material';
import TouristAppBar from '../../components/appBars/TouristAppBar';
import Footer from '../../components/footer/Footer';
import { TicketDetailsStyles } from '../../styles/TicketDetailsStyles';
import thesisIcon from '../../assets/thesis_icon1.png';
import { format } from 'date-fns';

const TicketDetails = () => {
    const [booking, setBooking] = useState(null);
    const { bookingId } = useParams();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            const bookingRef = doc(firestore, "bookings", bookingId);
            const bookingSnap = await getDoc(bookingRef);

            if (bookingSnap.exists()) {
                setBooking({ id: bookingSnap.id, ...bookingSnap.data() });
            } else {
                console.log("No such booking found!");
            }
        };

        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    if (!booking) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const timeSlotFormatted = format(new Date(booking.timeSlot), 'HH:mm');
    
    const qrCodeValue = JSON.stringify({
        museumName: booking.museumName,
        date: new Date(booking.date.seconds * 1000).toLocaleDateString(),
        time: timeSlotFormatted,
    });


    return (
        <div style={TicketDetailsStyles.backgroundStyle}>
            <TouristAppBar
                showSearchBar={false}
                showBookingsIcon={false}
            />
            <Container sx={TicketDetailsStyles.mainContainer}>
                <Paper elevation={6} sx={TicketDetailsStyles.paperStyle}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={TicketDetailsStyles.centerContent}>
                            <img src={thesisIcon} alt="Museum Logo" style={TicketDetailsStyles.logoStyle} />
                        </Grid>
                        <Grid item xs={12} sx={TicketDetailsStyles.centerContent}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Ticket Details
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom><strong>Museum:</strong> {booking.museumName}</Typography>
                            <Typography variant="subtitle1" gutterBottom><strong>Date:</strong> {booking.date ? new Date(booking.date.seconds * 1000).toLocaleDateString() : 'N/A'}</Typography>
                            <Typography variant="subtitle1" gutterBottom><strong>Time:</strong> {timeSlotFormatted}</Typography>
                            <Box sx={TicketDetailsStyles.qrCodeBox}>
                                <QRCode value={qrCodeValue} />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <Footer />
        </div>
    );
};

export default TicketDetails;
