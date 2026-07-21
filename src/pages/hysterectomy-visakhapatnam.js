import React from 'react';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getHysterectomySchema } from '@/utils/schemas';

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

export default function HysterectomyPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Laparoscopic Hysterectomy in Visakhapatnam - ${siteName}`}</title>
                <meta name="description" content="Advanced laparoscopic hysterectomy performed by Dr. I.S. Prathyusha at A1 Laparoscopy Hospital, Visakhapatnam. Minimally invasive uterus removal surgery with faster recovery and less pain." />
                
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Laparoscopic Hysterectomy - ${siteName}`} />
                <meta property="og:description" content="Minimally invasive hysterectomy by expert OB-GYN specialist" />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/hysterectomy-visakhapatnam" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={`Laparoscopic Hysterectomy - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/hysterectomy-visakhapatnam" />
                
                {/* Structured Data - MedicalProcedure Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(getHysterectomySchema())
                    }}
                />
            </Head>
            <div className="container py-5">
                <h1>Laparoscopic Hysterectomy in Visakhapatnam</h1>
                <p>A1 Laparoscopy Hospital offers advanced laparoscopic hysterectomy procedures performed by Dr. I.S. Prathyusha, our experienced OB-GYN specialist. This minimally invasive approach removes the uterus through small incisions, avoiding large open cuts.</p>
                
                <h2>Why Laparoscopic Hysterectomy?</h2>
                <ul>
                    <li>Smaller incisions (5-10mm vs. large abdominal cut)</li>
                    <li>Less post-operative pain</li>
                    <li>Faster recovery time</li>
                    <li>Reduced risk of infection</li>
                    <li>Minimal scarring</li>
                    <li>Shorter hospital stay</li>
                </ul>
                
                <h2>Conditions Treated</h2>
                <ul>
                    <li>Uterine fibroids</li>
                    <li>Endometriosis</li>
                    <li>Uterine prolapse</li>
                    <li>Abnormal uterine bleeding</li>
                    <li>Chronic pelvic pain</li>
                    <li>Gynecological cancers (when appropriate)</li>
                </ul>
                
                <h2>Surgical Procedure</h2>
                <p>The uterus is removed laparoscopically through small incisions under general anaesthesia. Specialized instruments and a camera allow for precise surgery with minimal tissue disruption.</p>
                
                <h2>Recovery & Follow-up Care</h2>
                <p><strong>Follow-up Schedule:</strong></p>
                <ul>
                    <li>First follow-up: 1 week post-surgery</li>
                    <li>Second follow-up: 6 weeks post-surgery</li>
                    <li>Pelvic rest recommended for 6 weeks</li>
                </ul>
                
                <div className="mt-4">
                    <a href="/contact" className="btn btn-primary">Book Appointment with Dr. Prathyusha</a>
                </div>
            </div>
        </>
    );
}
