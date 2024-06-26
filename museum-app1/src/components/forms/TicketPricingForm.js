import React from 'react';
import { TextField, Box, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TicketPricingForm = ({ 
    museumTicketInfo, 
    handleMuseumChange, 
    museumCurrency, 
    museumCurrencyList,
    errors
}) => {
    const categoryOrder = ['adult', 'student', 'senior', 'minor'];
    return (
        <Box>
            {categoryOrder.map((category) => (
                <TextField
                    key={category}
                    label={`${category.charAt(0).toUpperCase() + category.slice(1)} Ticket Price`}
                    type="number"
                    name={`ticketInfo.${category}`}
                    value={museumTicketInfo[category]}
                    onChange={handleMuseumChange}
                    fullWidth
                    sx={{ my: 2 }}
                    error={!!errors[`ticketInfo.${category}`]}
                    helperText={errors[`ticketInfo.${category}`] || ''}
                    InputProps={{
                    startAdornment: <InputAdornment position="start">{museumCurrency}</InputAdornment>,
                    }}
                />
            ))}
            <FormControl fullWidth sx={{ my: 2 }} >
                <InputLabel id="currency-select-label">Currency</InputLabel>
                <Select
                    labelId="currency-select-label"
                    id="currency-select"
                    value={museumCurrency}
                    label="Currency"
                    onChange={handleMuseumChange}
                    name="currency"
                    
                >
                    {museumCurrencyList.map(({ code, name }) => (
                    <MenuItem key={code} value={code}>
                        {name}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default TicketPricingForm;