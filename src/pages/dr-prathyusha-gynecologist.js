import React from 'react';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getDrPrathyushaSchema } from '@/utils/schemas';

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

export default function DrPrathyushaPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Dr. I.S. Prathyusha - Gynecologist & Obstetrician - ${siteName}`}</title>
                <meta name="description" content="Dr. I.S. Prathyusha is a consultant obstetrician and gynaecologist at A1 Laparoscopy Hospital, Visakhapatnam, specialising in laparoscopic gynecological surgery including hysterectomy, hysteroscopy, and ovarian cyst treatment." />
                
                {/* Open Graph */}
                <meta property="og:type" content="profile" />
                <meta property="og:title" content={`Dr. I.S. Prathyusha - Gynecologist & Obstetrician - ${siteName}`} />
                <meta property="og:description" content="Expert OB-GYN specialist in laparoscopic gynecology, hysterectomy, and hysteroscopy" />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/dr-prathyusha-gynecologist" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:title" content={`Dr. I.S. Prathyusha - Gynecologist & Obstetrician - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/dr-prathyusha-gynecologist" />
                
                {/* Structured Data for Physician */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(getDrPrathyushaSchema())
                    }}
                />
            </Head>
            {/* TODO: Create DrPrathyusha component with doctor profile content */}
            <div className="container py-5">
                <h1>Dr. I.S. Prathyusha</h1>
                <p>Consultant Obstetrician & Gynaecologist</p>
                <p>Specialising in laparoscopic gynecological surgery including hysterectomy, hysteroscopy, ovarian cysts, fibroids, endometriosis, and ectopic pregnancies.</p>
            </div>
        </>
    );
}
