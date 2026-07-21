import React from 'react';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getAppendectomySchema } from '@/utils/schemas';

export async function getServerSideProps() {
    try {
        const settingsResponse = await axiosInstance.get('general-settings');
        return { props: { generalSettings: settingsResponse.data || null } };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { props: { generalSettings: null } };
    }
}

export default function AppendectomyPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Emergency Appendectomy Surgery in Visakhapatnam - 24/7 - ${siteName}`}</title>
                <meta name="description" content="24/7 emergency laparoscopic appendectomy at A1 Laparoscopy Hospital, Visakhapatnam. Minimally invasive appendix removal surgery with faster recovery. Available round the clock." />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Emergency Appendectomy - ${siteName}`} />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/appendectomy-visakhapatnam" />
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/appendectomy-visakhapatnam" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getAppendectomySchema()) }} />
            </Head>
            <div className="container py-5">
                <h1>Emergency Appendectomy Surgery - Available 24/7</h1>
                <p>A1 Laparoscopy Hospital provides 24/7 emergency laparoscopic appendectomy services for acute appendicitis. Our experienced surgical team is available around the clock.</p>
                <h2>Symptoms of Appendicitis</h2>
                <ul>
                    <li>Sudden pain near belly button moving to lower right abdomen</li>
                    <li>Pain worsens with coughing or walking</li>
                    <li>Nausea and vomiting</li>
                    <li>Loss of appetite</li>
                    <li>Low-grade fever</li>
                    <li>Abdominal swelling</li>
                </ul>
                <h2>Emergency Care</h2>
                <p><strong>Available 24/7:</strong> If you suspect appendicitis, seek immediate medical attention. Delayed treatment can lead to rupture.</p>
                <h2>Surgical Procedure</h2>
                <p>Appendix removed through 2-3 small incisions under general anaesthesia. Emergency surgery available anytime.</p>
                <h2>Recovery</h2>
                <ul>
                    <li>Uncomplicated cases: 1-2 weeks recovery</li>
                    <li>Ruptured appendix: Longer hospital stay may be needed</li>
                    <li>Follow-up consultation scheduled</li>
                </ul>
                <div className="mt-4 alert alert-danger">
                    <strong>Emergency?</strong> Call us immediately or visit our emergency department.
                </div>
                <div className="mt-4"><a href="/contact" className="btn btn-danger">Emergency Contact</a></div>
            </div>
        </>
    );
}
