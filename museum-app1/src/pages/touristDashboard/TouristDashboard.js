import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import countries from 'i18n-iso-countries';
import { Pagination } from '@mui/material';
import '../../styles/TouristDashboard.css';
import BookingDialog from '../../components/dialogs/BookingDialog';
import TouristAppBar from '../../components/appBars/TouristAppBar';
import CountryGrid from '../../components/grids/CountryGrid';
import Footer from '../../components/footer/Footer';
import TouristDashboardStyles from '../../styles/TouristDashboardStyles';
import useBookings from '../../hooks/useBookings';

const TouristDashboard = () => {
    const [countriesWithCities, setCountriesWithCities] = useState([]);
    const [touristUserId, setTouristUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [userName, setUserName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [countriesPerPage] = useState(20);
    const {
        bookings: sortedBookings,
        isBookingDialogOpen,
        toggleBookingDialog,
        handleBookingClick,
        requestSort,
        sortConfig
    } = useBookings(auth, firestore);

    countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

    const getCountryCode = (countryName) => {
        return countries.getAlpha2Code(countryName, 'en');
    };

    const fetchCountriesWithCities = async () => {
        const cityRegistrarsRef = collection(firestore, "cityRegistrars");
        const q = query(cityRegistrarsRef, where("countryName", "!=", null));
        const snapshot = await getDocs(q);
        
        const fetchedCountries = snapshot.docs.map(doc => doc.data().countryName);
        setCountriesWithCities([...new Set(fetchedCountries)]);
    };     

    const fetchUserName = async (userId) => {
        const userDocRef = doc(firestore, "tourists", userId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            setUserName(docSnap.data().name);
        } else {
            console.log("No such document!");
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setTouristUserId(user.uid); 
                fetchUserName(user.uid);
            } else {
                console.error("User not logged in!");
            }
        });

        fetchCountriesWithCities();
        return unsubscribe;
    }, []);   

    const filteredCountries = countriesWithCities.filter(country =>
        country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);
    const indexOfLastCountry = currentPage * countriesPerPage;
    const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
    const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div style={TouristDashboardStyles.root} data-testid="tourist-dashboard">
            <TouristAppBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            toggleBookingDialog={toggleBookingDialog}
            showSearchBar={true}
            showBookingsIcon={true}
            />

            <Container>
                <Typography variant="h5" sx={{ mt: 4, mb: 2 }} data-testid="welcome-message">Welcome to Tourist Dashboard, {userName}</Typography>
                <h3>Countries with registered cities:</h3>
                <CountryGrid countries={currentCountries} getCountryCode={getCountryCode} data-testid="country-grid" />
                <Pagination 
                    count={totalPages} 
                    page={currentPage} 
                    onChange={handleChangePage} 
                    color="primary" 
                    showFirstButton 
                    showLastButton 
                    sx={TouristDashboardStyles.paginationContainer}
                    data-testid="pagination"
                />

                <BookingDialog
                    bookings={sortedBookings}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    isBookingDialogOpen={isBookingDialogOpen}
                    toggleBookingDialog={toggleBookingDialog}
                    handleBookingClick={handleBookingClick}
                />
            </Container>
            <Footer />
        </div>
    );
};

export default TouristDashboard;