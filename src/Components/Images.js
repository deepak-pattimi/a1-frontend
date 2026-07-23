import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUtils';
import "react-image-lightbox/style.css";
// import "./media.css"; // Moved to _app.js
import AutoScrollMarquee from "./AutoScrollMarquee";
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
      <div className="container-fluid px-4">
        <div className="row justify-content-center g-4">
        {images.length > 4 ? (
          <AutoScrollMarquee speed={1.5}>
            {[...images, ...images].map((image, index) => (
              <div className="gallery-marquee-item px-2" key={`${index}`} style={{ width: '400px' }}>
                <div className="gallery-image-container">
                  <Image
                    className="gallery-image"
                    src={image}
                    alt={`Gallery Image ${index + 1}`}
                    width={400}
                    height={300}
                    onClick={() => openLightbox(index % images.length)}
                    style={{ cursor: 'pointer', width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              </div>
            ))}
          </AutoScrollMarquee>
        ) : images.length > 0 ? (
          images.map((image, index) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index} style={{ height: '250px' }}>
              <div className="gallery-image-container" style={{ height: '100%' }}>
                <Image
                  className="gallery-image"
                  src={image}
                  alt={`Gallery Image ${index + 1}`}
                  width={400}
                  height={400}
                  onClick={() => openLightbox(index)}
                  style={{ cursor: 'pointer', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
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
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images.length > 1 ? images[(photoIndex + 1) % images.length] : undefined}
          prevSrc={images.length > 1 ? images[(photoIndex + images.length - 1) % images.length] : undefined}
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
