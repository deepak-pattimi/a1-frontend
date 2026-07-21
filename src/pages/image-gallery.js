import React from 'react';
import ImageLightbox from '@/Components/Images';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';

export async function getServerSideProps() {
    try {
        const [settingsResponse, galleryResponse] = await Promise.all([
            axiosInstance.get('general-settings'),
            axiosInstance.get('get-imagegallery-list').catch(() => ({ data: [] }))
        ]);
        
        return {
            props: {
                generalSettings: settingsResponse.data || null,
                initialImages: galleryResponse.data || []
            }
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: {
                generalSettings: null,
                initialImages: []
            }
        };
    }
}

export default function ImageGalleryPage({ generalSettings, initialImages }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Image Gallery - ${siteName}`}</title>
                <meta name="description" content="View our state-of-the-art medical facilities, advanced surgical equipment, and successful procedure outcomes at A1 Laparoscopy Hospital." />
                
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Image Gallery - ${siteName}`} />
                <meta property="og:description" content="Tour our advanced medical facilities and equipment" />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/image-gallery" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:title" content={`Image Gallery - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/image-gallery/" />
            </Head>
            <ImageLightbox initialImages={initialImages} />
        </>
    );
}
