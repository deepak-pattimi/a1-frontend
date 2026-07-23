import React, { useState, useEffect } from 'react';
import AppointmentForm from './AppointmentForm';
import { Modal } from 'react-bootstrap';
import axiosInstance from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const INITIAL_FORM_STATE = {
  fullname: '',
  email: '',
  mobile: '',
  selected_date: '',
  selected_time: '',
  reason: '',
  doctor: '',
  message: '',
};

const MobileButtonBar = () => {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // You can replace these with your actual numbers
  const phoneNumber = '+917829222111'; // Replace with your actual phone number
  const whatsappNumber = '+917829222111'; // Replace with your WhatsApp number

  // Check if the device is mobile-sized
  useEffect(() => {
    const checkIsMobile = () => {
      // Using window.matchMedia to detect mobile screens
      return window.matchMedia('(max-width: 768px)').matches;
    };

    setIsMobileView(checkIsMobile());

    const handleResize = () => {
      setIsMobileView(checkIsMobile());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleClose = () => {
    setShowAppointmentForm(false);
    // Reset form data when modal closes
    setFormData(INITIAL_FORM_STATE);
  };

  const handleShow = () => setShowAppointmentForm(true);

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello, I contacted you from your website.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleBookNowClick = () => {
    handleShow();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(`appointment`, formData);
      if (response.data.status === 200) {
        toast.success(response.data.message || "Appointment booked successfully!");
        setFormData(INITIAL_FORM_STATE);
        handleClose();
      }
    } catch (error) {
      const errorData = error.response?.data;

      // Handle network errors
      if (error.isNetworkError || error.isTimeoutError || !error.response) {
        // Error already handled by interceptor, but we can add additional handling here
        return;
      }

      if (!errorData) {
        toast.error("An error occurred. Please try again.");
        return;
      }

      if (errorData.status === 500) {
        toast.error("Server Error");
      } else if ([400, 401].includes(errorData.status)) {
        const messages = typeof errorData.message === "object"
          ? Object.values(errorData.message).flat()
          : [errorData.message];

        messages.forEach(msg => toast.error(msg));
      }
    } finally {
      setLoading(false);
    }
  };

  // Only show the mobile button bar on mobile devices
  if (!isMobileView) {
    return null;
  }

  return (
    <>
      <div className="mobile-button-bar">
        <div className="mobile-buttons-container">
          <button
            className="mobile-btn mobile-btn-call"
            onClick={handleCallClick}
            aria-label="Call Now"
          >
            <i className="fas fa-phone"></i>
            <span>Call Now</span>
          </button>

          <button
            className="mobile-btn mobile-btn-book"
            onClick={handleBookNowClick}
            aria-label="Book Appointment"
          >
            <i className="fas fa-calendar-plus"></i>
            <span>Book Now</span>
          </button>

          <button
            className="mobile-btn mobile-btn-whatsapp"
            onClick={handleWhatsAppClick}
            aria-label="Chat on WhatsApp"
          >
            <i className="fab fa-whatsapp"></i>
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Appointment Form Modal - same as in Header */}
      <Modal 
        show={showAppointmentForm} 
        onHide={handleClose} 
        size="lg"
        scrollable={true}
        backdrop="static"
        keyboard={false}
        dialogClassName="premium-appointment-modal"
        restoreFocus={false}
      >
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white', borderBottom: 'none', padding: '1.5rem' }}>
          <Modal.Title style={{ fontWeight: '600', fontSize: '1.5rem', margin: 0 }}>Book an Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="formSubmit">
            <p>We Are Ready To Help You With A Smile!</p>
            <AppointmentForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
              isModal={true}
              closeModal={handleClose}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MobileButtonBar;
