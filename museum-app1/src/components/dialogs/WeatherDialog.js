import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, List, ListItem, ListItemAvatar, Avatar, Grid,
  Paper, CardContent, useTheme, Chip, Pagination
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const WeatherDialog = ({ isOpen, onClose, weatherData }) => {
    const theme = useTheme();
    const [page, setPage] = useState(1);
    const forecastsPerPage = 3;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const chartData = weatherData?.list.map(item => ({
        time: new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' }),
        Temperature: item.main.temp,
        FeelsLike: item.main.feels_like
    }));

    const indexOfLastForecast = page * forecastsPerPage;
    const indexOfFirstForecast = indexOfLastForecast - forecastsPerPage;
    const currentForecasts = weatherData?.list.slice(indexOfFirstForecast, indexOfLastForecast);

    const totalPages = Math.ceil(weatherData?.list.length / forecastsPerPage);

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg" aria-labelledby="weather-dialog-title">
            <DialogTitle id="weather-dialog-title" sx={{ textAlign: 'center' }}>
                Detailed Weather Forecast for {weatherData?.city?.name || 'the selected city'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <List dense>
                            {currentForecasts?.map((forecast, index) => (
                                <ListItem key={index} divider alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="square"
                                            alt="Weather Icon"
                                            src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                        />
                                    </ListItemAvatar>
                                    <CardContent>
                                        <Typography variant="subtitle1" component="div">
                                            {new Date(forecast.dt * 1000).toLocaleTimeString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                        <Typography variant="body2" component="div" sx={{ color: theme.palette.text.secondary }}>
                                            {forecast.weather[0].description.charAt(0).toUpperCase() + forecast.weather[0].description.slice(1)}
                                        </Typography>
                                        <Chip label={`${forecast.main.temp} °C`} color="primary" size="small" sx={{ marginRight: 1 }} />
                                        <Chip label={`Feels like ${forecast.main.feels_like} °C`} color="secondary" size="small" />
                                    </CardContent>
                                </ListItem>
                            ))}
                        </List>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handleChangePage}
                            color="primary"
                            sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                            Temperature Trends
                        </Typography>
                        <Paper variant="outlined" sx={{ height: 400, p: 2, backgroundColor: '#f5f5f5' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Temperature" stroke={theme.palette.primary.main} strokeWidth={2} activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="FeelsLike" stroke={theme.palette.secondary.main} strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} 
                sx={{
                    bgcolor: '#123456',
                    '&:hover': {
                      backgroundColor: '#36454F',
                      color: '#ffffff',
                    },
                  }} 
                  variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WeatherDialog;
