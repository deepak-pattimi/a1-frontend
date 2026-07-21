import React from 'react';
import YoutubeVideos from '@/Components/YoutubeVideos';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';

export async function getServerSideProps() {
    try {
        // Fetch general settings
        const settingsResponse = await axiosInstance.get('general-settings');
        
        // Fetch video gallery data
        let videos = [];
        try {
            const videosResponse = await axiosInstance.get('get-videogallery-list');
            if (videosResponse.data && Array.isArray(videosResponse.data)) {
                videos = videosResponse.data;
            }
        } catch (error) {
            console.error('Error fetching video gallery:', error);
        }
        
        return {
            props: {
                generalSettings: settingsResponse.data || null,
                initialVideos: videos
            }
        };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return {
            props: {
                generalSettings: null,
                initialVideos: []
            }
        };
    }
}

export default function VideoGalleryPage({ generalSettings, initialVideos }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Video Gallery - ${siteName}`}</title>
                <meta name="description" content="Watch educational videos and patient testimonials from A1 Laparoscopy Hospital." />
                
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Video Gallery - ${siteName}`} />
                <meta property="og:description" content="Educational videos and patient testimonials" />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/video-gallery" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:title" content={`Video Gallery - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/video-gallery/" />
            </Head>
            <YoutubeVideos initialVideos={initialVideos} />
        </>
    );
}
