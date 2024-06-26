import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore, storage } from '../../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Container, Typography, Box, CircularProgress, IconButton, createTheme, ThemeProvider } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../styles/MuseumDetail.css';
import 'leaflet/dist/leaflet.css';
import MuseumContactInfo from '../../components/visuals/MuseumContactInfo';
import useMuseumDetails from '../../hooks/useMuseumDetails';
import { createCustomIcon, UploadButton } from '../../components/utils/utils';
import CityAppBar from '../../components/appBars/CityAppBar';
import CustomCarousel from '../../components/visuals/CustomCarousel';
import SectionWithVisualsCity from '../../components/visuals/SectionWithVisualsCity';
import Footer from '../../components/footer/Footer';
import MuseumDetailstyles from '../../styles/MuseumDetailStyles';

const MuseumDetails = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const { museum, carouselImages, 
    summaryImages, historyImages, 
    isGeocodingComplete, geocodedCoords,
    setCarouselImages, setSummaryImages,
    setHistoryImages
  
  } = useMuseumDetails(id);

  const sections = museum ? [
    { title: "Summary", content: museum.summary, visuals: summaryImages, sectionKey: "summary" },
    { title: "History", content: museum.history, visuals: historyImages, sectionKey: "history" }
  ] : [];

  const theme = createTheme({
    palette: {
      primary: {
        main: '#123456',
      },
    },
  });

  const customIcon = createCustomIcon();

  const uploadImage = async (targetSection, imageFile) => {
    if (!imageFile) return;
  
    const imageRef = ref(storage, `museums/${id}/${targetSection}/${imageFile.name}`);
    try {
        const snapshot = await uploadBytes(imageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const newState = {
            carousel: () => setCarouselImages(prev => [...prev, downloadURL]),
            summary: () => setSummaryImages(prev => [...prev, downloadURL]),
            history: () => setHistoryImages(prev => [...prev, downloadURL])
        };
  
        newState[targetSection]();
  
        const docRef = doc(firestore, 'museums', id);
        await updateDoc(docRef, {
            [`${targetSection}Images`]: arrayUnion(downloadURL)
        });
  
    } catch (error) {
        console.error("Error uploading image: ", error);
    }
  };  

  const deleteImage = async (imageUrl, section) => {
    console.log("Delete button clicked for:", imageUrl, "in", section);
    const imageRef = ref(storage, imageUrl);
  
    try {
      await deleteObject(imageRef);
  
      const newState = {
          carousel: setCarouselImages,
          summary: setSummaryImages,
          history: setHistoryImages
      };
  
      if(newState[section]) {
        newState[section](prev => prev.filter(url => url !== imageUrl));
      }
  
      const docRef = doc(firestore, 'museums', id);
      await updateDoc(docRef, {
          [`${section}Images`]: arrayRemove(imageUrl)
      });
    } catch (error) {
      console.error('Error removing image: ', error);
    }
  };  

  const renderImageDeleteButtons = () => {
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {images.map((image, index) => (
          <IconButton key={index} onClick={() => deleteImage(image)} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        ))}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={MuseumDetailstyles.PageBackground}>
        <CityAppBar
          currentUser={currentUser}
          showSearchBar={false}
        />

        <Container maxWidth="false" disableGutters={true}>
          {!museum ? (
            <CircularProgress />
          ) : (
            <>
              <CustomCarousel
                images={carouselImages}
                onDelete={(image) => deleteImage(image, 'carousel')}
                emptyMessage="The Carousel is empty. Click on 'UPLOAD CAROUSEL IMAGE' button to upload images!"
              />
              {renderImageDeleteButtons()}
              <Container maxWidth="lg" sx={{ mt: 5, mb: 4 }}>
                <Typography variant="h3" sx={{ mt: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  {museum.name}
                  <UploadButton label="Upload Carousel Image" onUpload={(e) => uploadImage('carousel', e.target.files[0])} />
                </Typography>
              </Container>
              <SectionWithVisualsCity 
                sections={sections} 
                uploadImage={uploadImage} 
                deleteImage={deleteImage} 
              />

              <MuseumContactInfo museum={museum} isGeocodingComplete={isGeocodingComplete} geocodedCoords={geocodedCoords} customIcon={customIcon} />
            </>
          )}
        </Container>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default MuseumDetails;
