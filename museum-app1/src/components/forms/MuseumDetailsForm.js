import React from 'react';
import { TextField, Box } from '@mui/material';

const MuseumDetailsForm = ({ 
    museumValue, 
    handleMuseumChange, 
    errors  
}) => {
    return (
        <Box>
            <TextField 
                label="Museum Name" 
                name="name" 
                value={museumValue.name} 
                onChange={handleMuseumChange} 
                error={!!errors.name}
                helperText={errors.name} 
                fullWidth sx={{ my: 1}} 
            />
            <TextField 
                label="Museum Summary" 
                name="summary" 
                value={museumValue.summary} 
                onChange={handleMuseumChange} 
                multiline 
                fullWidth
                error={!!errors.summary}
                helperText={errors.summary} 
                sx={{ my: 1}} 
            />
            <TextField 
                label="Museum History" 
                name="history" 
                value={museumValue.history} 
                onChange={handleMuseumChange} 
                multiline 
                fullWidth 
                error={!!errors.history}
                helperText={errors.history} 
                sx={{ my: 1}} 
            />
            <TextField 
                label="Museum Address" 
                name="address" 
                value={museumValue.address} 
                onChange={handleMuseumChange} 
                fullWidth 
                error={!!errors.address}
                helperText={errors.address} 
                sx={{ my: 1}} 
            />
            <TextField 
                label="Days and Hours" 
                name="daysAndHours" 
                value={museumValue.daysAndHours} 
                onChange={handleMuseumChange} 
                fullWidth 
                error={!!errors.daysAndHours}
                helperText={errors.daysAndHours} 
                sx={{ my: 1}} 
            />
            <TextField 
                label="Phone Number" 
                name="phoneNumber" 
                value={museumValue.phoneNumber} 
                onChange={handleMuseumChange} 
                fullWidth 
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber} 
                sx={{ my: 1 }}  
            />
            <TextField 
                label="Website" 
                name="website" 
                value={museumValue.website} 
                onChange={handleMuseumChange} 
                fullWidth 
                error={!!errors.website}
                helperText={errors.website} 
                sx={{ my: 1 }}  
            />
        </Box>
    );
};

export default MuseumDetailsForm;