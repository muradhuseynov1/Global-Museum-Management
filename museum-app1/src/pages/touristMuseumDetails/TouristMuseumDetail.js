import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore, auth } from '../../firebase';
import { doc, getDoc, addDoc, collection, getDocs, where, query } from 'firebase/firestore';
import { Button, Container, CircularProgress, Typography, Grid,
  Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import '../../styles/TouristMuseumDetail.css';
import AddCommentIcon from '@mui/icons-material/AddComment';
import BusyDaysDiagram from '../../components/visuals/BusyDaysDiagram';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import CommentIcon from '@mui/icons-material/Comment';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TouristAppBar from '../../components/appBars/TouristAppBar';
import ReviewsDialog from '../../components/dialogs/ReviewsDialog';
import AddReviewDialog from '../../components/dialogs/AddReviewDialog';
import MuseumContactInfo from '../../components/visuals/MuseumContactInfo';
import styles from '../../styles/TouristMuseumDetailsStyles';
import Footer from '../../components/footer/Footer';
import { parseDateString, formatTimestamp } from '../../components/utils/utils';
import useBookings from '../../hooks/useBookings';
import BookingDialog from '../../components/dialogs/BookingDialog';
import useMuseumDetails from '../../hooks/useMuseumDetails';
import { createCustomIcon } from '../../components/utils/utils';
import CustomCarousel from '../../components/visuals/CustomCarousel';
import SectionWithVisualsTourist from '../../components/visuals/SectionWithVisualsTourist';

const TouristMuseumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const customIcon = createCustomIcon();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [sortMethod, setSortMethod] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc'); 
  const [reviews, setReviews] = useState([]);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [busyDaysDiagramOpen, setBusyDaysDiagramOpen] = useState(false);
  const [isBusyDaysDialogOpen, setIsBusyDaysDialogOpen] = useState(false);
  const {
    bookings: sortedBookings,
    isBookingDialogOpen,
    toggleBookingDialog,
    handleBookingClick,
    requestSort,
    sortConfig
  } = useBookings(auth, firestore);

  const { museum, carouselImages, 
    summaryImages, historyImages, 
    isGeocodingComplete, geocodedCoords
  } = useMuseumDetails(id);

  const sections = museum ? [
    { title: "Summary", content: museum.summary, visuals: summaryImages, sectionKey: "summary" },
    { title: "History", content: museum.history, visuals: historyImages, sectionKey: "history" }
  ] : [];

  useEffect(() => {
    fetchReviews();
  }, [id, sortMethod, sortDirection]); 

  const handleBooking = () => {
    navigate(`/booking/${id}`);
  };  

  const toggleBusyDaysDialog = () => {
    setIsBusyDaysDialogOpen(!isBusyDaysDialogOpen);
  };

  const fetchReviews = async () => {
    const reviewsRef = collection(firestore, "reviews");
    const q = query(reviewsRef, where("museumId", "==", id));
    const querySnapshot = await getDocs(q);
    let fetchedReviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
    fetchedReviews.sort((a, b) => {
      if (sortMethod === 'date') {
        const dateA = parseDateString(a.timestamp);
        const dateB = parseDateString(b.timestamp);
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      } else if (sortMethod === 'stars') {
        return (sortDirection === 'desc' ? -1 : 1) * (a.rating - b.rating);
      }
      return 0;
    });        
    
    setReviews(fetchedReviews);
  }; 

  const handleReviewDialogToggle = () => {
    setReviewDialogOpen(!reviewDialogOpen);
  };

  const submitReview = async () => {
    const userId = auth.currentUser.uid;
    let userName = 'Anonymous'; 
    const formattedDate = new Date().toLocaleDateString('en-GB'); 
    const userRef = doc(firestore, 'tourists', userId); 
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      userName = `${userSnap.data().name} ${userSnap.data().surname}`;
    }
  
    const reviewData = {
      museumId: id,
      userId: userId,
      userName: userName,
      text: reviewText,
      rating: starRating,
      timestamp: formattedDate,
    };
  
    try {
      await addDoc(collection(firestore, "reviews"), reviewData);
      setReviewDialogOpen(false);
      setReviewText("");
      setStarRating(0);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review: ", error);
    }
  };
  
  const toggleReviewsDialog = () => {
    setReviewsDialogOpen(!reviewsDialogOpen);
  };

  return (
    <div className="museum-detail" style={styles.PageBackground}>
      <TouristAppBar
      toggleBookingDialog={toggleBookingDialog}
      showSearchBar={false}
      showBookingsIcon={true}
      />

      <Container maxWidth="false" disableGutters={true}>
        {!museum ? (
          <CircularProgress />
        ) : (
          <>
            <CustomCarousel
              images={carouselImages}
              emptyMessage="The carousel is empty. Once the city registrar uploads any content, you will see it here!"
            />

            <Container maxWidth="lg" sx={{ mt: 5, mb: 4 }}>
              <Typography variant="h3" sx={{ mb: 4 }}>
                {museum.name}
              </Typography>
            </Container>

            <SectionWithVisualsTourist sections={sections} />

            <MuseumContactInfo museum={museum} isGeocodingComplete={isGeocodingComplete} geocodedCoords={geocodedCoords} customIcon={customIcon}>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" color="success" onClick={handleBooking} startIcon={<ConfirmationNumberIcon />} fullWidth>
                  Book Ticket
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" onClick={toggleReviewsDialog} startIcon={<CommentIcon />} fullWidth>
                  View Reviews
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" color="error" startIcon={<AddCommentIcon />} onClick={handleReviewDialogToggle} fullWidth>
                  Add Review
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" color="secondary" startIcon={<EqualizerIcon />} onClick={toggleBusyDaysDialog} fullWidth>
                  Busy Days
                </Button>
              </Grid>
            </Grid>
              {busyDaysDiagramOpen && <BusyDaysDiagram />}
            </MuseumContactInfo>
          </>
        )}
      </Container>

      <AddReviewDialog
        open={reviewDialogOpen}
        onClose={handleReviewDialogToggle}
        starRating={starRating}
        setStarRating={setStarRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
        submitReview={submitReview}
      />
      
      <ReviewsDialog
        open={reviewsDialogOpen}
        onClose={toggleReviewsDialog}
        reviews={reviews}
        setSortMethod={setSortMethod}
        sortMethod={sortMethod}
        setSortDirection={setSortDirection}
        sortDirection={sortDirection}
        formatTimestamp={formatTimestamp}
      />

      <BookingDialog
        bookings={sortedBookings}
        sortConfig={sortConfig}
        requestSort={requestSort}
        isBookingDialogOpen={isBookingDialogOpen}
        toggleBookingDialog={toggleBookingDialog}
        handleBookingClick={handleBookingClick}
      />

      <Dialog open={isBusyDaysDialogOpen} onClose={toggleBusyDaysDialog} fullWidth maxWidth="sm">
        <DialogTitle>Busy Days of the Week</DialogTitle>
        <DialogContent>
          <BusyDaysDiagram />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleBusyDaysDialog} 
          sx={{
              bgcolor: '#123456',
              '&:hover': {
                backgroundColor: '#36454F',
                color: '#ffffff',
              },
            }} 
            variant="contained">
              Close
          </Button>
          </DialogActions>
      </Dialog>
      <Footer />
    </div>
  );
};

export default TouristMuseumDetail;