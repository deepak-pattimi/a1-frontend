import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Paper, Divider } from '@mui/material';
import { Call as CallIcon } from '@mui/icons-material';
import { Modal, Button, Nav, NavDropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaPlay, FaFacebookF, FaInstagram, FaLinkedin, FaGoogle } from 'react-icons/fa';
import AppointmentForm from '../Components/AppointmentForm';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUtils';
import axiosInstance from '../utils/axiosConfig';

import { API_URL } from './constants';



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

const SearchBar = ({ generalSettings }) => (
  <Paper
    component="div"
    elevation={0}
    sx={{
      p: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'transparent'
    }}
  >
    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" className="mobile-hide" />
    <div className="social-links text-center text-lg-right pt-lg-0">
      {generalSettings?.youtube_link && (
        <a href={generalSettings.youtube_link} target="_blank" rel="noopener noreferrer" className="social-icon youtube">
          <FaPlay size={14} style={{ marginLeft: '3px' }} />
        </a>
      )}
      {generalSettings?.fb_link && (
        <a href={generalSettings.fb_link} target="_blank" rel="noopener noreferrer" className="social-icon facebook">
          <FaFacebookF size={16} />
        </a>
      )}
      {generalSettings?.insta_link && (
        <a href={generalSettings.insta_link} target="_blank" rel="noopener noreferrer" className="social-icon instagram">
          <FaInstagram size={18} />
        </a>
      )}
      {generalSettings?.linkdin_link && (
        <a href={generalSettings.linkdin_link} target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
          <FaLinkedin size={16} />
        </a>
      )}
      <a href="https://share.google/POkhvSgeRk9jHEipd" target="_blank" rel="noopener noreferrer" className="social-icon google">
        <FaGoogle size={16} />
      </a>
    </div>
  </Paper>
);

const Header = ({ generalSettings, categories }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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


  return (
    <>
      <div className="top-header-section">


        <div className="container">
          <div className="headerSection">
            <div className="logo_Section">
              {generalSettings?.header_logo && (
                <Link href="/">
                  <Image 
                    src={getImageUrl(generalSettings.header_logo)} 
                    alt="Company Logo" 
                    width={250}
                    height={80}
                    style={{ maxHeight: '80px', width: 'auto', objectFit: 'contain' }}
                  />

                </Link>
              )}

            </div>

            <div className="search_Section">
              <SearchBar generalSettings={generalSettings} />
            </div>

            <div className="contact_section">
              <div className="callsection">
                <div className="phoneImg">
                  {generalSettings?.header_phone ? (
                    <a href={`tel:${generalSettings.header_phone}`} style={{ color: 'inherit', display: 'inline-block' }}>
                      <CallIcon />
                    </a>
                  ) : (
                    <CallIcon />
                  )}
                </div>
                <div className="callus">
                  <p className="py-0 my-0 text-left1">Call Us 24/7</p>
                  {generalSettings?.header_phone && (
                    <a className="py-0 my-0 classnumber" href={`tel:${generalSettings.header_phone}`}>
                      {generalSettings.header_phone}
                    </a>
                  )}
                </div>
              </div>

              <div className="bookappointment">
                <Button className="radiusBtn" onClick={handleShow}>
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="headerHome">
        <div className="container">
          <div className="logo-container">
            <div className="nav-btn">
              <div className="nav-links">
                <ul className="ul-nav1">
                  <li className="nav-link">
                    <Link href="/">
                      <i className="fa fa-home" style={{ fontSize: "20px" }}></i>
                    </Link>
                  </li>

                  {/* Dynamic Categories - Each category is a top-level menu item */}
                  {!categories || categories.length === 0 ? (
                    <li className="nav-link">
                      <span style={{ color: '#999', fontStyle: 'italic' }}>Loading...</span>
                    </li>
                  ) : (
                    categories.map((category) => (
                      <li className="nav-link" key={category.id}>
                        <a href="#">
                          {category.name}
                          <i className="fas fa-caret-down"></i>
                        </a>
                        <div className="dropdown">
                          <ul className="ul-nav2">
                            {category.pages?.map((page) => (
                              <li className="dropdown-link" key={page.id}>
                                <Link href={`/page/${page.slug}`}>
                                  {page.page_name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))
                  )}

                  {/* Static Menu Items */}
                  <li className="nav-link">
                    <Link href="/blogs">Blogs</Link>
                  </li>


                  <li className="nav-link">
                    <a href="#">
                      About Doctor
                      <i className="fas fa-caret-down"></i>
                    </a>
                    <div className="dropdown">
                      <ul className="ul-nav2">
                        <li className="dropdown-link">
                          <Link href="/about-doctor">About Us</Link>
                        </li>
                        <li className="dropdown-link">
                          <Link href="/about-clinic">About Clinic</Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="nav-link">
                    <Link href="/Contact">Contact Us</Link>
                  </li>


                </ul>
              </div>
            </div>

            <div className="hamburger-menu-container">
              <div className="hamburger-menu">
                <div></div>
              </div>
            </div>
            <input type="checkbox" id="check" />
          </div>
        </div>

      </div>

      <Modal 
        show={show} 
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

// Memoize Header component to prevent unnecessary re-renders
export default React.memo(Header);
