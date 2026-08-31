import React from 'react';
import AboutClinic from '@/Components/Aboutus/AboutClinic';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';

export async function getServerSideProps() {
    try {
        const settingsResponse = await axiosInstance.get('general-settings');
        
        return {
            props: {
                generalSettings: settingsResponse.data || null
            }
        };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return {
            props: {
                generalSettings: null
            }
        };
    }
}

export default function AboutClinicPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`About Our Clinic - ${siteName}`}</title>
                <meta name="description" content="Learn about A1 Laparoscopy Hospital, a premier medical institution dedicated to providing state-of-the-art minimally invasive surgical solutions in Visakhapatnam." />
                
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`About Our Clinic - ${siteName}`} />
                <meta property="og:description" content="A1 Laparoscopy Hospital offers advanced laparoscopic and bariatric surgeries with comprehensive care." />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:title" content={`About Our Clinic - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/about-clinic/" />
            </Head>
            <AboutClinic generalSettings={generalSettings} />
        </>
    );
}
