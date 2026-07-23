import React, { useState } from "react";
import AutoScrollMarquee from "./AutoScrollMarquee";

export default function YoutubeVideos({ initialVideos = [] }) {
  const videos = initialVideos;

  // Helper function to extract YouTube video ID and create embed URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    let videoId = "";

    // youtu.be/VIDEO_ID
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }
    // youtube.com/watch?v=VIDEO_ID
    else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1].split("&")[0];
    }
    // youtube.com/embed/VIDEO_ID
    else if (url.includes("/embed/")) {
      videoId = url.split("/embed/")[1].split("?")[0];
    }
    // youtube.com/live/VIDEO_ID
    else if (url.includes("/live/")) {
      videoId = url.split("/live/")[1].split("?")[0];
    }
    // youtube.com/shorts/VIDEO_ID
    else if (url.includes("/shorts/")) {
      videoId = url.split("/shorts/")[1].split("?")[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  // Process videos to add embed URLs and handle null thumbnails
  const processedVideos = videos.map((item) => {
    const embedUrl = getYoutubeEmbedUrl(item.youtubelink);
    
    return {
      id: item.id,
      embedUrl,
      thumbnail: item.thumbnail || null, // Handle null thumbnails
      youtubelink: item.youtubelink,
    };
  });

  if (!processedVideos || processedVideos.length === 0) {
    return (
      <div className="container px-0">
        <div className="text-center py-5">
          <p>No videos available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 mb-5">
      <h2 className="text-center mb-4 mt-5">Video Gallery</h2>
      <div id="Videos" className="mt-4 p-2 mb-5">
        {processedVideos.length > 4 ? (
          <AutoScrollMarquee speed={1.5}>
            {[...processedVideos, ...processedVideos].map((video, index) => (
              <div className="video-marquee-item px-2" key={`${video.id}-${index}`} style={{ width: '400px' }}>
                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "10px", overflow: 'hidden' }}>
                  <div className="video1" style={{ height: "250px", backgroundColor: '#000', position: 'relative' }}>
                    {video.embedUrl ? (
                      <iframe
                        src={video.embedUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`youtube-video-${video.id}`}
                        style={{ pointerEvents: 'auto' }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                        <p className="text-muted mb-0">Video unavailable</p>
                      </div>
                    )}
                    
                    {/* Invisible overlay to block YouTube Share button on Shorts */}
                    {video.embedUrl && (
                      <div style={{ position: 'absolute', bottom: '15px', left: '10px', width: '60px', height: '60px', zIndex: 5, backgroundColor: 'transparent' }} title="Sharing disabled"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </AutoScrollMarquee>
        ) : (
          <div className="row mb-5 justify-content-center">
            {processedVideos.map((video) => (
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4 px-3" key={video.id}>
                <div className="card h-100" style={{ borderRadius: "10px", overflow: 'hidden', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  <div className="video1 mb-4" style={{ height: "250px", borderRadius: "8px" }}>
                    {video.embedUrl ? (
                      <iframe
                        src={video.embedUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`youtube-video-${video.id}`}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                        <p className="text-muted mb-0">Video unavailable</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}