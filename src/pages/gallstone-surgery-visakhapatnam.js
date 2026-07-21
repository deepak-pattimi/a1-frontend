import React from 'react';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getGallstoneSurgerySchema } from '@/utils/schemas';

export async function getServerSideProps() {
    try {
        const settingsResponse = await axiosInstance.get('general-settings');
        return { props: { generalSettings: settingsResponse.data || null } };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { props: { generalSettings: null } };
    }
}

export default function GallstoneSurgeryPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Gallstone Surgery (Cholecystectomy) in Visakhapatnam - ${siteName}`}</title>
                <meta name="description" content="Laparoscopic gallbladder removal surgery at A1 Laparoscopy Hospital, Visakhapatnam. Same-day discharge available. Expert care by Dr. Naveen Kumar Anem for gallstones and gallbladder disease." />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Gallstone Surgery - ${siteName}`} />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/gallstone-surgery-visakhapatnam" />
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/gallstone-surgery-visakhapatnam" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getGallstoneSurgerySchema()) }} />
            </Head>
            <div className="container py-5">
                <h1>Gallstone Surgery (Laparoscopic Cholecystectomy)</h1>
                <p>A1 Laparoscopy Hospital offers advanced laparoscopic cholecystectomy (gallbladder removal) to treat gallstones and gallbladder disease with minimally invasive techniques.</p>
                <h2>Symptoms of Gallstones</h2>
                <ul>
                    <li>Severe abdominal pain (especially after meals)</li>
                    <li>Nausea and vomiting</li>
                    <li>Bloating and indigestion</li>
                    <li>Jaundice (yellowing of skin/eyes)</li>
                    <li>Fever (if infection present)</li>
                </ul>
                <h2>Surgical Procedure</h2>
                <p>Gallbladder removed through 3-4 small incisions under general anaesthesia. Most patients discharged within 24 hours.</p>
                <h2>Recovery</h2>
                <ul>
                    <li>Return to normal activities: 1-2 weeks</li>
                    <li>Dietary modifications initially</li>
                    <li>Follow-up consultation at 1 week</li>
                </ul>
                <div className="mt-4"><a href="/contact" className="btn btn-primary">Schedule Surgery Consultation</a></div>
            </div>
        </>
    );
}
