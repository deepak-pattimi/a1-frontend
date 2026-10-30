import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import AutoScrollMarquee from "./AutoScrollMarquee";

/**
 * Extracts YouTube video ID from various URL patterns
 */
const getYoutubeVideoId = (url) => {
  if (!url || typeof url !== "string") return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/
  );
  if (match && match[1]) return match[1];
  if (url.includes("shorts/")) return url.split("shorts/")[1].split(/[?#&/]/)[0];
  if (url.includes("watch?v=")) return url.split("watch?v=")[1].split(/[?#&/]/)[0];
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split(/[?#&/]/)[0];
  return "";
};

export default function CaseStudiesTestimonials({ testimonials = [] }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Deduplicate and process testimonials
  const processedItems = React.useMemo(() => {
    return testimonials.map((item, index) => {
      const videoId = getYoutubeVideoId(item.youtube_link);
      const title = item.title || `Patient Case Study ${index + 1}`;
      const isShort = (item.youtube_link || "").includes("/shorts/");
      const thumbnail = videoId
        ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        : "/placeholder-video.jpg";
      const embedUrl = videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
        : "";

      return {
        id: item.id || index,
        videoId,
        title,
        isShort,
        thumbnail,
        fallbackThumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "",
        embedUrl,
        youtube_link: item.youtube_link,
      };
    });
  }, [testimonials]);

  const isScrollable = processedItems.length >= 3;
  const marqueeItems = isScrollable
    ? [...processedItems, ...processedItems]
    : processedItems;

  return (
    <section id="case-studies" className="case-studies-section py-5 mt-5 bg-light">
      <div className="container">
        <div className="section-title text-center mb-5">
          <span
            className="badge rounded-pill bg-white text-primary px-3 py-2 mb-3 shadow-sm border"
            style={{ letterSpacing: "1px", fontWeight: "600" }}
          >
            WATCH & LEARN
          </span>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#2c4964" }}>
            Case Studies & Testimonials
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px", fontSize: "0.95rem" }}>
            Real patient experiences and successful surgical outcomes at A1 Laparoscopy Hospital.
          </p>
        </div>
      </div>

      <div className="container-fluid px-3">
        {isScrollable ? (
          <AutoScrollMarquee speed={selectedVideo ? 0 : 1.2}>
            {marqueeItems.map((item, index) => (
              <div
                className="testimonial-item-wrapper px-2"
                key={`${item.videoId || item.id}-${index}`}
                style={{ width: "340px", flexShrink: 0 }}
              >
                <TestimonialCard item={item} onPlay={() => setSelectedVideo(item)} />
              </div>
            ))}
          </AutoScrollMarquee>
        ) : (
          <div className="row justify-content-center g-4">
            {processedItems.map((item) => (
              <div className="col-lg-4 col-md-6" key={item.id}>
                <TestimonialCard item={item} onPlay={() => setSelectedVideo(item)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Video Modal */}
      <Modal
        show={!!selectedVideo}
        onHide={() => setSelectedVideo(null)}
        centered
        size={selectedVideo?.isShort ? "md" : "lg"}
        contentClassName="border-0 shadow-lg"
        style={{ zIndex: 1060 }}
        onExited={() => {
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
        }}
      >
        <div
          style={{
            backgroundColor: "#0b0f19",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Header */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2"
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "rgba(15, 23, 42, 0.9)",
            }}
          >
            <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  fontSize: "0.75rem",
                  padding: "4px 10px",
                }}
              >
                Patient Story
              </span>
              <span className="text-white text-truncate fw-medium" style={{ fontSize: "0.95rem" }}>
                {selectedVideo?.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="btn btn-sm text-white-50 p-1"
              style={{ background: "transparent", border: "none", fontSize: "1.5rem", lineHeight: "1", cursor: "pointer" }}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* Video Player */}
          <div
            className="position-relative"
            style={{
              backgroundColor: "#000",
              aspectRatio: selectedVideo?.isShort ? "9 / 16" : "16 / 9",
              maxHeight: selectedVideo?.isShort ? "75vh" : "65vh",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {selectedVideo && (
              <iframe
                src={selectedVideo.embedUrl}
                title={selectedVideo.title}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ display: "block", width: "100%", height: "100%", border: "none" }}
              />
            )}
          </div>

          {/* Footer */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2"
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "rgba(15, 23, 42, 0.9)",
            }}
          >
            <span className="text-white-50" style={{ fontSize: "0.8rem" }}>
              A1 Laparoscopy Hospital &bull; Verified Testimonial
            </span>
            {selectedVideo?.youtube_link && (
              <a
                href={selectedVideo.youtube_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1"
                style={{ fontSize: "0.8rem", borderRadius: "20px", padding: "4px 12px" }}
              >
                <span>Watch on YouTube</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
}

function TestimonialCard({ item, onPlay }) {
  const [imgSrc, setImgSrc] = useState(item.thumbnail);

  return (
    <div
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPlay();
        }
      }}
      className="card h-100 border-0 text-decoration-none position-relative overflow-hidden shadow-sm"
      style={{
        borderRadius: "16px",
        backgroundColor: "#0f172a",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="position-relative overflow-hidden" style={{ height: "300px", backgroundColor: "#0f172a" }}>
        <img
          src={imgSrc}
          alt={item.title}
          onError={() => {
            if (item.fallbackThumbnail && imgSrc !== item.fallbackThumbnail) {
              setImgSrc(item.fallbackThumbnail);
            }
          }}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 0.4s ease",
          }}
          className="testimonial-thumb-img"
        />

        {/* Gradient Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 50%, rgba(15, 23, 42, 0.1) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Top Badge */}
        <div className="position-absolute top-0 start-0 w-100 p-3 d-flex align-items-center justify-content-between" style={{ zIndex: 2 }}>
          <span
            className="badge rounded-pill text-white"
            style={{
              backgroundColor: "rgba(37, 99, 235, 0.85)",
              backdropFilter: "blur(6px)",
              fontSize: "0.72rem",
              padding: "5px 10px",
            }}
          >
            Case Study
          </span>
          <span
            className="badge rounded-pill text-white"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              fontSize: "0.72rem",
              padding: "5px 10px",
            }}
          >
            Testimonial
          </span>
        </div>

        {/* Center Play Button */}
        <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center" style={{ zIndex: 3 }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#2563eb",
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.55), 0 0 0 3px rgba(255, 255, 255, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.25s ease",
            }}
            className="play-btn-circle"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" style={{ marginLeft: "3px" }}>
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>

        {/* Bottom Title */}
        <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ zIndex: 2 }}>
          <h5 className="text-white mb-1 fw-bold text-truncate" style={{ fontSize: "1rem", textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}>
            {item.title}
          </h5>
          <span className="text-white-50" style={{ fontSize: "0.78rem" }}>
            Tap to watch patient story
          </span>
        </div>
      </div>

      <style>{`
        .card:hover .testimonial-thumb-img {
          transform: scale(1.05);
        }
        .card:hover .play-btn-circle {
          transform: scale(1.12);
          background-color: #1d4ed8 !important;
        }
      `}</style>
    </div>
  );
}
