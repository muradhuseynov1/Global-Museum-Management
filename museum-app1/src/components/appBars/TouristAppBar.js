import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, TextField, Tooltip, useMediaQuery, Slide } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import Loading from '../loading/Loading';
import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';
import thesisIcon from '../../assets/thesis_icon1.png';

const TouristAppBar = ({ searchQuery, setSearchQuery, toggleBookingDialog, 
    showSearchBar = true, showBookingsIcon = true 
}) => {
    const { logout } = useLogout();
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSearchToggle = () => {
        setSearchOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        setIsLoading(true);
        await logout();
        setIsLoading(false);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <AppBar position="static" className="dashboardAppBar">
            <Toolbar className="toolbar">
                <Link to="/tourist-dashboard">
                    <img src={thesisIcon} alt="Logo" style={{ height: '45px', cursor: 'pointer', marginRight: 'auto' }} />
                </Link>
                {showSearchBar && (isMobile ? (
                    <IconButton color="inherit" onClick={handleSearchToggle}>
                        <SearchIcon />
                    </IconButton>
                ) : (
                    <div style={{ flex: 1, maxWidth: '600px', margin: '0 auto' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search..."
                            size="small"
                            sx={{ backgroundColor: 'white', borderRadius: '4px' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                ))}
                <div className="toolbarIcons">
                    {showBookingsIcon && (
                        <Tooltip title="Bookings">
                            <IconButton color="inherit" onClick={toggleBookingDialog}>
                                <BookmarksIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Settings">
                        <IconButton color='inherit' component={Link} to="/settings/tourist" aria-label='settings'>
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Log out">
                        <IconButton color="inherit" onClick={handleLogout}>
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </Toolbar>
            {showSearchBar && isMobile && searchOpen && (
                <Slide direction="down" in={searchOpen} mountOnEnter unmountOnExit>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                        sx={{ backgroundColor: 'white', borderRadius: '4px', margin: 1 }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Slide>
            )}
        </AppBar>
    );
};

export default TouristAppBar;
