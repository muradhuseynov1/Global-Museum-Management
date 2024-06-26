import { firestore, auth, storage } from '../../firebase';
import { getDocs, collection, query, where, doc, getDoc, deleteDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { onAuthStateChanged } from 'firebase/auth';
import { Container, Typography, CircularProgress } from '@mui/material';
import { ref, deleteObject } from 'firebase/storage';
import '../../styles/CityDashboard.css';
import DeleteConfirmationDialog from '../../components/dialogs/DeleteConfirmationDialog';
import CityAppBar from '../../components/appBars/CityAppBar';
import Loading from '../../components/loading/Loading';
import MuseumGrid from '../../components/grids/MuseumGrid';
import styles from '../../styles/CityDashboardStyles';
import Footer from '../../components/footer/Footer';

const CityDashboard = () => {
  const { currentUser } = useAuth();
  const [museums, setMuseums] = useState([]);
  const [cityID, setCityID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [museumToDelete, setMuseumToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [registrarName, setRegistrarName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCityID(user.uid).then(() => setLoading(false));
      } else {
        console.error("No user logged in");
      }
    });
    return () => unsubscribe();
  }, []);    

  const fetchCityID = async (userID) => {
    try {
      const userDocRef = doc(firestore, 'cityRegistrars', userID);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setCityID(userDoc.data().cityID);
        setRegistrarName(userDoc.data().name);
      } else {
        console.error("User document not found!");
      }
    } catch (error) {
      alert("Error fetching cityID:", error);
    }
  };

  useEffect(() => {
    fetchMuseums();  
  }, [cityID]); 
  
  const fetchMuseums = async () => {
    try {
      if (cityID) {  
        const q = query(
          collection(firestore, 'museums'),
          where('cityID', '==', cityID)
        );
        const querySnapshot = await getDocs(q);
        const museumsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMuseums(museumsList);
      }
    } catch (error) {
      console.error('Error fetching museums: ', error);
    }
  };

  const promptDeleteConfirmation = (museumId) => {
    console.log("Prompting delete for museum ID:", museumId);
    setMuseumToDelete(museumId);
    setDeleteConfirmationOpen(true);
  }; 

  const deleteMuseum = async () => {
    console.log("Deleting museum ID:", museumToDelete);
    try {
      const museumId = museumToDelete;
      setMuseumToDelete(null);

      const museumDocRef = doc(firestore, 'museums', museumId);
      const museumDoc = await getDoc(museumDocRef);
  
      if (museumDoc.exists()) {
        const museumData = museumDoc.data();
  
        if (museumData.museumCoverImage) {
          const imageRef = ref(storage, museumData.museumCoverImage);

          try {
            await deleteObject(imageRef);
          } catch (error) {
            alert("Error deleting image: ", error);
          }
        } else {
          alert("No museumCoverImage found.");
        }

        await deleteDoc(museumDocRef);
  
        setMuseums(museums.filter(museum => museum.id !== museumId));
        setKey(prevKey => prevKey + 1);
      } else {
        alert("Museum document not found!");
      }
    } catch (error) {
      alert('Error deleting museum: ', error);
    }
  };

  if (loading) {
    return <Loading />;
  };

  return (
    <div style={styles.dashboardBackground}>
      <CityAppBar 
        currentUser={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cityID={cityID}
      />
      <Container className="dashboardContainer">
      <Typography variant="h5" className="dashboardTitle" style={styles.dashboardTitle}>Welcome to City Dashboard, {registrarName}! </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <MuseumGrid
          museums={museums}
          searchQuery={searchQuery}
          promptDeleteConfirmation={promptDeleteConfirmation}
        />
      )}
      <DeleteConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        onDelete={() => {console.log("onDelete triggered");setDeleteConfirmationOpen(false); deleteMuseum(museumToDelete);}}
      />
      </Container>
      <Footer />
    </div>
  );
};
  
export default CityDashboard;