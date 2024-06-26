import websiteBackground from '../assets/website_background.jpg';

const CitiesStyles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundImage: `url(${websiteBackground})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }
};

export default CitiesStyles;