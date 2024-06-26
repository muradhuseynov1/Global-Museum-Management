import websiteBackground from '../assets/website_background.jpg';

const styles = {
    dashboardBackground: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: `url(${websiteBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    dashboardTitle: {
        marginTop: 15,
        marginBottom: 20
    }
};

export default styles;
