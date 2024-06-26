import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid, Accordion, AccordionSummary, AccordionDetails,
  Card, CardContent, Typography, Button, CircularProgress,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiLink from '@mui/material/Link';

const CityGrid = ({ cities, handleCityClick, fetchWeatherData, cityMuseums, loading }) => {
    return (
        <Grid container spacing={2}>
            {cities.map((city) => (
                <Grid item xs={12} sm={6} key={city.cityID}>
                    <Accordion onChange={() => handleCityClick(city)}
                        sx={{
                            backgroundColor: '#123456',
                            color: 'White'
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                            <ListItemText primary={city.cityName} />
                            <Button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    fetchWeatherData(city.cityName);
                                }}
                                color="inherit"
                                variant="outlined"
                                size="small"
                                sx={{
                                    marginLeft: 'auto',
                                    backgroundColor: 'white', 
                                    color: 'black', 
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0', 
                                    }
                                }}
                            >
                                Show Weather
                            </Button>
                        </AccordionSummary>
                        <AccordionDetails>
                            {loading && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </div>
                            )}
                            {!loading && cityMuseums[city.cityID]?.map((museum, index) => (
                                <Card key={museum.id} sx={{ marginBottom: 2, backgroundColor: 'white', color: 'black' }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            <MuiLink
                                                component={RouterLink}
                                                to={`/tourist-museum/${museum.id}`}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                {museum.name}
                                            </MuiLink>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            ))}
        </Grid>
    );
};

export default CityGrid;
