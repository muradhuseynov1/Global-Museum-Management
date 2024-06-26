import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RouterComponent from './router/Router';
import reportWebVitals from './reportWebVitals';
import CityProvider from './contexts/CityContext';
import { createRoot } from 'react-dom/client';
import favicon from './assets/thesis_icon1.png';

const setFavicon = (icon) => {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = icon;
}

setFavicon(favicon);

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CityProvider>
      <RouterComponent />
    </CityProvider>
  </React.StrictMode>
);

reportWebVitals();