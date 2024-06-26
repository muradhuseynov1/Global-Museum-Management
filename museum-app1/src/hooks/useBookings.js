import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const useBookings = (auth, firestore, initialSortConfig = { key: 'date', direction: 'descending' }) => {
  const [bookings, setBookings] = useState([]);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState(initialSortConfig);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchBookings(user.uid);
      } else {
        navigate('/');
      }
    });

    async function fetchBookings(userId) {
      const bookingsRef = collection(firestore, "bookings");
      const q = query(bookingsRef, where("touristId", "==", userId));
      const snapshot = await getDocs(q);
      const fetchedBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(fetchedBookings);
    }

    return () => unsubscribe();
  }, [auth, firestore, navigate]);

  const sortedBookings = useMemo(() => {
    let sortableBookings = [...bookings];
    if (sortConfig.key !== null) {
      sortableBookings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBookings;
  }, [bookings, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleBookingClick = (bookingId) => {
    navigate(`/ticket/${bookingId}`);
    setIsBookingDialogOpen(false);
  };

  return {
    bookings: sortedBookings,
    isBookingDialogOpen,
    toggleBookingDialog: () => setIsBookingDialogOpen(!isBookingDialogOpen),
    handleBookingClick,
    requestSort,
    sortConfig
  };
};

export default useBookings;
