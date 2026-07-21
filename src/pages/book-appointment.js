import React, { useState } from 'react';
import Head from 'next/head';
import AppointmentForm from '@/Components/AppointmentForm';

export default function BookAppointmentPage() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        mobile: '',
        selected_date: '',
        selected_time: '',
        reason: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Head>
                <title>Book Appointment - A1 Laparoscopy Hospital</title>
                <meta name="description" content="Book an appointment online with A1 Laparoscopy Hospital in Visakhapatnam." />
            </Head>
            
            <div className="container py-5 mt-5">
                <div className="row justify-content-center mt-5">
                    <div className="col-lg-8 col-md-10">
                        <div className="card shadow-sm border-0 p-4 p-md-5 mt-4" style={{ borderRadius: '15px' }}>
                            <h1 className="text-center mb-4" style={{ color: '#013250', fontWeight: 'bold' }}>
                                Book an Appointment
                            </h1>
                            <p className="text-center text-muted mb-4">
                                Fill out the form below and our team will get back to you shortly to confirm your appointment.
                            </p>
                            
                            <AppointmentForm 
                                formData={formData} 
                                handleChange={handleChange} 
                                isModal={false} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
