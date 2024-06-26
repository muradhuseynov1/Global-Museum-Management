import websiteBackground from '../assets/website_background.jpg';

export const TicketDetailsStyles = {
    backgroundStyle: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: `url(${websiteBackground})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    mainContainer: {
        padding: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
    },
    paperStyle: {
        padding: 3,
        maxWidth: 400,
        width: '100%',
        bgcolor: '#fafafa',
        border: '1px solid #ccc',
        boxShadow: '5px 5px 20px rgba(0,0,0,0.1)',
        borderRadius: '10px'
    },
    centerContent: {
        textAlign: 'center'
    },
    logoStyle: {
        maxWidth: '80px',
        margin: '0 auto'
    },
    qrCodeBox: {
        display: 'flex',
        justifyContent: 'center',
        mt: 2
    }
};
