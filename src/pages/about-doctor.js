import React from 'react';
import AboutDoctor from '@/Components/Aboutus/AboutDoctor';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getDrNaveenSchema } from '@/utils/schemas';

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

export default function AboutDoctorPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`About Dr. Naveen Kumar Anem - ${siteName}`}</title>
                <meta name="description" content="Learn about Dr. Naveen Kumar Anem, expert laparoscopic and bariatric surgeon with 17+ years of experience in advanced minimally invasive surgeries at A1 Laparoscopy Hospital, Visakhapatnam." />
                
                {/* Open Graph */}
                <meta property="og:type" content="profile" />
                <meta property="og:title" content={`About Dr. Naveen Kumar Anem - ${siteName}`} />
                <meta property="og:description" content="Expert laparoscopic and bariatric surgeon with 17+ years of experience" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:title" content={`About Dr. Naveen Kumar Anem - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/about-doctor/" />
                
                {/* Structured Data for Physician - Enhanced Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(getDrNaveenSchema())
                    }}
                />
            </Head>
            <AboutDoctor generalSettings={generalSettings} />
        </>
    );
}
