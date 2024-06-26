import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

const ReauthenticationDialog = ({ open, onClose, onDelete, currentPassword, onPasswordChange }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Re-authenticate to Delete Account</DialogTitle>
            <DialogContent>
                <DialogContentText>Please enter your current password to confirm account deletion. This action cannot be undone.</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="currentPassword"
                    label="Current Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={currentPassword}
                    onChange={onPasswordChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onDelete} color="error">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReauthenticationDialog;
