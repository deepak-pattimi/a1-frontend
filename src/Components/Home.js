import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
// CSS imports moved to _app.js
import Madampic from "../assets/madampic.png";
import Shieldpic from "../assets/sheildpic.png";
import axiosInstance from "../utils/axiosConfig";
import loader from "../assets/loader/loader.gif";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { API_URL, GOOGLE_MAP_IFRAME, ASSETS_URL } from "./constants";
import { getImageUrl } from "@/utils/imageUtils";
import parse from "html-react-parser";
import Reviews from "./PatientGuide/Reviews";



// Dynamic imports for heavy components
const Carousel = dynamic(() => import('react-responsive-carousel').then(mod => mod.Carousel), {
  ssr: false,
  loading: () => <div className="text-center p-5">Loading carousel...</div>
});

const Aos = typeof window !== 'undefined' ? require('aos') : null;



function Home({ initialBanners, initialSpecialized, initialDepartments }) {

  const router = useRouter();

  // Function to generate slug from title
  const generateSlug = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  const handleSpecializationClick = (id, title) => {
    const slug = generateSlug(title);
    router.push(`/page/${slug}`);
  };

  const handleClick = () => {
    router.push("/Aboutdr");
  };
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState(initialBanners || []);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [highlightLoading, setHighlightLoading] = useState(true);
  const [firstgallery, setFirstgallery] = useState([]);
  const [firstgalleryLoading, setFirstgalleryLoading] = useState(true);
  const [aboutitems, setAboutitems] = useState([]);
  const [aboutitemsLoading, setAboutitemsLoading] = useState(true);
  const [specialized, setSpecialized] = useState(initialSpecialized || []);
  const [specializedLoading, setSpecializedLoading] = useState(false);
  const [depratments, setDepratments] = useState(initialDepartments || []);
  const [depratmentsLoading, setDepratmentsLoading] = useState(false);
  
  const [h2Section, setH2Section] = useState(null);
  const [h2SectionLoading, setH2SectionLoading] = useState(true);
  // Gallery is loaded client-side only to keep SSR payload small
  const [imagegallery, setImagegallery] = useState([]);
  const [imagegalleryLoading, setImagegalleryLoading] = useState(true);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [emptyData, setEmptyData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    selected_date: "",
    selected_time: "",
    reason: "",
    message: "",
  });
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Form validation
    if (!formData.fullname.trim()) {
      toast.error("Please enter your full name");
      setLoading(false);
      return;
    }

    if (!formData.mobile.trim()) {
      toast.error("Please enter your mobile number");
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    if (!formData.selected_date) {
      toast.error("Please select appointment date");
      setLoading(false);
      return;
    }

    if (!formData.selected_time) {
      toast.error("Please select appointment time");
      setLoading(false);
      return;
    }

    if (!formData.reason) {
      toast.error("Please select your problem");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(`appointment`, formData);

      if (response.data.status === 200) {
        // For offline payments, show success message immediately
        if (formData.payment_method === 'offline' || !formData.payment_method) {
          toast.success("Appointment booked successfully!");
        }
        // For online payments, show message about payment
        else if (formData.payment_method === 'online') {
          toast.info("Please complete the payment to confirm your appointment!");
        }
      }
    } catch (error) {
      // Network errors are already handled by axios interceptor
      if (error.isNetworkError || error.isTimeoutError || !error.response) {
        return;
      }

      if (error.response?.data?.message) {
        if (typeof error.response.data.message === "object") {
          Object.values(error.response.data.message).forEach((msg) =>
            toast.error(Array.isArray(msg) ? msg[0] : msg)
          );
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("Failed to book appointment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && Aos) {
      Aos.init({ duration: 2000 });
    }
  }, []);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setHighlightLoading(true);
        const response = await axiosInstance.get(`get-highlights-list`);
        if (response.data && Array.isArray(response.data)) {
          const sortedHighlights = response.data.sort((a, b) => a.order_position - b.order_position);
          setHighlights(sortedHighlights);
        }
      } catch (error) {
        toast.error("Failed to load highlights");
      } finally {
        setHighlightLoading(false);
      }
    };

    const fetchFirstgallery = async () => {
      try {
        setFirstgalleryLoading(true);
        const response = await axiosInstance.get(`get-firstgallery-list`);
        if (response.data && Array.isArray(response.data)) {
          const sortedFirstgallery = response.data.sort((a, b) => a.order_position - b.order_position);
          setFirstgallery(sortedFirstgallery);
        }
      } catch (error) {
        toast.error("Failed to load first gallery");
      } finally {
        setFirstgalleryLoading(false);
      }
    };

    const fetchAboutitems = async () => {
      try {
        setAboutitemsLoading(true);
        const response = await axiosInstance.get(`get-aboutitems-list`);
        if (response.data && Array.isArray(response.data)) {
          const sortedAboutitems = response.data.sort((a, b) => a.order_position - b.order_position);
          setAboutitems(sortedAboutitems);
        }
      } catch (error) {
        toast.error("Failed to load about items");
      } finally {
        setAboutitemsLoading(false);
      }
    };

    // home h2 section api
    const getHomeH2Section = () => {
      axiosInstance
        .get("get-home-h2")
        .then((res) => {
          setH2Section(res.data);
          setH2SectionLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setH2SectionLoading(false);
        });
    };

    // Load content not provided via SSR
    const loadRemainingContent = async () => {
      await Promise.all([
        fetchHighlights(),
        fetchFirstgallery(),
        fetchAboutitems()
      ]);
      getHomeH2Section();
    };

    loadRemainingContent();
  }, []);

  // Load gallery client-side only (too large for SSR props)
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axiosInstance.get('get-imagegallery-list');
        if (response.data && Array.isArray(response.data)) {
          const sorted = response.data
            .sort((a, b) => a.order_position - b.order_position)
            .slice(0, 8); // Only show 8 on homepage
          setImagegallery(sorted);
        }
      } catch (error) {
        // Gallery is non-critical, fail silently
      } finally {
        setImagegalleryLoading(false);
      }
    };
    fetchGallery();
  }, []);



  // contact us

  const [emptyDatac, setEmptyDatac] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formDatac, setFormDatac] = useState({});

  const handleSubmitc = (event) => {
    event.preventDefault();

    axiosInstance
      .post(
        `contact_request`,
        formDatac,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setFormDatac(emptyDatac);
        handleClose(true);
      })
      .catch((err) => {
        // Network errors are already handled by axios interceptor
        if (err.isNetworkError || err.isTimeoutError || !err.response) {
          return;
        }

        if (err.response?.data) {
          if (err.response.data.status === 500) {
            toast.error("Server Error");
          }
          if (
            err.response.data.status === 400 ||
            err.response.data.status === 401
          ) {
            if (typeof err.response.data.message === "object") {
              for (var key in err.response.data.message) {
                toast.error(err.response.data.message[key][0]);
              }
            } else {
              toast.error(err.response.data.message);
            }
          }
        }
      });
  };
  const handleChangec = (e) => {
    const { id, value } = e.target;
    setFormDatac({ ...formDatac, [id]: value });
  };

  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  return (
    <div>
      <div>
        {banners.length > 0 ? (
          <div className="banner-carousel" style={{ minHeight: '400px' }}>

            {/* SEO: Main heading for homepage */}
            <h1 className="visually-hidden">Best Laparoscopic Surgeon in Visakhapatnam – Affordable Minimally Invasive Surgery</h1>
            <Carousel
              showArrows={true}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={3000}
              showStatus={false}
              dynamicHeight={true}
              emulateTouch={true}
              swipeable={true}
              stopOnHover={true}
              className="custom-carousel"
            >
              {banners.map((banner, index) => (
                <div key={banner.id} className="banner-slide">
                  <Image
                    src={getImageUrl(banner.image)}
                    alt={banner.title || banner.alt || `A1 Laparoscopy Hospital Banner ${index + 1}`}
                    className="banner-image"
                    priority={index === 0}
                    width={1920}
                    height={1080}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />

                  {banner.link && (
                    <a
                      href={banner.link}
                      className="banner-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="banner-content">
                        {banner.title && <h3>{banner.title}</h3>}
                        {banner.description && <p>{banner.description}</p>}
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </Carousel>
          </div>
        ) : bannerLoading ? (
          <div className="text-center p-5">
            <p>Loading banners...</p>
          </div>
        ) : (
          <div className="text-center p-5">
            <p>No banners available</p>
          </div>
        )}

        {/* End Hero */}

        {/* ======= About Section ======= */}
        <section id="about" className="about-section py-5">
          <style>{`
            .about-section {
              background: #fff;
              overflow: hidden;
            }
            .about-image-container {
              position: relative;
              padding: 20px;
            }
            .about-image-main {
              border-radius: 20px;
              box-shadow: 0 15px 35px rgba(0,0,0,0.1);
              width: 100%;
              z-index: 2;
              position: relative;
            }
            .about-experience-badge {
              position: absolute;
              bottom: 0;
              right: 0;
              background: linear-gradient(135deg, #fb8110, #e85d04);
              color: white;
              padding: 25px;
              border-radius: 20px;
              text-align: center;
              box-shadow: 0 10px 25px rgba(251,129,16,0.3);
              z-index: 3;
              min-width: 150px;
            }
            .about-experience-badge span {
              display: block;
              font-size: 2.5rem;
              font-weight: 800;
              line-height: 1;
            }
            .about-experience-badge p {
              margin: 0;
              font-size: 0.9rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .about-content h2 {
              color: #2c4964;
              font-weight: 700;
              font-size: 2.5rem;
              margin-bottom: 25px;
            }
            .about-content p {
              color: #5a6a7a;
              line-height: 1.8;
              font-size: 1.05rem;
              margin-bottom: 30px;
            }
            .about-features {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .about-feature-item {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .about-feature-item i {
              color: #fb8110;
              font-size: 18px;
            }
            .about-feature-item span {
              font-weight: 600;
              color: #2c4964;
            }
          `}</style>
          <div className="container" data-aos="fade-up">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="about-image-container">
                  <Image 
                    src={h2Section?.image ? getImageUrl(h2Section.image) : getImageUrl('storage/files/1/Gallery/About Main.jpg')} 
                    alt="A1 Hospital Building" 
                    className="about-image-main rounded shadow"
                    width={600}
                    height={400}
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-content ps-lg-5">
                  <span className="badge rounded-pill bg-light text-primary px-3 py-2 mb-3 border">{h2Section?.badge_title || 'WHO WE ARE'}</span>
                  <h2>{h2Section?.heading || 'Pioneering Advanced Surgical Care in Vizag'}</h2>
                  <p>
                    {h2Section?.description || 'A1 Laparoscopy Hospital is a premier medical institution dedicated to providing state-of-the-art minimally invasive surgical solutions. Led by renowned experts, we combine technological innovation with compassionate care to ensure the best possible outcomes for our patients.'}
                  </p>
                  
                  <div className="about-features mb-4">
                    {(h2Section?.features || ['Advanced ICU Facility', '24/7 Emergency Care', 'Expert Surgeons', 'Affordable Treatment']).map((feature, idx) => (
                      <div className="about-feature-item" key={idx}>
                        <i className="fas fa-check-circle"></i>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary btn-lg px-4" style={{ backgroundColor: '#2c4964', border: 'none', borderRadius: '30px' }} onClick={() => router.push('/Aboutdr')}>
                    Read More About Us
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Stats Row */}
            <div className="row mt-5 pt-3">
              <div className="col-12">
                <div className="d-flex flex-wrap justify-content-around align-items-center text-center p-4 bg-white rounded shadow-sm border border-light">
                  {h2Section?.stat_1_value && (
                    <div className="p-3 mx-2">
                      <h2 style={{ color: '#fb8110', fontWeight: '800', fontSize: '2.5rem', marginBottom: '5px' }}>{h2Section.stat_1_value}</h2>
                      <h6 className="text-secondary fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{h2Section.stat_1_text}</h6>
                    </div>
                  )}
                  
                  {h2Section?.stat_2_value && (
                    <div className="p-3 mx-2">
                      <h2 style={{ color: '#fb8110', fontWeight: '800', fontSize: '2.5rem', marginBottom: '5px' }}>{h2Section.stat_2_value}</h2>
                      <h6 className="text-secondary fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{h2Section.stat_2_text}</h6>
                    </div>
                  )}

                  {h2Section?.stat_3_value && (
                    <div className="p-3 mx-2">
                      <h2 style={{ color: '#fb8110', fontWeight: '800', fontSize: '2.5rem', marginBottom: '5px' }}>{h2Section.stat_3_value}</h2>
                      <h6 className="text-secondary fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{h2Section.stat_3_text}</h6>
                    </div>
                  )}

                  {h2Section?.stat_4_value && (
                    <div className="p-3 mx-2">
                      <h2 style={{ color: '#fb8110', fontWeight: '800', fontSize: '2.5rem', marginBottom: '5px' }}>{h2Section.stat_4_value}</h2>
                      <h6 className="text-secondary fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{h2Section.stat_4_text}</h6>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <main id="main">



          {/* ======= Services Section ======= */}
          <section id="services" className="services services">
            <div className="container">

              <div className="container" data-aos="fade-up">
                <div className="section-title">
                  <span className="badge rounded-pill bg-light text-primary px-3 py-2 mb-3 shadow-sm border" style={{ letterSpacing: '1px', fontWeight: '600' }}>OUR EXPERTISE</span>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2c4964' }}>Specialized Services</h2>
                  <p className="mx-auto" style={{ maxWidth: '800px', color: '#5a6a7a' }}>
                    We provide world-class, comprehensive care for a wide range of surgical conditions using minimally invasive techniques. Our hospital specializes in laparoscopic and bariatric surgeries with a focus on patient safety and faster recovery.
                  </p>
                </div>

                <div className="row g-4">
                  <style>{`
                  .service-card {
                    background: #fff;
                    border-radius: 15px;
                    padding: 35px 25px;
                    height: 100%;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    position: relative;
                    overflow: hidden;
                    z-index: 1;
                  }
                  .service-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 0;
                    background: linear-gradient(135deg, #2c4964 0%, #1a365d 100%);
                    transition: all 0.4s ease;
                    z-index: -1;
                  }
                  .service-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(44, 73, 100, 0.15);
                  }
                  .service-card:hover::before {
                    height: 100%;
                  }
                  .service-card:hover .service-icon {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1) rotate(5deg);
                  }
                  .service-card:hover .service-title a, 
                  .service-card:hover .service-description {
                    color: #fff !important;
                  }
                  .service-icon {
                    width: 70px;
                    height: 70px;
                    background: #f0f7ff;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 25px;
                    transition: all 0.3s ease;
                  }
                  .service-title {
                    font-size: 1.35rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                  }
                  .service-title a {
                    color: #2c4964;
                    text-decoration: none;
                    transition: all 0.3s ease;
                  }
                  .service-description {
                    color: #6c757d;
                    line-height: 1.6;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                  }
                `}</style>
                  {specialized.map((item) => (
                    <div key={item.id} className="col-lg-4 col-md-6">
                      <div
                        className="service-card"
                        onClick={() => handleSpecializationClick(item.id, item.title)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="service-icon">
                          {item.image ? (
                            <Image
                              src={getImageUrl(item.image)}
                              alt={item.title || ''}
                              width={45}
                              height={45}
                              style={{ objectFit: 'contain' }}
                            />
                          ) : (
                            <i className="fas fa-heartbeat text-primary" style={{ fontSize: '2rem' }} />
                          )}
                        </div>
                        <h4 className="service-title">
                          <a href={`/page/${generateSlug(item.title)}`}>
                            {item.title}
                          </a>
                        </h4>
                        <div className="service-description">
                          {parse(item.short_description || '')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* ======= Gallery Section ======= */}
          <section id="gallery" className="gallery">
            <div className="container" data-aos="fade-up">
              <div className="section-title">
                <h2>Gallery</h2>
                <p>We are providing wonderful treatment with best quality</p>
              </div>
            </div>
            <div className="container-fluid">
              <div className="row g-0">
                {imagegalleryLoading ? (
                  // Loading Skeletons
                  Array(8).fill(0).map((_, i) => (
                    <div className="col-lg-3 col-md-4 p-2" key={i}>
                      <div className="skeleton-image" style={{
                        width: '100%',
                        height: '200px',
                        background: '#eee',
                        borderRadius: '8px',
                        animation: 'pulse 1.5s infinite ease-in-out'
                      }}></div>
                    </div>
                  ))
                ) : imagegallery.length > 0 ? (
                  imagegallery.slice(0, 8).map((item) => (
                    <div className="col-lg-3 col-md-4 gallery-image-container" key={item.id}>
                      <div className="gallery-item">
                        <div className="card-body m-3">
                          <a href="/image-gallery/" className="gallery-lightbox">
                            <Image
                              src={getImageUrl(item.image)}
                              alt="Gallery"
                              className="img-fluid"
                              width={400}
                              height={200}
                              style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <p className="text-muted">Stay tuned! Our gallery is being updated.</p>
                  </div>
                )}
                <style>{`
                  @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                  }
                  .skeleton-image {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                  }
                  @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                  }
                `}</style>
              </div>

              <div className="text-center mt-4">
                <button
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#2c4964',
                    borderColor: '#2c4964',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1a365d';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(44, 73, 100, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#2c4964';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                  onClick={() => router.push('/image-gallery')}
                >
                  <i className="fas fa-images me-2"></i>
                  View Full Gallery
                </button>
              </div>
            </div>
          </section>
          {/* End Gallery Section */}
          
          <Reviews />

          {/* ======= Contact Section ======= */}
          <section id="contact" className="contact">
            <div className="container">
              <div className="section-title">
                <h2>Contact</h2>
                <p>Ready to book your consultation? Reach out to our team today!</p>
              </div>
            </div>
            <div className="container">
              <div className="row mt-5">
                <div className="col-lg-4">
                  <div className="info">
                    <div className="address">
                      <i className="fa fa-map-marker" />
                      <h4>Location:</h4>
                      <p>
                        C.S. Mangamma Hospital building, Main Rd, opposite KGH Outgate, Opp KGH OP Gate, Maharani Peta, Visakhapatnam, Andhra Pradesh 530002
                      </p>
                    </div>
                    <div className="email">
                      <i className="fa fa-envelope" />
                      <h4>Email:</h4>
                      <p>contact@a1laparoscopyhospital.com</p>
                    </div>
                    <div className="phone">
                      <i className="fa fa-phone" />
                      <h4>Call:</h4>
                      <p>+91 78292 22111</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 mt-5 mt-lg-0">
                  <iframe
                    title="Google Map Location"
                    src={GOOGLE_MAP_IFRAME}
                    width="100%"
                    height="450"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen=""
                  ></iframe>
                </div>
              </div>
            </div>
          </section>
          {/* End Contact Section */}

        </main>
        {/* End #main */}
      </div>
    </div>
  );
}

export default React.memo(Home);
