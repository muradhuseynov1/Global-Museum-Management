import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Paper, Container, createTheme, ThemeProvider, TableSortLabel, TablePagination, Box } from '@mui/material';
import DeleteConfirmationDialog from '../../components/dialogs/DeleteAccountDialog';
import DeleteTouristAccount from '../../components/settings/DeleteTouristAccount';

const TouristTable = ({ onEdit }) => {
  const [tourists, setTourists] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#123456',
      },
    },
  });

  useEffect(() => {
    const fetchTourists = async () => {
      const touristCollection = collection(firestore, 'tourists');
      const touristSnapshot = await getDocs(touristCollection);
      const touristList = touristSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTourists(touristList);
    };

    fetchTourists();
  }, []);

  const handleDeleteClick = (tourist) => {
    setSelectedTourist(tourist);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTourist) {
      const userId = selectedTourist.id;
      const deletionSuccess = await DeleteTouristAccount(userId);
      if (deletionSuccess) {
        setTourists(prev => prev.filter(tourist => tourist.id !== userId));
      }
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedTourist(null);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedTourists = tourists.slice().sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Paper>
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'surname'}
                      direction={orderBy === 'surname' ? order : 'asc'}
                      onClick={() => handleRequestSort('surname')}
                    >
                      Surname
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? order : 'asc'}
                      onClick={() => handleRequestSort('email')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'dateOfBirth'}
                      direction={orderBy === 'dateOfBirth' ? order : 'asc'}
                      onClick={() => handleRequestSort('dateOfBirth')}
                    >
                      Date of Birth
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTourists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tourist) => (
                  <TableRow key={tourist.id}>
                    <TableCell>{tourist.name}</TableCell>
                    <TableCell>{tourist.surname}</TableCell>
                    <TableCell>{tourist.email}</TableCell>
                    <TableCell>{tourist.dateOfBirth}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => onEdit(tourist)}>Edit</Button>
                      <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(tourist)} sx={{ ml: 1 }}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tourists.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      </Container>
    </ThemeProvider>
  );
};

export default TouristTable;
