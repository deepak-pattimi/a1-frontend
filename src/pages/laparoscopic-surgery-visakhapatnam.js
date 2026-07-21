import React from 'react';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getLaparoscopicSurgerySchema } from '@/utils/schemas';

export async function getServerSideProps() {
    try {
        const settingsResponse = await axiosInstance.get('general-settings');
        return { props: { generalSettings: settingsResponse.data || null } };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { props: { generalSettings: null } };
    }
}

export default function LaparoscopicSurgeryPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Advanced Laparoscopic Surgery in Visakhapatnam - ${siteName}`}</title>
                <meta name="description" content="Expert laparoscopic surgery at A1 Laparoscopy Hospital, Visakhapatnam. Minimally invasive procedures for gallstones, hernia, appendix by Dr. Naveen Kumar Anem. Faster recovery, less pain." />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Laparoscopic Surgery - ${siteName}`} />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/laparoscopic-surgery-visakhapatnam" />
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/laparoscopic-surgery-visakhapatnam" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getLaparoscopicSurgerySchema()) }} />
            </Head>
            <div className="container py-5">
                <h1>Advanced Laparoscopic Surgery in Visakhapatnam</h1>
                <p>A1 Laparoscopy Hospital specializes in minimally invasive laparoscopic surgery using advanced camera technology and small incisions for faster recovery and better outcomes.</p>
                <h2>Procedures We Perform</h2>
                <ul>
                    <li>Gallbladder removal (cholecystectomy)</li>
                    <li>Hernia repair</li>
                    <li>Appendix removal (appendectomy)</li>
                    <li>Diagnostic laparoscopy</li>
                    <li>Adhesiolysis</li>
                </ul>
                <h2>Benefits of Laparoscopic Surgery</h2>
                <ul>
                    <li>Small incisions (5-10mm)</li>
                    <li>Less post-operative pain</li>
                    <li>Faster recovery (days vs. weeks)</li>
                    <li>Lower infection risk</li>
                    <li>Minimal scarring</li>
                    <li>Shorter hospital stay</li>
                </ul>
                <div className="mt-4"><a href="/contact" className="btn btn-primary">Book Consultation</a></div>
            </div>
        </>
    );
}
