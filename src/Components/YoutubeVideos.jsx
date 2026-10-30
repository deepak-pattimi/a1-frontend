import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import AutoScrollMarquee from "./AutoScrollMarquee";
import axiosInstance from "../utils/axiosConfig";
import { getImageUrl } from "../utils/imageUtils";

// Friendly curated titles for hospital YouTube shorts/videos
const KNOWN_TITLES = {
  "UshVWIg1xSE": "Why Lasers for Surgery? Advanced Laser Care",
  "iRFNBD93d5E": "Common Questions About Bariatric Surgery",
  "cbH8vJOtoLY": "When Do Gallstones Need Surgery?",
  "izY38EnEmX4": "Tiny Cuts, Fast Healing! Laparoscopic Surgery",
};

/**
 * Extracts YouTube video ID from various URL patterns
 */
export const getYoutubeVideoId = (url) => {
  if (!url || typeof url !== "string") return "";
  
  // Standard Regex for YouTube URLs (shorts, watch?v=, youtu.be, embed, live)
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/
  );
  if (match && match[1]) return match[1];

  // Fallbacks
  if (url.includes("shorts/")) return url.split("shorts/")[1].split(/[?#&/]/)[0];
  if (url.includes("watch?v=")) return url.split("watch?v=")[1].split(/[?#&/]/)[0];
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split(/[?#&/]/)[0];
  return "";
};

export default function YoutubeVideos({ initialVideos = [] }) {
  const [videos, setVideos] = useState(initialVideos || []);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  // Sync prop changes and auto-fetch if initially empty
  useEffect(() => {
    if (initialVideos && initialVideos.length > 0) {
      setVideos(initialVideos);
    } else if (!videos || videos.length === 0) {
      axiosInstance
        .get("get-videogallery-list")
        .then((res) => {
          if (Array.isArray(res?.data) && res.data.length > 0) {
            setVideos(res.data);
          }
        })
        .catch((err) => {
          console.warn("Could not fetch video gallery:", err?.message);
        });
    }
  }, [initialVideos]);

  // Process and deduplicate videos
  const processedVideos = React.useMemo(() => {
    if (!videos || !Array.isArray(videos)) return [];

    const uniqueList = [];
    const seenIds = new Set();

    for (const item of videos) {
      const videoId = getYoutubeVideoId(item.youtubelink);
      if (videoId && !seenIds.has(videoId)) {
        seenIds.add(videoId);
        const isShort = (item.youtubelink || "").includes("/shorts/");
        const title =
          item.title ||
          KNOWN_TITLES[videoId] ||
          "A1 Hospital Educational Video";

        const primaryThumbnail = item.thumbnail
          ? getImageUrl(item.thumbnail)
          : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        uniqueList.push({
          id: item.id,
          videoId,
          title,
          isShort,
          youtubelink: item.youtubelink,
          thumbnail: primaryThumbnail,
          fallbackThumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
        });
      }
    }

    return uniqueList;
  }, [videos]);

  const handleOpenVideo = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  if (!processedVideos || processedVideos.length === 0) {
    return (
      <div className="container px-0">
        <div className="text-center py-5">
          <p className="text-muted">No videos available at the moment.</p>
        </div>
      </div>
    );
  }

  // Double list for infinite loop in marquee if more than 3 videos
  const marqueeVideos =
    processedVideos.length >= 3
      ? [...processedVideos, ...processedVideos]
      : processedVideos;

  return (
    <div className="container-fluid px-3 mb-5 youtube-gallery-section">
      <div className="text-center mb-4 mt-5">
        <div
          className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
          style={{
            backgroundColor: "rgba(220, 38, 38, 0.08)",
            color: "#dc2626",
            fontSize: "0.85rem",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          HOSPITAL VIDEO GALLERY
        </div>
        <h2 className="fw-bold mb-2" style={{ color: "#0f172a", fontSize: "2rem" }}>
          Video Gallery
        </h2>
        <p className="text-muted mx-auto" style={{ maxWidth: "600px", fontSize: "0.95rem" }}>
          Watch educational surgical insights, laparoscopic procedures, and health guidance from Dr. Anem Naveen Kumar.
        </p>
      </div>

      <div id="Videos" className="mt-4 p-2 mb-4">
        {processedVideos.length >= 3 ? (
          <AutoScrollMarquee speed={selectedVideo ? 0 : 1.2}>
            {marqueeVideos.map((video, index) => (
              <div
                className="video-card-item px-2"
                key={`${video.videoId}-${index}`}
                style={{ width: "360px", flexShrink: 0 }}
              >
                <VideoCard video={video} onPlay={() => handleOpenVideo(video)} />
              </div>
            ))}
          </AutoScrollMarquee>
        ) : (
          <div className="row justify-content-center g-4">
            {processedVideos.map((video) => (
              <div className="col-lg-4 col-md-6" key={video.videoId}>
                <VideoCard video={video} onPlay={() => handleOpenVideo(video)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* High-Definition Theater Lightbox Modal */}
      <Modal
        show={!!selectedVideo}
        onHide={handleCloseModal}
        centered
        size={selectedVideo?.isShort ? "md" : "lg"}
        contentClassName="border-0 shadow-lg"
        dialogClassName="video-lightbox-modal"
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
          {/* Modal Header */}
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
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  fontSize: "0.75rem",
                  padding: "4px 10px",
                }}
              >
                {selectedVideo?.isShort ? "YouTube Short" : "YouTube Video"}
              </span>
              <span
                className="text-white text-truncate fw-medium"
                style={{ fontSize: "0.95rem" }}
                title={selectedVideo?.title}
              >
                {selectedVideo?.title}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn btn-sm text-white-50 p-1"
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                lineHeight: "1",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* Modal Body with Embed */}
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
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            )}
          </div>

          {/* Modal Footer */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2"
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "rgba(15, 23, 42, 0.9)",
            }}
          >
            <span className="text-white-50" style={{ fontSize: "0.8rem" }}>
              Dr. Anem Naveen Kumar &bull; A1 Laparoscopy Hospital
            </span>
            {selectedVideo && (
              <a
                href={selectedVideo.youtubelink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1"
                style={{
                  fontSize: "0.8rem",
                  borderRadius: "20px",
                  padding: "4px 12px",
                }}
              >
                <span>Open in YouTube</span>
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

      <style>{`
        .youtube-gallery-section {
          position: relative;
        }
        .video-card-item {
          transition: transform 0.25s ease;
        }
        .video-card-item:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
}

/**
 * Visual Video Card with Thumbnail, Badges, and Glow Play Button
 */
function VideoCard({ video, onPlay }) {
  const [imgSrc, setImgSrc] = useState(video.thumbnail);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError && video.fallbackThumbnail && imgSrc !== video.fallbackThumbnail) {
      setImgSrc(video.fallbackThumbnail);
      setImgError(true);
    }
  };

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
      className="card h-100 border-0 text-decoration-none position-relative overflow-hidden"
      style={{
        borderRadius: "16px",
        boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)",
        backgroundColor: "#0f172a",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        className="position-relative overflow-hidden"
        style={{
          height: "230px",
          backgroundColor: "#0f172a",
        }}
      >
        {/* Background Image / Thumbnail */}
        <img
          src={imgSrc}
          alt={video.title}
          onError={handleImageError}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 0.4s ease",
          }}
          className="video-thumb-img"
        />

        {/* Ambient Dark Gradient Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 40%, rgba(15, 23, 42, 0.15) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Top Badges */}
        <div
          className="position-absolute top-0 start-0 w-100 p-3 d-flex align-items-center justify-content-between"
          style={{ zIndex: 2 }}
        >
          <span
            className="badge rounded-pill text-white"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(6px)",
              fontSize: "0.72rem",
              fontWeight: "600",
              letterSpacing: "0.4px",
              padding: "5px 10px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            A1 Hospital
          </span>

          <span
            className="badge rounded-pill text-white d-inline-flex align-items-center gap-1"
            style={{
              backgroundColor: "#dc2626",
              fontSize: "0.72rem",
              fontWeight: "600",
              padding: "5px 10px",
              boxShadow: "0 2px 8px rgba(220, 38, 38, 0.4)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            {video.isShort ? "Shorts" : "Watch"}
          </span>
        </div>

        {/* Center Glowing Play Button */}
        <div
          className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center play-btn-wrapper"
          style={{ zIndex: 3 }}
        >
          <div
            className="play-pulse-ring"
            style={{
              position: "absolute",
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              backgroundColor: "rgba(220, 38, 38, 0.35)",
              animation: "pulseRing 2s infinite ease-out",
            }}
          />
          <div
            className="play-button"
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "50%",
              backgroundColor: "#dc2626",
              boxShadow: "0 8px 24px rgba(220, 38, 38, 0.55), 0 0 0 3px rgba(255, 255, 255, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s ease",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="#ffffff"
              style={{ marginLeft: "3px" }}
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>

        {/* Bottom Content / Title */}
        <div
          className="position-absolute bottom-0 start-0 w-100 p-3"
          style={{ zIndex: 2 }}
        >
          <h5
            className="text-white mb-1 fw-bold text-truncate-2"
            style={{
              fontSize: "0.95rem",
              lineHeight: "1.35",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.6)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {video.title}
          </h5>
          <div className="d-flex align-items-center gap-2">
            <span
              className="text-white-50"
              style={{ fontSize: "0.75rem", letterSpacing: "0.3px" }}
            >
              Click to play video
            </span>
            <span
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              }}
            />
            <span
              className="text-white-50"
              style={{ fontSize: "0.75rem" }}
            >
              HD
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .card:hover .video-thumb-img {
          transform: scale(1.06);
        }
        .card:hover .play-button {
          transform: scale(1.1);
          background-color: #ef4444 !important;
          box-shadow: 0 10px 28px rgba(239, 68, 68, 0.75), 0 0 0 4px #ffffff !important;
        }
        @keyframes pulseRing {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.35);
            opacity: 0;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}