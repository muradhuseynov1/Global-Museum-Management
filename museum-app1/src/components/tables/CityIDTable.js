import React, { useState, useEffect } from 'react';
import { TableBody, TableCell, TableHead, Paper, TableSortLabel, Button, Container, createTheme, ThemeProvider, TablePagination, Box } from '@mui/material';
import { firestore } from '../../firebase';
import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import CityEditDialog from '../dialogs/CityEditDialog';
import DeleteCityAccount from '../../components/settings/DeleteCityAccount';
import DeleteAccountDialog from '../../components/dialogs/DeleteAccountDialog'; 
import {
    StyledTable,
    StyledTableRow,
    StyledTableCell
} from '../../styles/CityIDTableStyles';

const CityIDTable = () => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [cityIDs, setCityIDs] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cityToDelete, setCityToDelete] = useState(null);
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
        const q = query(collection(firestore, "cityIDs"));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const cities = await Promise.all(querySnapshot.docs.map(async doc => {
                const cityData = { docID: doc.id, ...doc.data() };
                const registrarsQuery = query(collection(firestore, "cityRegistrars"), where("cityID", "==", cityData.id));
                const registrarsSnapshot = await getDocs(registrarsQuery);
                if (!registrarsSnapshot.empty) {
                    const registrarData = registrarsSnapshot.docs[0].data();
                    return { ...cityData, registrarDocID: registrarsSnapshot.docs[0].id, countryName: registrarData.countryName }; 
                }
                return cityData; 
            }));
            setCityIDs(cities);
        });
    
        return () => unsubscribe();
    }, []);    

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortArray = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    const sortedCityIDs = sortArray(cityIDs, getComparator(order, orderBy));

    const openEditDialog = async (city) => {
        const cityIDDocRef = doc(firestore, "cityIDs", city.docID);
        const cityIDDocSnap = await getDoc(cityIDDocRef);
    
        if (cityIDDocSnap.exists()) {
            const cityDetails = cityIDDocSnap.data();
    
            if (cityDetails.id) {
                const registrarsQuery = query(collection(firestore, "cityRegistrars"), where("cityID", "==", cityDetails.id));
                const registrarsSnapshot = await getDocs(registrarsQuery);
    
                if (!registrarsSnapshot.empty) {
                    const registrarData = registrarsSnapshot.docs[0].data();
    
                    setSelectedCity({
                        ...cityDetails,
                        ...registrarData,
                        docID: city.docID,
                        cityID: cityDetails.id
                    });                    
                } else {
                    setSelectedCity({
                        ...cityDetails,
                        docID: city.docID,
                        cityID: cityDetails.id
                    });
                }
            }
        }
    };    

    const closeDialog = () => {
        setSelectedCity(null);
    };

    const handleCopyID = (cityID) => {
        navigator.clipboard.writeText(cityID)
            .then(() => {
                setCopySuccess('City ID copied to clipboard');
                setTimeout(() => setCopySuccess(''), 3000);
            })
            .catch((err) => {
                console.error('Failed to copy city ID: ', err);
            });
    };

    const handleDelete = async () => {
        if (cityToDelete) {
            try {
                const result = await DeleteCityAccount(cityToDelete);
                if (result) {
                    setCityIDs(prev => prev.filter(city => city.registrarDocID !== cityToDelete));
                }
            } catch (error) {
                console.error('Error deleting city account:', error);
            } finally {
                setDeleteDialogOpen(false);
                setCityToDelete(null);
            }
        }
    };

    const confirmDelete = (docID) => {
        setCityToDelete(docID);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCityToDelete(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Paper>
                    <Box sx={{ overflowX: 'auto' }}>
                        <StyledTable>
                            <TableHead>
                                <StyledTableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'id'}
                                            direction={orderBy === 'id' ? order : 'asc'}
                                            onClick={() => handleSortRequest('id')}
                                        >
                                            City ID
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TableSortLabel
                                            active={orderBy === 'assigned'}
                                            direction={orderBy === 'assigned' ? order : 'asc'}
                                            onClick={() => handleSortRequest('assigned')}
                                        >
                                            Assigned
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TableSortLabel
                                            active={orderBy === 'cityName'}
                                            direction={orderBy === 'cityName' ? order : 'asc'}
                                            onClick={() => handleSortRequest('cityName')}
                                        >
                                            City Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="left">
                                        <TableSortLabel
                                            active={orderBy === 'countryName'}
                                            direction={orderBy === 'countryName' ? order : 'asc'}
                                            onClick={() => handleSortRequest('countryName')}
                                        >
                                            Country Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="left">
                                        Actions
                                    </TableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {sortedCityIDs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((city, index) => (
                                    <StyledTableRow key={index} onClick={() => openEditDialog(city)}>
                                        <StyledTableCell component="th" scope="row">
                                            {city.id}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{city.assigned ? 'Yes' : 'No'}</StyledTableCell>
                                        <StyledTableCell align="left">{city.assigned ? city.cityName : 'N/A'}</StyledTableCell>
                                        <StyledTableCell align="left">{city.assigned ? city.countryName : 'N/A'}</StyledTableCell>
                                        <StyledTableCell align="left">
                                            <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleCopyID(city.id); }}>Copy ID</Button>
                                            <Button variant="contained" color="secondary" onClick={(e) => { e.stopPropagation(); confirmDelete(city.registrarDocID); }} sx={{ ml: 1 }}>Delete</Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </StyledTable>
                    </Box>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={cityIDs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Container>
            {selectedCity && (
                <CityEditDialog
                    open={Boolean(selectedCity)}
                    onClose={closeDialog}
                    cityDetails={selectedCity}
                />
            )}
            {copySuccess && <div>{copySuccess}</div>}
            <DeleteAccountDialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={handleDelete}
            />
        </ThemeProvider>
    );
};

export default CityIDTable;
