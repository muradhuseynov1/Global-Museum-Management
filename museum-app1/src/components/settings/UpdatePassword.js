import React, { useState } from 'react';
import { auth } from '../../firebase';
import { updatePassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useStyles } from '../../styles/UpdatePasswordStyles';

const UpdatePassword = () => {
    const { classes } = useStyles();
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
            await reauthenticateWithCredential(user, credential);

            await updatePassword(user, formData.newPassword);

            alert("Password updated successfully");
            navigate('/settings');  

        } catch (error) {
            switch (error.code) {
                case 'auth/invalid-login-credentials':
                case 'auth/wrong-password':
                    alert('The current password is incorrect.');
                    break;
                case 'auth/weak-password':
                    alert('The new password is too weak.');
                    break;
                case 'auth/too-many-requests':
                    alert('Too many failed attempts. Please wait for a while or reset your password.');
                    break;
                default:
                    console.error("Error:", error.message);
            }
        }
    };

    return (
        <Box className={classes.mainContainer}>
            <Box component="form" onSubmit={handleFormSubmit} className={classes.formContainer}>
                <Typography variant="h5" className={classes.title}>
                    Update Password
                </Typography>
                <TextField
                    type="password"
                    name="currentPassword"
                    label="Current Password"
                    variant="outlined"
                    onChange={handleInputChange}
                    required
                    className={classes.inputField}
                    fullWidth
                />
                <TextField
                    type="password"
                    name="newPassword"
                    label="New Password"
                    variant="outlined"
                    onChange={handleInputChange}
                    required
                    className={classes.inputField}
                    fullWidth
                />
                <TextField
                    type="password"
                    name="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    onChange={handleInputChange}
                    required
                    className={classes.inputField}
                    fullWidth
                />
                <Box sx={{ width: '50%', mt: 1 }}>
                    <Button type="submit" variant="contained" className={classes.submitButton}>
                        Update Password
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default UpdatePassword;
