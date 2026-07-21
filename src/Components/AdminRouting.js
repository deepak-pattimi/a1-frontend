import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AppointmentList from './AppointmentList';

const AdminRouting = () => {
    return (
        <Router>
            <Routes>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/appointments" element={<AppointmentList />} />
            </Routes>
        </Router>
    );
};

export default AdminRouting;