import React, { useState } from 'react';
import { Box } from '@mui/material';
import UpdateProfile from '../../components/settings/UpdateProfile';
import UpdatePassword from '../../components/settings/UpdatePassword';
import { useParams } from 'react-router-dom';
import SettingsDrawer from '../../components/settings/SettingsDrawer';

const Settings = () => {
  const { userType } = useParams();
  console.log("User type in Settings:", userType);
  const [selectedSetting, setSelectedSetting] = useState('updateprofileinfo');
  const settingsOptions = userType === 'city' ? {
    "Update City Info": "updateprofileinfo",
    "Update City Password": "updatepassword"
  } : {
    "Update Tourist Info": "updateprofileinfo",
    "Update Tourist Password": "updatepassword"
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SettingsDrawer 
        options={settingsOptions} 
        onOptionSelected={setSelectedSetting} 
        selectedOption={selectedSetting} 
        userType={userType}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
        {selectedSetting === 'updateprofileinfo' && <UpdateProfile userType={userType} />}
        {selectedSetting === 'updatepassword' && <UpdatePassword />}
      </Box>
    </Box>
  );
};

export default Settings;
