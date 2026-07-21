import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import loader from "../../assets/loader/loader.gif";
import { getImageUrl } from "@/utils/imageUtils";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [formData, setFormData] = useState({ name: '', rating: '5', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`get-reviews-list`);
      if (response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to strip HTML tags from content (SSR safe)
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await axiosInstance.post('submit-review', formData);
      if (res.data.status === 200) {
        setMessage(res.data.message);
        setFormData({ name: '', rating: '5', content: '' });
        fetchReviews(); // Refresh list
      } else {
        setMessage('Error submitting review.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="reviews-section py-5 bg-light">
      <div className="container">
        <div className="section-title text-center mb-5">
          <span className="badge rounded-pill bg-white text-primary px-3 py-2 mb-3 shadow-sm border" style={{ letterSpacing: '1px', fontWeight: '600' }}>TESTIMONIALS</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2c4964' }}>Patient Reviews</h2>
        </div>
        {loading ? (
          <div className="text-center my-5">
            <img src={loader.src} alt="Loading..." style={{ height: "50px" }} />
          </div>
        ) : (
          <div className="row g-4">
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const text = stripHtml(review.content);
                const isExpanded = expanded[review.id];
                const shouldTruncate = text.length > 150;
                const displayText = !shouldTruncate || isExpanded ? text : text.slice(0, 150) + "...";

                return (
                  <div className="col-lg-4 col-md-6 mb-4 d-flex" key={review.id}>
                    <div className="card shadow-sm border-0 h-100 w-100 p-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa fa-star mx-1 ${i < parseInt(review.rating) ? 'text-warning' : 'text-muted'}`}
                            ></i>
                          ))}
                        </div>
                        <div className="review-date text-muted small">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <h5 className="font-weight-bold mb-3">{review.name}</h5>

                      {review.image && (
                        <div className="review-image mb-3 text-center">
                          <img
                            src={getImageUrl(review.image)}
                            alt={`${review.name}'s review`}
                            className="img-fluid rounded"
                            style={{ maxHeight: '150px', objectFit: 'cover' }}
                          />
                        </div>
                      )}

                      <div className="customerimg mb-3 flex-grow-1">
                        <p className="text-muted" style={{ lineHeight: '1.6' }}>
                          {displayText}
                        </p>
                        {shouldTruncate && (
                          <button 
                            className="btn btn-link p-0 text-primary fw-bold" 
                            style={{ textDecoration: 'none' }}
                            onClick={() => toggleExpand(review.id)}
                          >
                            {isExpanded ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center">
                <p>No reviews available</p>
              </div>
            )}
          </div>
        )}

        <div className="row justify-content-center mt-5">
          <div className="col-md-8">
            <div className="card shadow-sm border-0 p-4">
              <h4 className="mb-4">Submit Your Review</h4>
              {message && <div className="alert alert-info">{message}</div>}
              <form onSubmit={handleSubmitReview}>
                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <select className="form-select" name="rating" value={formData.rating} onChange={handleInputChange} required>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Your Review</label>
                  <textarea className="form-control" name="content" rows="4" value={formData.content} onChange={handleInputChange} required></textarea>
                </div>
                <button type="submit" className="btn btn-success px-4" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
