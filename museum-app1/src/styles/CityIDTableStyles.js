import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    overflowX: 'auto',  
}));

export const StyledTable = styled(Table)({});

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.action.hover, 
    },
    transition: 'background-color 300ms',
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: '0.85rem',
    [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
}));
