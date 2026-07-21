import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUtils';
import "react-image-lightbox/style.css";
// import "./media.css"; // Moved to _app.js
import axiosInstance from "../utils/axiosConfig";
import loader from "../assets/loader/loader.gif";

const Lightbox = dynamic(() => import("react-image-lightbox"), { ssr: false });


const ImageLightbox = ({ initialImages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [images, setImages] = useState(
    initialImages ? initialImages.map(item => getImageUrl(item.image)) : []
  );
  const [loading, setLoading] = useState(!initialImages);

  useEffect(() => {
    if (!initialImages || initialImages.length === 0) {
      fetchGalleryImages();
    }
  }, [initialImages]);

  const fetchGalleryImages = async () => {
    try {
      const response = await axiosInstance.get(`get-imagegallery-list`);
      if (response.data) {
        // Extract image URLs from the response
      const imageUrls = response.data.map(item => getImageUrl(item.image));
        setImages(imageUrls);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setLoading(false);
    }
  };


  const openLightbox = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <img src={loader.src} alt="Loading..." style={{ height: "50px" }} />
      </div>
    );
  }

  return (
    <div>
      {/* SEO: Main heading for image gallery page */}
      <h1 className="visually-hidden">Image Gallery - A1 Laparoscopy Hospital Medical Facilities</h1>
      
      <h3 className="text-center mt-5">Image Gallery</h3>
      <div className="row container-fluid">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div className="col-md-3 col-sm-6 mb-4" key={index}>
              <div className="gallery-image-container">
                <Image
                  className="gallery-image"
                  src={image}
                  alt={`Gallery Image ${index + 1}`}
                  width={400}
                  height={300}
                  onClick={() => openLightbox(index)}
                  style={{ cursor: 'pointer', width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>

            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No images available</p>
          </div>
        )}
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
        />
      )}
    </div>
  );
};

export default ImageLightbox;
