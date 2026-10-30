import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import AppointmentForm from './AppointmentForm';
import "bootstrap/dist/css/bootstrap.min.css";

const GlobalAppointmentPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only in browser
    if (typeof window === 'undefined') return;

    // If user already dismissed or opened in this session, do not interrupt
    try {
      if (sessionStorage.getItem('appointment_popup_dismissed') === 'true') {
        return;
      }
    } catch (e) {}

    // Mobile visitors have a persistent booking button; don't interrupt reading
    if (window.matchMedia('(max-width: 991px)').matches) return;

    let timer;
    let scrollTriggered = false;

    const showPopup = () => {
      try {
        if (sessionStorage.getItem('appointment_popup_dismissed') === 'true') {
          return;
        }
      } catch (e) {}

      setShow(true);
      window.removeEventListener('scroll', handleScroll);
      if (timer) clearTimeout(timer);
    };

    const handleScroll = () => {
      if (scrollTriggered) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) return;

      const scrollPercentage = (scrollTop / docHeight) * 100;

      if (scrollPercentage >= 70) {
        scrollTriggered = true;
        showPopup();
      }
    };

    // 45-second timer trigger (longer so it doesn't interrupt immediately)
    timer = setTimeout(() => {
      showPopup();
    }, 45000);

    // Scroll trigger (70%)
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
    try {
      sessionStorage.setItem('appointment_popup_dismissed', 'true');
    } catch (e) {}

    // Ensure body scroll is unlocked immediately
    setTimeout(() => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 50);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      scrollable={true}
      backdrop={true} // Allow clicking backdrop to dismiss
      keyboard={true} // Allow Escape key to dismiss
      dialogClassName="premium-appointment-modal"
      restoreFocus={false}
      onExited={() => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
      }}
    >
      <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white', borderBottom: 'none', padding: '1.5rem' }}>
        <Modal.Title style={{ fontWeight: '600', fontSize: '1.5rem', margin: 0 }}>Book an Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AppointmentFormWrapper closeModal={handleClose} />
      </Modal.Body>
    </Modal>
  );
};

// Internal wrapper to manage form state for the popup
const AppointmentFormWrapper = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    mobile: '',
    email: '',
    selected_date: '',
    selected_time: '',
    reason: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AppointmentForm
      formData={formData}
      handleChange={handleChange}
      isModal={true}
      closeModal={closeModal}
    />
  );
};

export default GlobalAppointmentPopup;
