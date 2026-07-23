import React, { useState } from 'react';
import loader from "../assets/loader/loader.gif";
import axiosInstance from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadRazorpay } from '../utils/dynamicScriptLoader';

const AppointmentForm = ({
    formData,
    handleChange,
    isModal = false,
    closeModal
}) => {
    const [loading, setLoading] = useState(false);
    const [diseases, setDiseases] = useState([]);
    
    const [doctors, setDoctors] = useState([]);
    const [timeSlots, setTimeSlots] = useState(['11:00 AM - 02:00 PM', '05:00 PM - 06:00 PM']);
    
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
                        handleChange({ target: { name: 'doctor', value: response.data[0].name } });
                    }
                }
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        const fetchSettings = async () => {
            try {
                const response = await axiosInstance.get('general-settings');
                if (response.data && response.data.appointment_time_slots) {
                    const slots = response.data.appointment_time_slots.split(',').map(s => s.trim()).filter(s => s);
                    if (slots.length > 0) {
                        setTimeSlots(slots);
                    }
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };

        fetchDiseases();
        fetchDoctors();
        fetchSettings();
    }, []);
    const [paymentMethod, setPaymentMethod] = useState('offline'); // default to offline
    const [amount] = useState(500); // default amount

    // Dedicated function to safely close the modal
    const safeCloseModal = () => {
        if (isModal && closeModal && typeof closeModal === 'function') {
            try {
                closeModal();
                return true;
            } catch (error) {
                // Try alternative ways to close the modal
                try {
                    // If there's a standard way to close modals in the app
                    const modalElement = document.querySelector('.modal-overlay') || document.querySelector('.modal');
                    if (modalElement) {
                        modalElement.style.display = 'none';
                    }
                } catch (domError) {
                    console.error('Error manipulating DOM to close modal:', domError);
                }
                return false;
            }
        }
        return false;
    };

    const disablePastDate = () => {
        const today = new Date();
        const dd = String(today.getDate() + 1).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    };

    // Handle time change and restrict between 10 AM - 6 PM
    const handleTimeChange = (e) => {
        handleChange(e);
    };

    // Handle payment method change
    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            console.log('Submitting appointment form with data:', {
                ...formData,
                payment_method: paymentMethod,
                amount: amount
            });

            // Form validation
            if (!formData.fullname?.trim()) {
                toast.error('Please enter your full name');
                setLoading(false);
                return;
            }

            if (!formData.mobile?.trim()) {
                toast.error('Please enter your mobile number');
                setLoading(false);
                return;
            }

            if (!/^\d{10}$/.test(formData.mobile)) {
                toast.error('Please enter a valid 10-digit mobile number');
                setLoading(false);
                return;
            }

            if (!formData.selected_date) {
                toast.error('Please select appointment date');
                setLoading(false);
                return;
            }

            if (!formData.selected_time) {
                toast.error('Please select appointment time');
                setLoading(false);
                return;
            }

            if (!formData.reason) {
                toast.error('Please select your problem');
                setLoading(false);
                return;
            }

            if (formData.reason === 'other_neurological' && !formData.other_reason?.trim()) {
                toast.error('Please specify your condition');
                setLoading(false);
                return;
            }

            // Prepare the final reason string
            let finalReason = formData.reason;
            if (finalReason === 'other_neurological') {
                finalReason = formData.other_reason ? `Other: ${formData.other_reason}` : 'Other Neurological Conditions';
            }

            // Add payment data to form
            const appointmentData = {
                ...formData,
                reason: finalReason,
                payment_method: paymentMethod,
                amount: amount
            };

            console.log('Sending appointment request to:', `appointment`);
            const response = await axiosInstance.post(`appointment`, appointmentData);
            console.log('Received response from server:', response.data);

            if (response.data.status === 200) {
                // For offline payments, show success message immediately
                if (paymentMethod === 'offline') {
                    toast.success('Appointment booked successfully!');

                    // Close modal if it's a modal form
                    if (isModal && closeModal) {
                        setTimeout(() => {
                            safeCloseModal();
                        }, 2000); // Wait for 2 seconds to show the success message
                    }
                }
                // For online payments, redirect to payment gateway
                else if (paymentMethod === 'online' && response.data.razorpay_order_id) {
                    console.log('Initializing Razorpay payment with options:', {
                        key: response.data.razorpay_key_id,
                        amount: response.data.amount,
                        currency: "INR",
                        name: "DR A NAVEEN A1 LAPAROSCOPY HOSPITAL LLP",
                        description: "Appointment Booking",
                        order_id: response.data.razorpay_order_id
                    });

                    // 9. Load Razorpay script dynamically only when needed for payment
                    try {
                        await loadRazorpay();
                        
                        // Check if Razorpay is loaded
                        if (typeof window.Razorpay === 'undefined') {
                            toast.error('Payment service is not available. Please try again later.');
                            setLoading(false);
                            return;
                        }
                    } catch (error) {
                        console.error('Failed to load Razorpay:', error);
                        toast.error('Failed to load payment service. Please check your connection and try again.');
                        setLoading(false);
                        return;
                    }

                    const options = {
                        key: response.data.razorpay_key_id,
                        amount: response.data.amount,
                        currency: "INR",
                        name: " DR A NAVEEN A1 LAPAROSCOPY HOSPITAL LLP",
                        description: "Appointment Booking",
                        order_id: response.data.razorpay_order_id,
                        handler: async function (razorpayResponse) {
                            console.log('Razorpay payment response:', razorpayResponse);

                            // Immediately show a temporary message while processing
                            const processingToast = toast.info('Processing payment, please wait...');

                            // Update payment status on backend
                            try {
                                // Remove the processing toast
                                try {
                                    toast.dismiss(processingToast);
                                } catch (dismissErr) {
                                    console.log('Toast dismiss error:', dismissErr);
                                }

                                // FIX: Using the correct endpoint without /client/
                                const paymentResponse = await axiosInstance.post(`update-payment-status`, {
                                    appointment_id: response.data.appointment_id,
                                    payment_status: 'completed',
                                    razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                                    razorpay_signature: razorpayResponse.razorpay_signature
                                });

                                console.log('Payment status update response:', paymentResponse.data);

                                if (paymentResponse.data.status === 200) {
                                    let successToastId;
                                    try {
                                        successToastId = toast.success('Payment completed successfully! Your appointment is now confirmed.');
                                    } catch (toastErr) {
                                        console.log('Toast error:', toastErr);
                                    }

                                    // Close modal if it's a modal form
                                    if (isModal && closeModal) {
                                        // Ensure loading state is reset before closing modal
                                        setLoading(false);

                                        // Close the modal after a short delay to show the success message
                                        setTimeout(() => {
                                            // Try to close any Razorpay popups first
                                            try {
                                                if (window.Razorpay && typeof window.Razorpay.close === 'function') {
                                                    window.Razorpay.close();
                                                }
                                            } catch (razorpayErr) {
                                                console.log('Could not close Razorpay popup:', razorpayErr);
                                            }

                                            // Then close our modal
                                            safeCloseModal();
                                        }, 2000);
                                    }
                                } else {
                                    toast.error('Payment verification failed. Please contact support.');
                                    setLoading(false);
                                }
                            } catch (error) {
                                // Remove the processing toast
                                toast.dismiss(processingToast);

                                console.error('Payment verification error:', error);
                                toast.error('Payment verification failed. Please contact support.');
                                setLoading(false);
                            }
                        },
                        prefill: {
                            name: formData.fullname,
                            email: formData.email,
                            contact: formData.mobile
                        },
                        theme: {
                            color: "#3399cc"
                        },
                        modal: {
                            ondismiss: function () {
                                toast.info('Payment cancelled. Your appointment will be confirmed after payment completion.');
                                setLoading(false);
                            }
                        }
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.on('payment.failed', function (response) {
                        console.log('Razorpay payment failed:', response);
                        toast.error('Payment failed. Please try again or contact support.');
                        setLoading(false);

                        // Close modal if it's a modal form
                        if (isModal && closeModal) {
                            setTimeout(() => {
                                safeCloseModal();
                            }, 2000);
                        }
                    });

                    // Add additional event listeners for better control
                    rzp.on('payment.success', function (response) {
                        console.log('Razorpay payment success event:', response);
                    });

                    rzp.on('payment.cancel', function (response) {
                        console.log('Razorpay payment cancel event:', response);
                    });

                    rzp.open();

                    // Add a safety timeout to ensure modal closes even if something goes wrong
                    if (isModal && closeModal) {
                        setTimeout(() => {
                            // Only close if still in loading state (meaning something might have gone wrong)
                            if (loading) {
                                setLoading(false);
                                safeCloseModal();
                            }
                        }, 60000); // 60 seconds safety timeout
                    }

                    // Don't show the "please complete payment" toast anymore as it's confusing
                    // Just let the Razorpay popup handle the user experience
                }
            }
        } catch (error) {
            console.error('Appointment submission error:', error);
            console.error('Error response:', error.response);

            // Network errors are already handled by axios interceptor
            if (error.isNetworkError || error.isTimeoutError || !error.response) {
                return;
            }

            if (error.response?.data?.message) {
                if (typeof error.response.data.message === 'object') {
                    Object.values(error.response.data.message).forEach(msg =>
                        toast.error(Array.isArray(msg) ? msg[0] : msg)
                    );
                } else {
                    toast.error(error.response.data.message);
                }
            } else {
                toast.error('Failed to book appointment. Please try again.');
            }

            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={isModal ? "" : "php-email-form"}>
            <div className="row">
                <div className="col-md-4 form-group mt-3 mt-md-0">
                    <label>Fullname*</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        name="fullname"
                        id="fullname"
                        value={formData?.fullname || ""}
                        onChange={handleChange}
                        className="form-control mb-3"
                    />
                </div>

                <div className="col-md-4 form-group mt-3 mt-md-0">
                    <label>Mobile*</label>
                    <input
                        type="number"
                        placeholder="Enter mobile number"
                        name="mobile"
                        id="mobile"
                        value={formData?.mobile || ""}
                        onChange={handleChange}
                        className="form-control mb-3"
                    />
                </div>

                <div className="col-md-4 form-group mt-3 mt-md-0">
                    <label>Email (Optional)</label>
                    <input
                        type="email"
                        placeholder="Enter email address"
                        name="email"
                        id="email"
                        value={formData?.email || ""}
                        onChange={handleChange}
                        className="form-control mb-3"
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-4 form-group mt-3">
                    <label id="c_date">Date</label>
                    <input
                        type="date"
                        name="selected_date"
                        id="selected_date"
                        min={disablePastDate()}
                        value={formData?.selected_date || ""}
                        onChange={handleChange}
                        className="form-control mb-3"
                    />
                </div>

                <div className="col-md-4 form-group mt-3">
                    <label id="c_time">Time</label>
                    <select
                        name="selected_time"
                        id="selected_time"
                        value={formData?.selected_time || ""}
                        onChange={handleChange}
                        className="form-control mb-3"
                    >
                        <option value="">--:--</option>
                        {timeSlots.map((slot, index) => (
                            <option key={index} value={slot}>{slot}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4 form-group mt-3">
                    <label id="c_reason">Select Problem</label>
                    <select
                        className="form-control mb-3"
                        name="reason"
                        id="reason"
                        onChange={handleChange}
                        value={formData?.reason || ""}
                    >
                        <option value="">Select Problem</option>
                        {diseases.map((disease) => (
                            <option key={disease.id} value={disease.name}>
                                {disease.name}
                            </option>
                        ))}
                        <option value="other_neurological">Other Conditions (Please Specify)</option>
                    </select>
                </div>
                
                <div className="col-md-12 form-group mt-3">
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
                            name="doctor"
                            id="doctor"
                            onChange={handleChange}
                            value={formData?.doctor || ""}
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
                
                {formData?.reason === 'other_neurological' && (
                    <div className="col-md-12 form-group mt-3">
                        <input
                            type="text"
                            placeholder="Please specify your condition name"
                            name="other_reason"
                            id="other_reason"
                            value={formData?.other_reason || ""}
                            onChange={handleChange}
                            className="form-control mb-3"
                        />
                    </div>
                )}
            </div>

            <div className="form-group mt-3">
                <textarea
                    placeholder="Please describe your neurological symptoms or concerns in detail"
                    name="message"
                    id="message"
                    value={formData?.message || ""}
                    onChange={handleChange}
                    className="form-control my-3"
                    rows={isModal ? 2 : 5}
                />
            </div>


            {/* Payment Section */}
            <div className="form-group mt-3">
                <label><strong>Payment Method</strong></label>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="payment_method"
                        id="offline_payment"
                        value="offline"
                        checked={paymentMethod === 'offline'}
                        onChange={handlePaymentMethodChange}
                    />
                    <label className="form-check-label" htmlFor="offline_payment">
                        Offline Payment (Pay at clinic)
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="payment_method"
                        id="online_payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={handlePaymentMethodChange}
                    />
                    <label className="form-check-label" htmlFor="online_payment">
                        Online Payment (Razorpay)
                    </label>
                </div>
            </div>

            <div className="form-group mt-3">
                <label><strong>Consultation Fee: ₹{amount}</strong></label>
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    className={`btn btn-primary ${isModal ? 'mt-3 w-100' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <img src={loader.src} alt="Loading..." style={{ height: "20px" }} />
                    ) : (
                        paymentMethod === 'online' ? 'Book Appointment & Pay Online' : 'Book Appointment'
                    )}
                </button>
            </div>
        </form>
    );
};

export default AppointmentForm;