import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

const AdminDashboard = () => {
    const [statistics, setStatistics] = useState({
        totalAppointments: 0,
        pendingAppointments: 0,
        onlinePayments: 0,
        offlinePayments: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            // In a real implementation, this would call your backend API
            // For now, we'll use mock data
            const response = await axiosInstance.get(`dashboard-stats`);
            
            setStatistics(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Mock data for demonstration
            setStatistics({
                totalAppointments: 42,
                pendingAppointments: 8,
                onlinePayments: 15000,
                offlinePayments: 8500
            });
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <h2 className="mb-4">Admin Dashboard</h2>
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="row">
                    <div className="col-md-3">
                        <div className="card bg-primary text-white mb-4">
                            <div className="card-body">
                                <h5>Total Appointments</h5>
                                <h3>{statistics.totalAppointments}</h3>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <div className="card bg-warning text-white mb-4">
                            <div className="card-body">
                                <h5>Pending Appointments</h5>
                                <h3>{statistics.pendingAppointments}</h3>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <div className="card bg-success text-white mb-4">
                            <div className="card-body">
                                <h5>Online Payments (₹)</h5>
                                <h3>{statistics.onlinePayments.toFixed(2)}</h3>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <div className="card bg-info text-white mb-4">
                            <div className="card-body">
                                <h5>Offline Payments (₹)</h5>
                                <h3>{statistics.offlinePayments.toFixed(2)}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h5>Recent Appointments</h5>
                        </div>
                        <div className="card-body">
                            {/* This would be populated with a table of appointments */}
                            <p>Appointment list would appear here with payment details.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;