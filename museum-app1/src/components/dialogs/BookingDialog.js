import React from 'react';
import { Dialog, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { format, isAfter } from 'date-fns';

const BookingDialog = ({ bookings, sortConfig, requestSort, isBookingDialogOpen, toggleBookingDialog, handleBookingClick }) => {
    return (
        <Dialog open={isBookingDialogOpen} onClose={toggleBookingDialog} fullWidth data-testid="booking-dialog">
            <DialogTitle>Your Bookings</DialogTitle>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={sortConfig.key === 'museumName'}
                                direction={sortConfig.key === 'museumName' ? sortConfig.direction : 'asc'}
                                onClick={() => requestSort('museumName')}
                                IconComponent={sortConfig.direction === 'ascending' ? ArrowUpwardIcon : ArrowDownwardIcon}
                                data-testid="sort-museumName"
                            >
                                Museum Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortConfig.key === 'date'}
                                direction={sortConfig.key === 'date' ? sortConfig.direction : 'asc'}
                                onClick={() => requestSort('date')}
                                IconComponent={sortConfig.direction === 'ascending' ? ArrowUpwardIcon : ArrowDownwardIcon}
                                data-testid="sort-date"
                            >
                                Date
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bookings.map(booking => {
                        const bookingDate = new Date(booking.date.seconds * 1000);
                        const isUpcoming = isAfter(bookingDate, new Date());
                        const timeSlotFormatted = format(new Date(booking.timeSlot), 'HH:mm');

                        return (
                            <TableRow 
                                key={booking.id} 
                                hover
                                onClick={() => handleBookingClick(booking.id)}
                                sx={{ cursor: 'pointer', fontWeight: isUpcoming ? 'bold' : 'normal' }}
                                data-testid={`booking-${booking.id}`}
                            >
                                <TableCell>{booking.museumName}</TableCell>
                                <TableCell>{bookingDate.toLocaleDateString()}</TableCell>
                                <TableCell>{timeSlotFormatted}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Dialog>
    );
};

export default BookingDialog;
