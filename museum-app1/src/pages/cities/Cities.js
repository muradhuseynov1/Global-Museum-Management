import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore, auth } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import '../../styles/Cities.css';
import TouristAppBar from '../../components/appBars/TouristAppBar';
import BookingDialog from '../../components/dialogs/BookingDialog';
import WeatherDialog from '../../components/dialogs/WeatherDialog';
import CityGrid from '../../components/grids/CityGrid';
import Footer from '../../components/footer/Footer';
import CitiesStyles from '../../styles/CitiesStyles';
import useBookings from '../../hooks/useBookings';

const Cities = () => {
    const { countryName } = useParams();
    const [cities, setCities] = useState([]);
    const navigate = useNavigate();
    const [cityMuseums, setCityMuseums] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [isWeatherDialogOpen, setIsWeatherDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const maxItemsPerPage = rowsPerPage * 2;
    const {
        bookings: sortedBookings,
        isBookingDialogOpen,
        toggleBookingDialog,
        handleBookingClick,
        requestSort,
        sortConfig
    } = useBookings(auth, firestore);

    useEffect(() => {
        const fetchCities = async () => {
            const cityRegistrarsRef = collection(firestore, "cityRegistrars");
            const q = query(cityRegistrarsRef, where("countryName", "==", countryName));
            const snapshot = await getDocs(q);
            
            const fetchedCities = snapshot.docs.map(doc => ({ cityName: doc.data().cityName, cityID: doc.data().cityID }));
            setCities(fetchedCities);
        };

        fetchCities();
    }, [countryName, navigate]);

    const fetchMuseumsForCity = async (cityID) => {
        setLoading(true);
        const museumsRef = collection(firestore, "museums");
        const q = query(museumsRef, where("cityID", "==", cityID));
        const museumSnapshot = await getDocs(q);

        const fetchedMuseums = museumSnapshot.docs
        .map(doc => ({ name: doc.data().name, id: doc.id }))
        .sort((a, b) => a.name.localeCompare(b.name));

        setCityMuseums(prevCityMuseums => ({ ...prevCityMuseums, [cityID]: fetchedMuseums }));
        setLoading(false);
    };

    const handleCityClick = (city) => {
        if (!cityMuseums[city.cityID]) {
            fetchMuseumsForCity(city.cityID);
        }
    };
    
    const fetchWeatherData = async (cityName) => {
        try {
            const response = await fetch('http://localhost:3001/fetch-weather', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cityName }),
            });
            if (!response.ok) throw new Error('Failed to fetch weather data');
            const data = await response.json();
            setWeatherData(data);
            setIsWeatherDialogOpen(true);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };  

    const filteredCities = cities.filter(city => 
        city.cityName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastCity = currentPage * maxItemsPerPage;
    const indexOfFirstCity = indexOfLastCity - maxItemsPerPage;
    const currentCities = filteredCities.slice(indexOfFirstCity, indexOfLastCity);

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(filteredCities.length / maxItemsPerPage);

    const closeWeatherDialog = () => {
        setWeatherData(null);
        setIsWeatherDialogOpen(false);
    };

    return (
        <div style={CitiesStyles.root}>
            <TouristAppBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            toggleBookingDialog={toggleBookingDialog}
            showSearchBar={true}
            showBookingsIcon={true}
            />

            <Container>
                <h2>Cities in {countryName}</h2>
                <CityGrid
                    cities={currentCities}
                    handleCityClick={handleCityClick}
                    fetchWeatherData={fetchWeatherData}
                    cityMuseums={cityMuseums}
                    loading={loading}
                />
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                    showFirstButton
                    showLastButton
                    sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
                />
            </Container>
    
            <BookingDialog
                bookings={sortedBookings}
                sortConfig={sortConfig}
                requestSort={requestSort}
                isBookingDialogOpen={isBookingDialogOpen}
                toggleBookingDialog={toggleBookingDialog}
                handleBookingClick={handleBookingClick}
            />
    
            <WeatherDialog
                isOpen={isWeatherDialogOpen}
                onClose={closeWeatherDialog}
                weatherData={weatherData}
            />
            <Footer />
        </div>
    );    
};

export default Cities;