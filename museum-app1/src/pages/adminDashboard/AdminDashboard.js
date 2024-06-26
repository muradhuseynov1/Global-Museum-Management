import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import AdminAppBar from '../../components/appBars/AdminAppBar';
import Footer from '../../components/footer/Footer';
import { Typography, Box, Container } from '@mui/material';
import AdminDashboardStyles from '../../styles/AdminDashboardStyles';

const AdminDashboard = () => {
    const [adminName, setAdminName] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchAdminData = async () => {
            if (currentUser) {
                const docRef = doc(firestore, "admins", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setAdminName(docSnap.data().name);
                } else {
                    console.log("No such document!");
                }
            }
        };

        fetchAdminData();
    }, [currentUser]);

    return (
        <Box style={AdminDashboardStyles.dashboardBackground}>
            <AdminAppBar />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h3" component="h1" color="#123456" gutterBottom>
                    Welcome, {adminName || 'Admin'}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    This is your dashboard where you can manage the administration of the portal.
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Use the navigation icons above to manage lists of Tourists, Cities, and Admin accounts.
                </Typography>
                <Typography variant="body1">
                    Here, you can edit or delete accounts as needed. Efficient management tools are at your fingertips to streamline operations and maintain control over your administrative responsibilities.
                </Typography>
            </Container>
            <Footer />
        </Box>
    );
};

export default AdminDashboard;
