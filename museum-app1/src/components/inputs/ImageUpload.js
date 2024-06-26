import React from 'react';
import { Button, Typography, Box } from '@mui/material';

const ImageUpload = ({ 
    handleMuseumImageChange, 
    coverImage, 
    errors 
}) => {
    return (
        <Box>
            <Button variant="contained" component="label">
                Upload Museum Cover Image
                <input type="file" hidden onChange={handleMuseumImageChange} accept="image/*" />
            </Button>
            {errors.coverImage && <Typography color="error" sx={{ mt: 1 }}>{errors.coverImage}</Typography>}
            {coverImage && <Typography variant="body2" sx={{ mt: 1 }}>Cover Image uploaded successfully!</Typography>}
        </Box>
    );
};

export default ImageUpload;
