import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Tooltip,
  useMediaQuery,
  Slide
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Loading from '../loading/Loading';
import useLogout from '../../hooks/useLogout';
import thesisIcon from '../../assets/thesis_icon1.png';

const AdminAppBar = ({}) => {
  const { logout } = useLogout();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        <Link to="/admin-dashboard">
          <img src={thesisIcon} alt="Logo" style={{ height: '45px', cursor: 'pointer', marginRight: 'auto' }} />
        </Link>
        <div className="toolbarIcons">
          <Tooltip title="Tourists">
            <IconButton color="inherit" component={Link} to="/admin-tourist" aria-label="admintourist">
              <GroupIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cities">
            <IconButton color="inherit" component={Link} to="/admin-city-list" aria-label="admincitylist">
              <LocationCityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Log out">
            <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AdminAppBar;
