import React, { useState } from 'react';
import Link from 'next/link';
import Facebook from '../assets/facebook.png';
import Instagram from '../assets/instagram.png';
import LinkedIn from '../assets/linkedin.png';
import Youtube from '../assets/youtube.png';
import { FaGoogle, FaWhatsapp } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUtils';
import AppointmentForm from '../Components/AppointmentForm';


const WhatsAppFloat = ({ phoneNumber }) => {
  const message = encodeURIComponent("Hello, I would like to book an appointment.");

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="whatsapp-float">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={35} />
      </a>
    </div>
  );
};

const LinkList = ({ links }) => (
  <ul>
    {links.map((link, index) => (
      <li key={index}>
        <Link href={link.path} className="text-white">
          {link.title}
        </Link>
      </li>
    ))}
  </ul>
);

const Footer = ({ generalSettings }) => {
  const currentYear = new Date().getFullYear();
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    mobile: '',
    selected_date: '',
    selected_time: '',
    reason: '',
    doctor: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const quickLinks = [
    { title: 'Home', path: '/' },
    { title: 'About Us', path: '/Aboutdr' },
    { title: 'Contact Us', path: '/Contact' }
  ];

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Handle form submission logic here
    // This would typically call the same logic as in Header.js
    setLoading(false);
  };

  if (!generalSettings) {
    return null;
  }

  return (
    <>
      {/* Full Row Appointment Section Above Footer */}

      <div className="appointment-full-row">
        <div className="container">
          <div className="appointment-full-content">
            <h2>Ready to Book Your Appointment?</h2>
            <p>Get expert medical care from our experienced team. Schedule your consultation today and take the first step towards better health with our comprehensive healthcare services.</p>
            <div className="appointment-actions">
              <button 
                className="appointment-btn-primary"
                onClick={handleShow}
              >
                Book Appointment
              </button>
              <button 
                className="appointment-btn-secondary"
                onClick={() => window.location.href = '/Contact'}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <footer id="footer">
        <div className="footer-top">
          <div className="container">
            <div className="row">
              {/* Logo and Contact Information */}
              <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                <Link href="/">
                  <Image
                    src={getImageUrl(generalSettings.footer_logo)}
                    width={100}
                    height={32}
                    alt="Company Logo"
                    className="mb-3"
                    style={{ height: 'auto', objectFit: 'contain' }}
                  />
                </Link>


                <div className="footer-contact-info">
                  <p className="text-white">
                    <strong className="text-white">Phone:</strong> {generalSettings.footer_phone}<br />
                    <strong className="text-white">Email:</strong> {generalSettings.footer_email}
                  </p>
                  
                  {/* Book Appointment Button */}
                  <button 
                    className="appointment-toggle-btn"
                    onClick={handleShow}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-lg-4 col-md-6 mb-4 mb-md-0 footer-links">
                <h4 className="footer-section-title text-white">Quick Links</h4>
                <LinkList links={quickLinks} />
              </div>

              {/* Social Links */}
              <div className="col-lg-4 col-md-6">
                <h4 className="footer-section-title text-white">Follow Us</h4>
                <div className="social-links text-center text-lg-end pt-3 pt-lg-0">
                  {generalSettings.youtube_link && (
                    <a href={generalSettings.youtube_link} target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                      <Image src={Youtube.src} alt="Youtube" width={20} height={20} />
                    </a>
                  )}
                  {generalSettings.fb_link && (
                    <a href={generalSettings.fb_link} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <Image src={Facebook.src} alt="Facebook" width={20} height={20} />
                    </a>
                  )}
                  {generalSettings.insta_link && (
                    <a href={generalSettings.insta_link} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <Image src={Instagram.src} alt="Instagram" width={20} height={20} />
                    </a>
                  )}
                  {generalSettings.linkdin_link && (
                    <a href={generalSettings.linkdin_link} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <Image src={LinkedIn.src} alt="LinkedIn" width={20} height={20} />
                    </a>
                  )}


                  <a href="https://share.google/POkhvSgeRk9jHEipd" target="_blank" rel="noopener noreferrer" aria-label="Google">
                    <FaGoogle size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-12">
              <div className="copyright text-center text-lg-start">
                © {currentYear} <strong><span>{generalSettings.website_name}</span></strong>. {generalSettings.footer_copyright}
              </div>
            </div>
          </div>
        </div>
      </footer>
      {generalSettings.whatsapp_no && (
        <WhatsAppFloat phoneNumber={generalSettings.whatsapp_no.replace(/\D/g, '')} />
      )}
      
      {/* Appointment Modal - Matching Header.js implementation */}
      <Modal 
        show={show} 
        onHide={handleClose} 
        centered
        size="sm"
        dialogClassName="appointment-modal-compact"
        restoreFocus={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Please Book Appointment</Modal.Title>
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

// Memoize Footer component to prevent unnecessary re-renders
export default React.memo(Footer);