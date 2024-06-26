import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, ListItemButton, ListItemText, Box, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useStyles } from '../../styles/SettingsDrawerStyles';
import thesisIcon from '../../assets/thesis_icon1.png';

const SettingsDrawer = ({ options, onOptionSelected, selectedOption, userType }) => {
  const { classes } = useStyles({ selectedOption });
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const matches = useMediaQuery('(min-width:600px)');

  const navigateDashboard = () => {
    const destination = userType === 'city' ? '/city-dashboard' : '/tourist-dashboard';
    navigate(destination);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {!matches && (
        <IconButton
          onClick={toggleDrawer(true)}
          sx={{ color: '#123456', marginLeft: 'auto' }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={matches ? "permanent" : "temporary"}
        open={matches || drawerOpen}
        onClose={toggleDrawer(false)}
        anchor="left"
        className={classes.drawer}
      >
        <Box className={classes.drawerHeader}>
          <Tooltip title="Back to Dashboard" arrow>
            <IconButton onClick={navigateDashboard} size="large">
              <img src={thesisIcon} alt="Back to Dashboard" style={{ maxWidth: '35%', height: 'auto' }} />
            </IconButton>
          </Tooltip>
        </Box>
        <List>
          {Object.keys(options).map((text) => (
            <ListItemButton
              key={text}
              selected={selectedOption === options[text]}
              onClick={() => onOptionSelected(options[text])}
              sx={{
                backgroundColor: selectedOption === options[text] ? '#ffd617' : '#123456',
                color: selectedOption === options[text] ? 'black' : '#FFFFFF',
              }}
              classes={{ selected: classes.listItemButton }}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default SettingsDrawer;
