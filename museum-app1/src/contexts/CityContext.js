import React, { createContext, useState, useEffect } from 'react';
import { firestore, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';

export const CityContext = createContext();

const CityProvider = ({ children }) => {
    const [cityID, setCityID] = useState(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const fetchCityID = async () => {
        try {
            if (currentUser) {
                console.log("Current user UID:", currentUser.uid);
                const userDocRef = doc(firestore, 'cityRegistrars', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
    
                if (userDoc.exists()) {
                    console.log("Fetched cityID:", userDoc.data().cityID);
                    setCityID(userDoc.data().cityID);
                } else {
                    console.error("User document not found!");
                }
            } else {
                console.error("No user is logged in.");
            }
        } catch (error) {
            console.error("Error fetching cityID:", error);
        } finally {
            setLoading(false);
        }
    };    

    useEffect(() => {
        fetchCityID();
    }, [currentUser]);

    return (
        <CityContext.Provider value={{ cityID, loading }}>
            {children}
        </CityContext.Provider>
    );
};

export default CityProvider;
