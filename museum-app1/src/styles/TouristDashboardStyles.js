import websiteBackground from '../assets/website_background.jpg';

const TouristDashboardStyles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundImage: `url(${websiteBackground})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    paginationContainer: {
      marginTop: 2,
      marginBottom: 2,
      display: 'flex',
      justifyContent: 'center',
    },
};

export default TouristDashboardStyles;