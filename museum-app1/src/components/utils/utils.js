import React, { Suspense } from 'react';
import { differenceInYears } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import L from 'leaflet';
import { Button } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import locationIcon from '../../assets/location_icon.png';

// validation utils used in Login.js and Registration.js:
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };
  
export const validatePassword = (password) => {
    return password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[~!@#$%^&*()_+=\-}{[\]\\|\/?.>,<;:'"]/.test(password);
};  

export const capitalizeName = (name) => {
    return name.split(' ').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
};

export const isFieldEmpty = (value) => !value.trim();

export const isAtLeast18YearsOld = (dateOfBirth) => {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    const age = differenceInYears(today, dob);
    return age >= 18;
};

export const validateLoginEmail = (email) => {
    if (email.trim() === "") return "Email cannot be empty.";
    const re = /\S+@\S+\.\S+/;
    return re.test(email) ? "" : "Please enter a valid email address.";
};

export const validateLoginPassword = (password) => {
    if (password.trim() === "") return "Password cannot be empty.";
    return password.length >= 6 ? "" : "Password must be at least 6 characters long.";
};
  
// Validations used in TouristMuseumDetail.js:
export const geocodeAddressInReact = async (address) => {
    try {
      const response = await fetch('http://localhost:3001/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
  
      if (response.ok) {
        const coords = await response.json();
        return coords;
      } else {
        console.error('Geocoding failed');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
};

export const formatTimestamp = (timestamp) => {
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-GB');
};
  
export const parseDateString = (dateString) => {
    if (typeof dateString !== 'string') {
      console.error('parseDateString called with a non-string value:', dateString);
      return new Date();
    }
    const parts = dateString.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
};


// MuseumDetails-TouristMuseumDetails

/**
 * Fetches museum data from Firestore by ID.
 * @param {firebase.firestore.Firestore} firestore - Firestore instance.
 * @param {string} id - Museum document ID.
 * @returns {Promise<Object>} - A promise that resolves to the museum data.
 */
export const fetchMuseum = async (firestore, id) => {
  const docRef = doc(firestore, 'museums', id);
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return { success: true, data: docSnapshot.data() };
    } else {
      return { success: false, message: 'No such museum!' };
    }
  } catch (error) {
    return { success: false, message: 'Error fetching museum: ' + error.message };
  }
};

/**
 * Creates a custom Leaflet icon.
 * @returns {L.Icon} Leaflet Icon instance
 */
export const createCustomIcon = () => {
  return new L.Icon({
      iconUrl: locationIcon,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [-3, -76]
  });
};

/**
 * Lazily loads an image with a fallback during loading.
 * @param {Object} props The properties passed to the lazy image component.
 * @param {string} props.src The source URL of the image.
 * @param {string} props.alt The alt text for the image.
 * @param {Object} props.style Additional CSS styles for the image.
 */
export const LazyImage = ({ src, alt, style }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <img src={src} alt={alt} style={style} loading="lazy" />
  </Suspense>
);

/**
 * A reusable upload button for file inputs.
 * @param {Object} props - The props object.
 * @param {string} props.label - The button label.
 * @param {Function} props.onUpload - Callback function triggered on file selection.
 */
export const UploadButton = ({ label, onUpload }) => (
  <Button
    variant="contained"
    component="label"
    startIcon={<AddAPhotoIcon />}
    size="small"
    sx={{ ml: 1 }}
  >
    {label}
    <input type="file" hidden onChange={onUpload} />
  </Button>
);
