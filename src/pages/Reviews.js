import React from 'react';
import Reviews from '@/Components/PatientGuide/Reviews';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';

export async function getServerSideProps() {
    try {
        const [settingsResponse, reviewsResponse] = await Promise.all([
            axiosInstance.get('general-settings'),
            axiosInstance.get('reviews')
        ]);

        return {
            props: {
                generalSettings: settingsResponse.data || null,
                reviews: reviewsResponse.data || []
            }
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: {
                generalSettings: null,
                reviews: []
            }
        };
    }
}

export default function ReviewsPage({ generalSettings, reviews }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Patient Reviews & Testimonials - ${siteName}`}</title>
                <meta name="description" content="Read genuine patient reviews and testimonials about laparoscopic and bariatric surgery experiences at A1 Laparoscopy Hospital." />
                
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Patient Reviews - ${siteName}`} />
                <meta property="og:description" content="Genuine patient testimonials and success stories" />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/Reviews" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:title" content={`Patient Reviews - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/Reviews/" />
            </Head>
            <Reviews initialReviews={reviews} />
        </>
    );
}
