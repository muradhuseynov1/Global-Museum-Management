import React from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, TextField, Grid } from '@mui/material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const OperatingScheduleForm = ({
    museumHandleSelectDate, 
    museumOpenDays, 
    museumRecurrence, 
    museumSetRecurrence, 
    museumWeekDays, 
    museumSetWeekDays, 
    museumRecurrenceStartDate,
    museumSetRecurrenceStartDate, 
    museumRecurrenceEndDate, 
    museumSetRecurrenceEndDate,
    errors
}) => {
    return (
        <Box>
            <div className="custom-datepicker-wrapper" aria-label="Select Dates">
                <DatePicker
                    inline
                    selected={null}
                    onSelect={museumHandleSelectDate}
                    multiple
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    highlightDates={museumOpenDays}
                    locale="en-GB"
                />
                {console.log(errors)}
                {errors.openDays && <Typography color="error" data-testid="error-openDays">{errors.openDays}</Typography>}
            </div>

            <Box>
                <Typography id="recurrence-type">Recurrence:</Typography>
                <RadioGroup
                    row
                    aria-labelledby="recurrence-type"
                    name="recurrence-type"
                    value={museumRecurrence}
                    onChange={(e) => museumSetRecurrence(e.target.value)}
                    data-testid="recurrence-radio-group"
                >
                    <FormControlLabel value="none" control={<Radio />} label="None" />
                    <FormControlLabel value="daily" control={<Radio />} label="Daily" />
                    <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
                </RadioGroup>
            </Box>
            {museumRecurrence === 'weekly' && (
                <FormGroup row>
                    {Object.keys(museumWeekDays).map((day) => (
                        <FormControlLabel
                            key={day}
                            control={
                                <Checkbox
                                    checked={museumWeekDays[day]}
                                    onChange={() => museumSetWeekDays({ ...museumWeekDays, [day]: !museumWeekDays[day] })}
                                    aria-label={day}
                                    data-testid={`checkbox-${day}`}
                                />
                            }
                            label={day}
                        />
                    ))}
                </FormGroup>
            )}
            {museumRecurrence !== 'none' && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Recurrence Range:</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField
                                id="start-date"
                                type="date"
                                label="Start Date"
                                value={museumRecurrenceStartDate.toISOString().substring(0, 10)}
                                onChange={(e) => museumSetRecurrenceStartDate(new Date(e.target.value))}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                aria-label="Start Date"
                                data-testid="start-date"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="end-date"
                                type="date"
                                label="End Date"
                                value={museumRecurrenceEndDate.toISOString().substring(0, 10)}
                                onChange={(e) => museumSetRecurrenceEndDate(new Date(e.target.value))}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                aria-label="End Date"
                                data-testid="end-date"
                            />
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default OperatingScheduleForm;
