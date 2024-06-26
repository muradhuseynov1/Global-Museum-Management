import React from 'react';
import { TextField, Box } from '@mui/material';

const OperatingTimesForm = ({
  museumSlotLimit,
  museumHandleChange,
  museumOpeningTime,
  museumClosingTime,
  errors  
}) => {
    return (
        <Box>
            <TextField
                label="Slot Limit"
                type="number"
                name="slotLimit"
                value={museumSlotLimit}
                onChange={museumHandleChange}
                error={!!errors.slotLimit}
                helperText={errors.slotLimit || ''}
                fullWidth
                sx={{ my: 2 }}
              />
              <TextField
                label="Opening Time"
                type="time"
                name="openingTime"
                value={museumOpeningTime}
                onChange={museumHandleChange}
                error={!!errors.openingTime}
                helperText={errors.openingTime || ''}
                fullWidth
                sx={{ my: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Closing Time"
                type="time"
                name="closingTime"
                value={museumClosingTime}
                onChange={museumHandleChange}
                error={!!errors.closingTime}
                helperText={errors.closingTime || ''}
                fullWidth
                sx={{ my: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {console.log(errors)}
        </Box>
    );
};

export default OperatingTimesForm;
