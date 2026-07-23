import React, { useRef } from "react";
import AutoScrollMarquee from "./AutoScrollMarquee";

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
      
      {isScrollable ? (
        <AutoScrollMarquee speed={1.5}>
            {[...testimonials, ...testimonials].map((item, index) => {
              const embedUrl = getYoutubeEmbedUrl(item.youtube_link);
              return (
                <div className="review-marquee-item px-2" key={`${item.id}-${index}`} style={{ width: '350px' }}>
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
        </AutoScrollMarquee>
      ) : (
        <div className="container-fluid px-4">
          <div className="row justify-content-center g-4">
            {testimonials.map((item) => {
              const embedUrl = getYoutubeEmbedUrl(item.youtube_link);
              return (
                <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
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
        </div>
      )}
    </section>
  );
}
