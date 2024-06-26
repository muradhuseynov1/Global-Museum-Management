import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import RoleSelection from '../pages/selectRole/RoleSelection';
import Registration from '../pages/registration/Registration';
import ForgotPassword from '../pages/forgotPassword/ForgotPassword';
import CityDashboard from '../pages/cityDashboard/CityDashboard';
import TouristDashboard from '../pages/touristDashboard/TouristDashboard';
import AdminDashboard from '../pages/adminDashboard/AdminDashboard';
import AddMuseum from '../pages/addMuseum/AddMuseum';
import MuseumDetail from '../pages/cityMuseumDetails/MuseumDetail';
import EditMuseum from '../pages/editMuseum/EditMuseum';
import UpdateProfile from '../components/settings/UpdateProfile';
import Settings from '../pages/settings/Settings';
import UpdatePassword from '../components/settings/UpdatePassword';
import Cities from '../pages/cities/Cities';
import TouristMuseumDetail from '../pages/touristMuseumDetails/TouristMuseumDetail';
import TouristBooking from '../pages/touristBooking/TouristBooking';
import TicketDetails from '../pages/ticketDetails/TicketDetails';
import ProtectedRoute from './ProtectedRoute';
import AdminCityList from '../pages/adminCityManagement/AdminCityList';
import AdminTourist from '../pages/adminTouristManagement/AdminTourist';

const RouterComponent = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<RoleSelection />} />
      <Route path="/signup/:role" element={<Registration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/city-dashboard" element={<ProtectedRoute><CityDashboard /></ProtectedRoute>} />
      <Route path="/add-museum" element={<ProtectedRoute><AddMuseum /></ProtectedRoute>} />
      <Route path="/tourist-dashboard" element={<ProtectedRoute><TouristDashboard /></ProtectedRoute>} />
      <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/museum/:id" element={<ProtectedRoute><MuseumDetail /></ProtectedRoute>} /> 
      <Route path="/edit-museum/:id" element={<ProtectedRoute><EditMuseum /></ProtectedRoute>} />
      <Route path="/update-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
      <Route path="/settings/:userType" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
      <Route path="/cities/:countryName" element={<ProtectedRoute><Cities /></ProtectedRoute>} />
      <Route path="/tourist-museum/:id" element={<ProtectedRoute><TouristMuseumDetail /></ProtectedRoute>} />
      <Route path="/booking/:id" element={<ProtectedRoute><TouristBooking /></ProtectedRoute>} />
      <Route path="/ticket/:bookingId" element={<ProtectedRoute><TicketDetails/></ProtectedRoute>} />
      <Route path="/admin-city-list" element={<ProtectedRoute><AdminCityList/></ProtectedRoute>} />
      <Route path="/admin-tourist" element={<ProtectedRoute><AdminTourist/></ProtectedRoute>} />

    </Routes> 
  </BrowserRouter>
  )
};

export default RouterComponent;