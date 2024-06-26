import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';
import Reauthenticate from '../utils/Reauthenticate';
import DeleteCityAccount from './DeleteCityAccount';
import DeleteTouristAccount from './DeleteTouristAccount';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'; 
import { useStyles } from '../../styles/UpdateProfileStyles';
import ReauthenticationDialog from '../dialogs/ReauthenticationDialog';

const UpdateProfile = ({ userType }) => {
    const { classes } = useStyles();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    const collectionName = userType === 'city' ? 'cityRegistrars' : 'tourists';

    const [openDialog, setOpenDialog] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');

    useEffect(() => {
        console.log("User Type:", userType);  
        console.log("Collection Name:", collectionName);  
        const fetchProfileData = async () => {
            try {
                const userDocRef = doc(firestore, collectionName, userId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    let data = userDoc.data();
                    if (data.dateOfBirth) {
                        data.dateOfBirth = dayjs(data.dateOfBirth);
                    }
                    setFormData(data);
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error getting document:', error);
            }
        };

        console.log("Effect running for userId:", userId);
        fetchProfileData();
    }, [userId, collectionName, userType]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (newValue) => {
        setFormData(prev => ({ ...prev, dateOfBirth: newValue }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
            ...formData,
            dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.format('MM/DD/YYYY') : null
        };
        try {
            await updateDoc(doc(firestore, collectionName, userId), updatedData);
            alert('Profile updated successfully');
            if(userType === 'city') {
                navigate('/city-dashboard');
            }
            else if(userType === 'tourist') {
                navigate('/tourist-dashboard');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await Reauthenticate(currentPassword); 
            console.log('Reauthentication successful, proceed with account deletion.');
            if (userType === 'city') {
                const deletionSuccess = await DeleteCityAccount(auth.currentUser.uid);
                if (deletionSuccess) {
                    alert('Account and all related data have been deleted successfully.');
                    navigate('/');
                } else {
                    throw new Error('Failed to delete account properly.');
                }
            } else if (userType === 'tourist') {
                const deletionSuccess = await DeleteTouristAccount(auth.currentUser.uid);
                if (deletionSuccess) {
                    alert('Account and all related data have been deleted successfully.');
                    navigate('/');
                } else {
                    throw new Error('Failed to delete account properly.');
                }
            }
        } catch (error) {
            alert('Reauthentication failed: ' + error.message);
            console.error('Deletion failed:', error);
        }
    };

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    return (
        <>
            <Box className={classes.mainContainer}>
                <Box component="form" onSubmit={handleFormSubmit} className={classes.formContainer}>
                    <Typography variant="h5" className={classes.title}>
                        Update Profile
                    </Typography>
                    {/* Profile Update Fields */}
                    <TextField
                        label="Name"
                        type="text"
                        name="name"
                        id="name-input"
                        data-testid="name-input"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        className={classes.inputField}
                    />
                    <TextField
                        label="Surname"
                        type="text"
                        name="surname"
                        id="surname-input"
                        data-testid="surname-input"
                        value={formData.surname || ""}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        className={classes.inputField}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        id="email-input"
                        data-testid="email-input"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        disabled
                        className={classes.inputField}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date of Birth"
                            value={formData.dateOfBirth}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} id="dob-input" fullWidth required className={classes.inputField} />}
                        />
                    </LocalizationProvider>

                    <Box sx={{ width: '100%', mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="submit" variant="contained" id="update-button" className={classes.actionButton} >
                            Update Profile
                        </Button>
                        {/* Delete Account Button */}
                        <Button variant="contained" color="error" onClick={handleOpenDialog} id="delete-button" className={classes.deleteButton} >
                            Delete Account
                        </Button>
                    </Box>
                </Box>
            </Box>
    
            {/* Confirmation Dialog */}
            <ReauthenticationDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onDelete={handleDeleteAccount}
                currentPassword={currentPassword}
                onPasswordChange={(e) => setCurrentPassword(e.target.value)}
            />
        </>
    );    
};

export default UpdateProfile;