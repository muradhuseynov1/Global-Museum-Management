import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { geocodeAddressInReact } from '../components/utils/utils';

const useMuseumDetails = (id) => {
  const [museum, setMuseum] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [summaryImages, setSummaryImages] = useState([]);
  const [historyImages, setHistoryImages] = useState([]);
  const [geocodedCoords, setGeocodedCoords] = useState(null);
  const [isGeocodingComplete, setIsGeocodingComplete] = useState(false);

  useEffect(() => {
    const fetchMuseum = async () => {
      try {
        const docRef = doc(firestore, 'museums', id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setMuseum(data);
          setIsGeocodingComplete(false);
          setCarouselImages(data.carouselImages || []);
          setSummaryImages(data.summaryImages || []);
          setHistoryImages(data.historyImages || []);

          geocodeAddressInReact(data.address).then(coords => {
            if (coords) {
              setGeocodedCoords(coords); 
              setIsGeocodingComplete(true);
            }
          });
        } else {
          console.error('No such museum!');
        }
      } catch (error) {
        console.error('Error fetching museum: ', error);
      }
    };

    fetchMuseum();
  }, [id]);

  return {
    museum,
    carouselImages,
    summaryImages,
    historyImages,
    geocodedCoords,
    isGeocodingComplete,
    setMuseum,
    setCarouselImages,
    setSummaryImages,
    setHistoryImages
  };
};

export default useMuseumDetails;
