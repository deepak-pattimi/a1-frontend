import React, { useState } from "react";
import { useRouter } from 'next/router';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosConfig";
import { GOOGLE_MAP_IFRAME } from "../constants";

function Contact() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/Aboutdr");
  };

  // contact us
  const [emptyData, setEmptyData] = useState({
    name: "",
    email: "",
    mobile: "",
    reason: "",
    doctor: "",
    message: "",
  });
  const [formData, setFormData] = useState({});
  const [diseases, setDiseases] = useState([]);
  const [doctors, setDoctors] = useState([]);

  React.useEffect(() => {
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
          if (response.data.length === 1 && (!formData || !formData.doctor)) {
            setFormData(prev => ({ ...prev, doctor: response.data[0].name }));
          }
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    
    fetchDiseases();
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data
      if (!formData.fullname || !formData.mobile || !formData.reason || !formData.message) {
        toast.error('Please fill all required fields');
        return;
      }

      // Validate mobile number
      if (!/^\d{10}$/.test(formData.mobile)) {
        toast.error('Please enter a valid 10-digit mobile number');
        return;
      }

      // Validate email if provided
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

      const payload = { ...formData, reason: finalReason };

      const response = await axiosInstance.post(
        `contact`,
        payload
      );

      if (response.data.status === 200) {
        toast.success(response.data.message);
        // Reset form
        setFormData({
          fullname: '',
          mobile: '',
          email: '',
          reason: '',
          message: ''
        });
      }
    } catch (error) {
      // Network errors are already handled by axios interceptor
      if (error.isNetworkError || error.isTimeoutError || !error.response) {
        return;
      }

      if (error.response) {
        if (error.response.status === 400) {
          // Validation errors
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
    }
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };



  return (
    <div>
      {/* SEO: Main heading for contact page */}
      <h1 className="visually-hidden">Contact A1 Laparoscopy Hospital - Book Appointment in Visakhapatnam</h1>
      
      <div id="drpadmanabhavarma">
        <div className="container">


          <div className="bookappointment my-4">
            <div className="row">
              <h2 className="font-weight-bold px-4 py-2 text-dark text-center mb-3">
                Contact us
              </h2>
              <div className="col-md-8">
                <iframe
                  src={GOOGLE_MAP_IFRAME}
                  width="600"
                  height="450"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="col-md-4">
                <div className="formSubmit">
                  <p>We Are Ready To Help You With A Smile!</p>
                  <h4 className="font-weight-bold">
                    <i className="fa fa-cell"></i>Call Us:{" "}
                    <span className="colorora">+91 78292 22111</span>
                  </h4>

                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Fullname*"
                      name="fullname"
                      id="fullname"
                      value={formData ? formData.fullname : ""}
                      onChange={handleChange}
                      className="form-control mb-3"
                    />

                    <input
                      type="text"
                      placeholder="Mobile*"
                      value={formData ? formData.mobile : ""}
                      onChange={handleChange}
                      id="mobile"
                      name="mobile"
                      className="form-control mb-3"
                    />

                    <input
                      type="email"
                      placeholder="Email*"
                      name="email"
                      id="email"
                      value={formData ? formData.email : ""}
                      onChange={handleChange}
                      className="form-control mb-3"
                    />

                    <select
                      className="form-control mb-3"
                      id="reason"
                      name="reason"
                      value={formData ? formData.reason : ""}
                      onChange={handleChange}
                    >
                      <option>--select problem--</option>
                      {diseases.map((disease) => (
                          <option key={disease.id} value={disease.name}>
                              {disease.name}
                          </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>

                    <label>Doctor's Name</label>
                    {doctors.length === 1 ? (
                        <input
                            type="text"
                            className="form-control mb-3"
                            name="doctor"
                            id="doctor"
                            value={doctors[0].name + (doctors[0].designation ? ` (${doctors[0].designation})` : '')}
                            readOnly
                            style={{ backgroundColor: '#fff' }}
                        />
                    ) : (
                        <select
                            className="form-control mb-3"
                            id="doctor"
                            name="doctor"
                            value={formData ? formData.doctor : ""}
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

                    {formData && formData.reason === 'Other' && (
                      <input
                        type="text"
                        placeholder="Please specify your problem name*"
                        value={formData.other_reason || ""}
                        onChange={handleChange}
                        id="other_reason"
                        name="other_reason"
                        className="form-control mb-3"
                        required
                      />
                    )}
                    <div className="my-3">
                      <textarea
                        id="message"
                        name="message"
                        value={formData ? formData.message : ""}
                        onChange={handleChange}
                        placeholder="Please tell us your concern in detail"
                        className="form-control my-3"
                      ></textarea>
                    </div>
                    <div className="my-3">
                      <button className="bookapp my-4 w-100">
                        Book Appointment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;