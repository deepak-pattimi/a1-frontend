import React from 'react';
import Contact from '@/Components/Aboutus/Contact';
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

export default function ContactPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Contact Us - ${siteName}`}</title>
                <meta name="description" content="Get in touch with A1 Laparoscopy Hospital. Book appointments, ask questions, or visit our clinic in Visakhapatnam." />
                
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Contact Us - ${siteName}`} />
                <meta property="og:description" content="Book appointments and get in touch with us" />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/Contact" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:title" content={`Contact Us - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/Contact/" />
                
                {/* Structured Data for Contact */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Hospital',
                            name: siteName,
                            url: 'https://a1laparoscopyhospital.com',
                            telephone: generalSettings?.phone,
                            address: {
                                '@type': 'PostalAddress',
                                streetAddress: generalSettings?.address,
                                addressLocality: 'Visakhapatnam',
                                addressRegion: 'Andhra Pradesh',
                                addressCountry: 'IN'
                            },
                            openingHoursSpecification: {
                                '@type': 'OpeningHoursSpecification',
                                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                                opens: '09:00',
                                closes: '20:00'
                            }
                        })
                    }}
                />
            </Head>
            <Contact />
        </>
    );
}
