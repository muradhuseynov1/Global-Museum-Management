import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button } from '@mui/material';
import ReactCountryFlag from "react-country-flag";

const CountryGrid = ({ countries, getCountryCode }) => {
    return (
        <Grid 
            container 
            spacing={2} 
            sx={{
                p: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
        >
            {countries.map((country, index) => (
                <Grid item xs={6} key={index}>
                    <Button component={Link} to={`/cities/${country}`} style={{ width: '100%', justifyContent: "flex-start" }}>
                        <ReactCountryFlag
                            countryCode={getCountryCode(country)}
                            svg
                            style={{
                                width: '2em',
                                height: '2em',
                                marginRight: '8px',
                            }}
                            title={country}
                            data-testid={`flag-${country}`}
                        />
                        {country}
                    </Button>
                </Grid>
            ))}
        </Grid>
    );
};

export default CountryGrid;
