import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AdminAppBar from '../../components/appBars/AdminAppBar';
import Footer from '../../components/footer/Footer';
import CityIDTable from '../../components/tables/CityIDTable';
import AdminCityListStyles from '../../styles/AdminCityListStyles';
import { Container } from '@mui/system';
import { createTheme, ThemeProvider, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const AdminCityList = () => {
    const [cityIDs, setCityIDs] = useState([]);

    const theme = createTheme({
        palette: {
          primary: {
            main: '#123456',
          },
        },
    });

    useEffect(() => {
        const fetchCityIDs = async () => {
            console.log("Fetching city IDs from Firestore");
            const cityIDsSnapshot = await getDocs(collection(firestore, "cityIDs"));
            const cityIDsData = await Promise.all(cityIDsSnapshot.docs.map(async doc => {
                const id = doc.id;
                const data = doc.data();
                
                const registrarsQuery = query(collection(firestore, "cityRegistrars"), where("cityID", "==", data.id));
                const registrarsSnapshot = await getDocs(registrarsQuery);
                let registrarDetails = {};
        
                if (!registrarsSnapshot.empty) {
                    registrarDetails = registrarsSnapshot.docs[0].data();
                }
        
                console.log(`Fetched city ID: ${id} with data:`, data, "and registrar details:", registrarDetails);
        
                return {
                    docID: id,
                    ...data,
                    countryName: registrarDetails.countryName || 'N/A'
                };
            }));
        
            setCityIDs(cityIDsData);
        };            

        fetchCityIDs();
    }, []);

    const handleGenerateCityID = async () => {
        console.log("Generating new city ID");
        const newCityIDValue = uuidv4();
        const newCityID = { id: newCityIDValue, assigned: false };

        try {
            await addDoc(collection(firestore, "cityIDs"), {
                id: newCityID.id,
                assigned: newCityID.assigned
            });
            console.log(`New city ID generated and added to Firestore: ${newCityID.id}`);
            setCityIDs(prevIDs => [...prevIDs, newCityID]);
        } catch (error) {
            console.error("Error generating city ID:", error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box style={AdminCityListStyles.background}>
                <AdminAppBar />
                <Box sx={{ margin: 4 }}>
                    <Container>
                        <Typography variant="h4" gutterBottom sx={{ ml: 3}}>
                            City Management
                        <Tooltip title={<Typography sx={{ fontSize: '0.9rem' }}>Click on rows to ADD/EDIT city accounts!</Typography>}>
                            <InfoIcon/>
                        </Tooltip>
                        </Typography>
                        <Button variant="contained" onClick={handleGenerateCityID} sx={{ marginBottom: 2, backgroundColor: "#123456", ml: 3 }}>
                            Generate City ID
                        </Button>
                        <CityIDTable cityIDs={cityIDs} />
                    </Container>
                </Box>
                <Footer />
            </Box>
        </ThemeProvider>
    );
};

export default AdminCityList;
