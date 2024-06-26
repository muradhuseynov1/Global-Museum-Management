import React, { useState } from 'react';
import { Box, Button, Typography, Container, createTheme, ThemeProvider } from '@mui/material';
import TouristTable from '../../components/tables/TouristTable';
import TouristForm from '../../components/forms/TouristForm';
import AdminAppBar from '../../components/appBars/AdminAppBar';
import Footer from '../../components/footer/Footer';
import AdminTouristStyles from '../../styles/AdminTouristStyles';

const AdminTourist = () => {
  const [editingTourist, setEditingTourist] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#123456',
      },
    },
  });

  const handleEdit = (tourist) => {
    setEditingTourist(tourist);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingTourist(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <ThemeProvider theme={theme}>
        <Box style={AdminTouristStyles.background}>
            <AdminAppBar />
            <Container>
                {!showForm && (
                  <>
                    <Typography variant="h4" gutterBottom sx={{mt:4, ml: 3}}>Tourist Management</Typography>
                    <Box sx={{ mb: 2, ml: 3 }} >
                        <Button variant="contained" onClick={handleAddNew}>Add New Tourist</Button>
                    </Box>
                  </>
                )}
                {showForm ? (
                    <TouristForm currentTourist={editingTourist} onSave={handleSave} onCancel={handleCancel} />
                ) : (
                    <TouristTable onEdit={handleEdit} />
                )}
            </Container>
            <Footer />
        </Box>
    </ThemeProvider>
  );
};

export default AdminTourist;
