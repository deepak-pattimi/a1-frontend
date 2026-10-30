import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            // In a real implementation, this would call your backend API
            // For now, we'll use mock data
            const response = await axiosInstance.get(`appointments`);

            setAppointments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            // Mock data for demonstration
            setAppointments([
                {
                    id: 1,
                    fullname: "John Doe",
                    mobile: "9876543210",
                    email: "john@example.com",
                    selected_date: "2025-09-15",
                    selected_time: "10:30",
                    reason: "headache_migraine",
                    message: "Severe headaches for past 2 weeks",
                    status: "confirmed",
                    payment_method: "online",
                    payment_status: "completed",
                    transaction_id: "order_Jhf54Gfghjkl23",
                    amount: 500.00,
                    created_at: "2025-09-01 10:30:00"
                },
                {
                    id: 2,
                    fullname: "Jane Smith",
                    mobile: "9876543211",
                    email: "jane@example.com",
                    selected_date: "2025-09-16",
                    selected_time: "14:00",
                    reason: "parkinsons",
                    message: "Tremors in hands and difficulty walking",
                    status: "pending",
                    payment_method: "offline",
                    payment_status: "pending",
                    transaction_id: null,
                    amount: 500.00,
                    created_at: "2025-09-02 14:15:00"
                }
            ]);
            setLoading(false);
        }
    };

    const updateAppointmentStatus = async (appointmentId, status) => {
        try {
            // In a real implementation, this would call your backend API
            const response = await axios.post(`${API_URL}appointments/${appointmentId}/update-status`, {
                status: status
            });

            // Update local state
            setAppointments(appointments.map(app =>
                app.id === appointmentId ? { ...app, status: status } : app
            ));
        } catch (error) {
            console.error('Error updating appointment status:', error);
        }
    };

    const updatePaymentStatus = async (appointmentId, paymentStatus) => {
        try {
            // In a real implementation, this would call your backend API
            const response = await axios.post(`${API_URL}appointments/${appointmentId}/update-payment-status`, {
                payment_status: paymentStatus
            });

            // Update local state
            setAppointments(appointments.map(app =>
                app.id === appointmentId ? { ...app, payment_status: paymentStatus } : app
            ));
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'confirmed': return 'badge bg-success';
            case 'pending': return 'badge bg-warning';
            case 'cancelled': return 'badge bg-danger';
            default: return 'badge bg-secondary';
        }
    };

    const getPaymentStatusBadgeClass = (status) => {
        switch (status) {
            case 'completed': return 'badge bg-success';
            case 'pending': return 'badge bg-warning';
            case 'unpaid': return 'badge bg-info';
            case 'failed': return 'badge bg-danger';
            default: return 'badge bg-secondary';
        }
    };

    return (
        <div className="container-fluid">
            <h2 className="mb-4">Appointment Management</h2>

            {loading ? (
                <div>Loading appointments...</div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Patient</th>
                                        <th>Contact</th>
                                        <th>Appointment</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Payment Method</th>
                                        <th>Payment Status</th>
                                        <th>Amount</th>
                                        <th>Transaction ID</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td>{appointment.id}</td>
                                            <td>
                                                <strong>{appointment.fullname}</strong>
                                                <br />
                                                <small>{appointment.created_at}</small>
                                            </td>
                                            <td>
                                                {appointment.mobile}
                                                <br />
                                                {appointment.email}
                                            </td>
                                            <td>
                                                {appointment.selected_date}
                                                <br />
                                                {appointment.selected_time}
                                            </td>
                                            <td>{appointment.reason}</td>
                                            <td>
                                                <span className={getStatusBadgeClass(appointment.status)}>
                                                    {appointment.status}
                                                </span>
                                                <br />
                                                <select
                                                    className="form-select form-select-sm mt-1"
                                                    value={appointment.status}
                                                    onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td>
                                                <span className={`badge ${appointment.payment_method === 'online' ? 'bg-primary' : 'bg-secondary'}`}>
                                                    {appointment.payment_method}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={getPaymentStatusBadgeClass(appointment.payment_status)}>
                                                    {appointment.payment_status}
                                                </span>
                                                <br />
                                                {appointment.payment_method === 'offline' && (
                                                    <select
                                                        className="form-select form-select-sm mt-1"
                                                        value={appointment.payment_status}
                                                        onChange={(e) => updatePaymentStatus(appointment.id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td>₹{appointment.amount.toFixed(2)}</td>
                                            <td>
                                                {appointment.transaction_id ? (
                                                    <small>{appointment.transaction_id}</small>
                                                ) : (
                                                    <span className="text-muted">N/A</span>
                                                )}
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentList;