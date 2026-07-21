import React from 'react';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getBariatricSurgerySchema } from '@/utils/schemas';

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

export default function BariatricSurgeryPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Bariatric Surgery (Weight Loss Surgery) in Visakhapatnam - ${siteName}`}</title>
                <meta name="description" content="Advanced laparoscopic bariatric surgery for weight loss at A1 Laparoscopy Hospital, Visakhapatnam. Performed by Dr. Naveen Kumar Anem with 17+ years of experience. Minimally invasive procedures for faster recovery." />
                
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Bariatric Surgery in Visakhapatnam - ${siteName}`} />
                <meta property="og:description" content="Laparoscopic weight loss surgery with minimally invasive techniques" />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/bariatric-surgery-visakhapatnam" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={`Bariatric Surgery in Visakhapatnam - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/bariatric-surgery-visakhapatnam" />
                
                {/* Structured Data - MedicalProcedure Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(getBariatricSurgerySchema())
                    }}
                />
            </Head>
            <div className="container py-5">
                <h1>Bariatric Surgery (Weight Loss Surgery) in Visakhapatnam</h1>
                <p>A1 Laparoscopy Hospital offers advanced laparoscopic bariatric surgery procedures for patients struggling with obesity. Our experienced team led by Dr. Naveen Kumar Anem provides comprehensive weight loss solutions using minimally invasive techniques.</p>
                
                <h2>Why Choose Bariatric Surgery?</h2>
                <ul>
                    <li>Effective long-term weight loss solution</li>
                    <li>Improves obesity-related health conditions</li>
                    <li>Minimally invasive laparoscopic approach</li>
                    <li>Faster recovery and less pain</li>
                    <li>Performed by experienced surgeons</li>
                </ul>
                
                <h2>Our Approach</h2>
                <p>We perform bariatric surgery laparoscopically through 3–5 small incisions under general anaesthesia. This minimally invasive approach ensures:</p>
                <ul>
                    <li>Shorter hospital stay</li>
                    <li>Reduced post-operative pain</li>
                    <li>Minimal scarring</li>
                    <li>Quicker return to normal activities</li>
                </ul>
                
                <h2>Pre & Post-Operative Care</h2>
                <p><strong>Pre-operative:</strong> Comprehensive evaluation including blood tests, ECG, cardiac assessment, and dietary counselling.</p>
                <p><strong>Post-operative:</strong> Regular follow-up consultations, dietary guidance, and monitoring of weight loss progress.</p>
                
                <div className="mt-4">
                    <a href="/contact" className="btn btn-primary">Book Consultation</a>
                </div>
            </div>
        </>
    );
}
