import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import AppointmentForm from './AppointmentForm';
import "bootstrap/dist/css/bootstrap.min.css";

const GlobalAppointmentPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer;
    let scrollTriggered = false;

    const showPopup = () => {
      setShow(true);
      // Cleanup listeners once shown
      window.removeEventListener('scroll', handleScroll);
      if (timer) clearTimeout(timer);
    };

    const handleScroll = () => {
      if (scrollTriggered) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / docHeight) * 100;

      if (scrollPercentage >= 60) {
        scrollTriggered = true;
        showPopup();
      }
    };

    // 30 second timer trigger
    timer = setTimeout(() => {
      showPopup();
    }, 30000);

    // Scroll trigger (60%)
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="sm"
      backdrop="static"
      keyboard={false}
      dialogClassName="appointment-modal-compact"
      restoreFocus={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Book an Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Pass isModal={true} and our close handler */}
        {/* Note: AppointmentForm might have its own internal formData state or require props. 
            Looking at the file, it takes formData and handleChange. 
            We need to provide those or ensure it handles it internally. 
            Wait, AppointmentForm uses props: formData, handleChange.
            If I don't pass them, it might crash or be uncontrolled. 
            Let's check AppointmentForm again. It uses `formData?.fullname` etc. 
            So we MUST manage the form state here or refactor AppointmentForm.
            Refactoring AppointmentForm to have local state if props are missing would be ideal, 
            but for now, let's wrap it with state here. 
         */}
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
