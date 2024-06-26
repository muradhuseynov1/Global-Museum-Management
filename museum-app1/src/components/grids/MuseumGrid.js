import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const MuseumGrid = ({ museums, searchQuery, promptDeleteConfirmation }) => {
    return (
    <Grid container spacing={2} className="museumGrid">
      {museums.filter(museum => museum.name.toLowerCase().includes(searchQuery.toLowerCase())).map((museum) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={museum.id}>
          <Card className="museumCard">
            <CardActionArea component={Link} to={`/museum/${museum.id}`}>
              <div className="cardMedia" style={{ backgroundImage: `url(${museum.museumCoverImage})` }}>
                <div className="iconContainer">
                  <Tooltip title="Edit Museum">
                    <IconButton
                      component={Link}
                      to={`/edit-museum/${museum.id}`}
                      className="editIconButton"
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Museum">
                    <IconButton
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        promptDeleteConfirmation(museum.id);
                      }}
                      className="deleteIconButton"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <CardContent>
                <Tooltip title={museum.name} placement="top">
                  <Typography variant="h6" className="museumName">
                    {museum.name}
                  </Typography>
                </Tooltip>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
      {museums.filter(museum => museum.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && searchQuery !== '' && (
        <Grid item xs={12}>
          <Typography variant="h6" style={{ textAlign: 'center', marginTop: '20px' }}>
            No such museum found.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default MuseumGrid;
