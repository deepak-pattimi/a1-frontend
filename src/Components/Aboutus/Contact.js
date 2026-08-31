import React, { useState } from "react";
import { useRouter } from 'next/router';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosConfig";
import { GOOGLE_MAP_IFRAME } from "../constants";
import styles from "../../styles/Contact.module.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

import { getImageUrl } from "../../utils/imageUtils";

function Contact({ generalSettings }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullname: "",
    mobile: "",
    email: "",
    reason: "",
    doctor: "",
    other_reason: "",
    message: "",
  });
  
  const [diseases, setDiseases] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [heroImage, setHeroImage] = useState('/premium_hospital_hero.png');

  React.useEffect(() => {
    const fetchContactPage = async () => {
      try {
        const response = await axiosInstance.get('get-contact-page');
        if (response.data && response.data.hero_image) {
          setHeroImage(getImageUrl(response.data.hero_image));
        }
      } catch (error) {
        console.error("Error fetching contact page settings:", error);
      }
    };
    
    const fetchDiseases = async () => {
      try {
        const response = await axiosInstance.get('get-appointment-diseases');
        if (response.data) {
          setDiseases(response.data);
        }
      } catch (error) {
        console.error("Error fetching diseases:", error);
      }
    };
    
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get('get-doctors');
        if (response.data) {
          setDoctors(response.data);
          // Auto-select if there is only 1 doctor
          if (response.data.length === 1 && !formData.doctor) {
            setFormData(prev => ({ ...prev, doctor: response.data[0].name }));
          }
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    
    fetchContactPage();
    fetchDiseases();
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.fullname || !formData.mobile || !formData.reason || !formData.message) {
        toast.error('Please fill all required fields');
        return;
      }
      if (!/^\d{10}$/.test(formData.mobile)) {
        toast.error('Please enter a valid 10-digit mobile number');
        return;
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      let finalReason = formData.reason;
      if (formData.reason === 'Other') {
        if (!formData.other_reason || formData.other_reason.trim() === '') {
          toast.error('Please specify your problem');
          return;
        }
        finalReason = formData.other_reason;
      }

      setSubmitting(true);
      const payload = { ...formData, reason: finalReason };
      const response = await axiosInstance.post(`contact`, payload);

      if (response.data.status === 200) {
        toast.success(response.data.message || 'Message sent successfully!');
        setFormData({
          fullname: '',
          mobile: '',
          email: '',
          reason: '',
          doctor: formData.doctor, // preserve doctor selection
          other_reason: '',
          message: ''
        });
      }
    } catch (error) {
      if (error.isNetworkError || error.isTimeoutError || !error.response) return;
      if (error.response) {
        if (error.response.status === 400) {
          const errors = error.response.data.message;
          if (typeof errors === 'object') {
            Object.values(errors).forEach(err => toast.error(Array.isArray(err) ? err[0] : err));
          } else {
            toast.error(errors);
          }
        } else if (error.response.status === 500) {
          toast.error('Server error. Please try again later.');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setFormData({ ...formData, [id || name]: value });
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', paddingBottom: '3rem' }}>
      <h1 className="visually-hidden">Contact A1 Laparoscopy Hospital - Book Appointment in Visakhapatnam</h1>
      
      {/* Premium Hero Section */}
      <div 
        className={styles.heroSection} 
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className={styles.glassOverlay}>
          <h2 className={styles.heroTitle}>Get in Touch</h2>
          <p className={styles.heroSubtitle}>We're here to help you on your journey to better health.</p>
        </div>
      </div>

      <div className={styles.contactContainer}>
        {/* Contact Info Cards */}
        <div className={styles.infoCardsContainer}>
          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}><FaPhoneAlt /></div>
            <h3 className={styles.infoTitle}>Call Us 24/7</h3>
            <p className={styles.infoText}>{generalSettings?.header_phone || '+91 78292 22111'}</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}><FaEnvelope /></div>
            <h3 className={styles.infoTitle}>Email Us</h3>
            <p className={styles.infoText}>{generalSettings?.header_email || 'info@a1laparoscopyhospital.com'}</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}><FaMapMarkerAlt /></div>
            <h3 className={styles.infoTitle}>Our Location</h3>
            <p className={styles.infoText}>{generalSettings?.address || 'Maharani Peta, Visakhapatnam, Andhra Pradesh 530002'}</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}><FaClock /></div>
            <h3 className={styles.infoTitle}>Working Hours</h3>
            <p className={styles.infoText}>{generalSettings?.working_hours || '24/7 Emergency Care'}</p>
          </div>
        </div>

        {/* Main Content (Map & Form) */}
        <div className={styles.mainContent}>
          {/* Left Side: Map */}
          <div className={styles.mapSection}>
            <iframe
              src={generalSettings?.google_maps_url || GOOGLE_MAP_IFRAME}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="A1 Laparoscopy Hospital Location"
            ></iframe>
          </div>

          {/* Right Side: Form */}
          <div className={styles.formSection}>
            <h3 className={styles.formTitle}>Book an Appointment</h3>
            <p className={styles.formSubtitle}>Fill out the form below and our team will get back to you shortly.</p>

            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Full Name*"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className={styles.premiumInput}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Mobile Number*"
                  value={formData.mobile}
                  onChange={handleChange}
                  id="mobile"
                  name="mobile"
                  className={styles.premiumInput}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.premiumInput}
                />
              </div>

              <div className={styles.inputGroup}>
                <select
                  className={`${styles.premiumInput} ${styles.premiumSelect}`}
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Problem* --</option>
                  {diseases.map((disease) => (
                    <option key={disease.id} value={disease.name}>
                        {disease.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.reason === 'Other' && (
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Please specify your problem*"
                    value={formData.other_reason}
                    onChange={handleChange}
                    id="other_reason"
                    name="other_reason"
                    className={styles.premiumInput}
                    required
                  />
                </div>
              )}

              <div className={styles.inputGroup}>
                {doctors.length === 1 ? (
                    <input
                        type="text"
                        className={styles.premiumInput}
                        name="doctor"
                        id="doctor"
                        value={doctors[0].name + (doctors[0].designation ? ` (${doctors[0].designation})` : '')}
                        readOnly
                        style={{ cursor: 'not-allowed', color: '#718096' }}
                    />
                ) : (
                    <select
                        className={`${styles.premiumInput} ${styles.premiumSelect}`}
                        id="doctor"
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleChange}
                    >
                        <option value="">Select Doctor (Optional)</option>
                        {doctors.map(doc => (
                            <option key={doc.id} value={doc.name}>
                                {doc.name} {doc.designation ? `(${doc.designation})` : ''}
                            </option>
                        ))}
                    </select>
                )}
              </div>

              <div className={styles.inputGroup}>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please tell us your concern in detail*"
                  className={`${styles.premiumInput} ${styles.premiumTextarea}`}
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Book Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;