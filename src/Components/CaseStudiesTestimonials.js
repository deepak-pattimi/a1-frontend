import React, { useRef } from "react";

export default function CaseStudiesTestimonials({ testimonials = [] }) {
  // Helper function to extract YouTube video ID and create embed URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    } else if (url.includes("/embed/")) {
      videoId = url.split("/embed/")[1].split("?")[0];
    } else if (url.includes("/live/")) {
      videoId = url.split("/live/")[1].split("?")[0];
    } else if (url.includes("/shorts/")) {
      videoId = url.split("/shorts/")[1].split("?")[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  if (!testimonials || testimonials.length === 0) {
    return null; // Don't show the section at all if there are no testimonials
  }

  const isScrollable = testimonials.length > 4;
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section id="case-studies" className="case-studies-section py-5 mt-5 bg-light">
      <div className="container">
        <div className="section-title text-center mb-5">
          <span className="badge rounded-pill bg-white text-primary px-3 py-2 mb-3 shadow-sm border" style={{ letterSpacing: '1px', fontWeight: '600' }}>WATCH & LEARN</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2c4964' }}>Case Studies & Testimonials</h2>
        </div>
      </div>
      
      <div className="container-fluid px-md-5">
        <div className="position-relative px-xl-5 px-lg-4 px-md-3">
          {isScrollable && (
            <button 
              onClick={scrollLeft} 
              className="btn btn-primary rounded-circle position-absolute start-0 top-50 translate-middle-y shadow d-flex align-items-center justify-content-center"
              style={{ zIndex: 10, width: '50px', height: '50px', backgroundColor: '#2c4964', borderColor: '#2c4964', marginLeft: '0px' }}
            >
              <i className="fa fa-chevron-left" style={{ fontSize: '1.2rem' }}></i>
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            className={`row ${isScrollable ? 'flex-nowrap horizontal-scroll' : ''} mx-0`}
            style={isScrollable ? { overflowX: 'auto', overflowY: 'hidden', paddingBottom: '15px', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', gap: '25px' } : { gap: '25px' }}
          >
        {testimonials.map((item) => {
          const embedUrl = getYoutubeEmbedUrl(item.youtube_link);
          return (
            <div className="col-lg-3 col-md-4 col-sm-6 px-0" key={item.id} style={isScrollable ? { flex: '0 0 auto', width: 'calc(25% - 20px)', scrollSnapAlign: 'center' } : {}}>
              <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "16px", overflow: 'hidden', backgroundColor: '#fff' }}>
                <div style={{ height: "400px", width: "100%", backgroundColor: '#000', position: 'relative' }}>
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`testimonial-video-${item.id}`}
                      style={{ pointerEvents: 'auto' }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                      <p className="text-muted mb-0">Video unavailable</p>
                    </div>
                  )}
                  
                  {/* Invisible overlay to block the YouTube Share button on Shorts (bottom left) */}
                  {embedUrl && (
                    <div style={{ position: 'absolute', bottom: '15px', left: '10px', width: '60px', height: '60px', zIndex: 5, backgroundColor: 'transparent' }} title="Sharing disabled"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>

        {isScrollable && (
          <button 
            onClick={scrollRight} 
            className="btn btn-primary rounded-circle position-absolute end-0 top-50 translate-middle-y shadow d-flex align-items-center justify-content-center"
            style={{ zIndex: 10, width: '50px', height: '50px', backgroundColor: '#2c4964', borderColor: '#2c4964', marginRight: '0px' }}
          >
            <i className="fa fa-chevron-right" style={{ fontSize: '1.2rem' }}></i>
          </button>
        )}
        </div>
      </div>
      {isScrollable && (
        <style jsx global>{`
          .horizontal-scroll {
            -ms-overflow-style: none !important;  /* IE and Edge */
            scrollbar-width: none !important;  /* Firefox */
          }
          .horizontal-scroll::-webkit-scrollbar {
            display: none !important; /* Chrome, Safari and Opera */
          }
          @media (max-width: 992px) {
            .horizontal-scroll > div {
              width: calc(33.333333% - 20px) !important;
            }
          }
          @media (max-width: 768px) {
            .horizontal-scroll > div {
              width: calc(50% - 20px) !important;
            }
          }
          @media (max-width: 576px) {
            .horizontal-scroll > div {
              width: calc(85% - 20px) !important;
            }
          }
        `}</style>
      )}
    </section>
  );
}
