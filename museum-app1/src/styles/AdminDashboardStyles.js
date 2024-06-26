import websiteBackground from '../assets/website_background.jpg';

const AdminDashboardStyles = {
    dashboardBackground: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: `url(${websiteBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
};

export default AdminDashboardStyles;
