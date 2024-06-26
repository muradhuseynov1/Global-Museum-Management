import React, { useState, useEffect } from 'react';
import { firestore } from '../../firebase';
import { createUserWithEmailAndPassword, getAuth, updateEmail } from 'firebase/auth';
import { doc, updateDoc, query, collection, getDocs, where, setDoc, getDoc } from 'firebase/firestore';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getData } from 'country-list';
import { validateEmail, capitalizeName, isAtLeast18YearsOld } from '../../components/utils/utils';

dayjs.extend(customParseFormat);

const CityEditDialog = ({ open, onClose, cityDetails }) => {
    const [editedCity, setEditedCity] = useState({
        cityName: '',
        countryName: '',
        dateOfBirth: dayjs(),
        email: '',
        name: '',
        surname: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const countries = getData().map(({ code, name }) => ({
        code: code,
        name: name
    }));

    useEffect(() => {
        if (cityDetails) {
            setEditedCity({
                docID: cityDetails.docID || '',
                cityID: cityDetails.cityID || '',
                cityName: cityDetails.cityName || '',
                countryName: cityDetails.countryName || '',
                dateOfBirth: cityDetails.dateOfBirth ? dayjs(cityDetails.dateOfBirth, "MM/DD/YYYY") : dayjs(),
                email: cityDetails.email || '',
                name: cityDetails.name || '',
                surname: cityDetails.surname || ''
            });
        }
    }, [cityDetails]);

    const validateForm = () => {
        const errors = {};
    
        if (!editedCity.cityName) errors.cityName = "This field cannot be empty";
        if (!editedCity.countryName) errors.countryName = "Please select a country";
        if (!editedCity.name) errors.name = "This field cannot be empty";
        if (!editedCity.surname) errors.surname = "This field cannot be empty";
        if (!editedCity.email) {
          errors.email = "This field cannot be empty";
        } else if (!validateEmail(editedCity.email)) {
          errors.email = "Please enter a valid email address";
        }
        if (!editedCity.dateOfBirth) {
          errors.dateOfBirth = "Please enter a complete date of birth";
        } else if (!isAtLeast18YearsOld(editedCity.dateOfBirth)) {
          errors.dateOfBirth = "Tourist must be at least 18 years old";
        }
    
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const handleDateChange = (newDate) => {
        setEditedCity(prev => ({ ...prev, dateOfBirth: newDate }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCity(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!editedCity.docID || !editedCity.cityID) {
            console.error("Document ID or City ID is undefined, cannot update.");
            alert("Document ID or City ID is undefined, update cannot proceed.");
            return;
        }

        if(!validateForm()) return;
    
        const auth = getAuth();
        const cityIDDocRef = doc(firestore, "cityIDs", editedCity.docID);
    
        
        const cityIDDocSnap = await getDoc(cityIDDocRef);
        const cityData = cityIDDocSnap.data();
    
        if (!cityIDDocSnap.exists()) {
            alert("City ID document does not exist.");
            return;
        }
    
        if (!cityData.assigned) {
           
            const cityNameQuery = query(collection(firestore, "cityRegistrars"), where("cityName", "==", editedCity.cityName));
            const emailQuery = query(collection(firestore, "cityRegistrars"), where("email", "==", editedCity.email));
    
            const [cityNameSnapshot, emailSnapshot] = await Promise.all([
                getDocs(cityNameQuery),
                getDocs(emailQuery)
            ]);
    
            if (!cityNameSnapshot.empty && cityNameSnapshot.docs[0].id !== editedCity.docID) {
                alert("City Name already registered.");
                return;
            }
    
            if (!emailSnapshot.empty && emailSnapshot.docs[0].id !== editedCity.docID) {
                alert("Email already in use.");
                return;
            }
        }
    
        try {
            const cityUpdate = {
                cityName: editedCity.cityName,
                assigned: true
            };
    
            const registrarUpdate = {
                cityName: editedCity.cityName,
                countryName: editedCity.countryName,
                dateOfBirth: editedCity.dateOfBirth.format("MM/DD/YYYY"),
                email: editedCity.email,
                name: editedCity.name,
                surname: editedCity.surname,
                cityID: editedCity.cityID
            };
    
            await updateDoc(cityIDDocRef, cityUpdate);
    
            const registrarsQuery = query(collection(firestore, "cityRegistrars"), where("cityID", "==", editedCity.cityID));
            const registrarsSnapshot = await getDocs(registrarsQuery);
    
            if (!registrarsSnapshot.empty) {
                const registrarDocRef = registrarsSnapshot.docs[0].ref;
                await updateDoc(registrarDocRef, registrarUpdate);
            } else {
                
                const userCredential = await createUserWithEmailAndPassword(auth, editedCity.email, 'defaultPassword');
                const userUid = userCredential.user.uid; 
                const newRegistrarRef = doc(firestore, "cityRegistrars", userUid);
                await setDoc(newRegistrarRef, registrarUpdate);
            }
    
            alert("City details updated successfully.");
            onClose();
        } catch (error) {
            console.error("Error updating city details:", error);
            alert("Failed to update city details. " + error.message);
        }
    };      

    return (
        <Dialog open={open} onClose={onClose} data-testid="city-edit-dialog">
            <DialogTitle>Edit City and Registrar Details</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="City Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="cityName"
                    value={editedCity.cityName}
                    onChange={handleChange}
                    data-testid="cityName"
                    error={!!formErrors.cityName}
                    helperText={formErrors.cityName}
                    
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                        labelId="country-label"
                        name="countryName"
                        value={editedCity.countryName}
                        onChange={handleChange}
                        data-testid="countryName"
                        title="Country Name"
                        error={!!formErrors.countryName}
                        helperText={formErrors.countryName}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {countries.map((country) => (
                            <MenuItem key={country.code} value={country.name}>
                                {country.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {formErrors.countryName && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {formErrors.countryName}
                        </Typography>
                    )}
                </FormControl>
                <TextField
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="name"
                    value={editedCity.name}
                    onChange={handleChange}
                    data-testid="name"
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                />
                <TextField
                    margin="dense"
                    label="Surname"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="surname"
                    value={editedCity.surname}
                    onChange={handleChange}
                    data-testid="surname"
                    error={!!formErrors.surname}
                    helperText={formErrors.surname}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    name="email"
                    value={editedCity.email}
                    onChange={handleChange}
                    data-testid="email"
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Date of Birth"
                        value={editedCity.dateOfBirth}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                fullWidth 
                                required 
                                data-testid="dateOfBirth" 
                                error={!!formErrors.dateOfBirth}
                                helperText={formErrors.dateOfBirth}
                            />
                            )}
                        inputFormat="MM/DD/YYYY"
                        sx={{mt: 1}}
                    />
                </LocalizationProvider>
                {formErrors.dateOfBirth && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {formErrors.dateOfBirth}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} data-testid="cancel-button">Cancel</Button>
                <Button onClick={handleUpdate} data-testid="update-button">Update</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CityEditDialog;
