import React from 'react';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getPilesFistulaSchema } from '@/utils/schemas';

export async function getServerSideProps() {
    try {
        const settingsResponse = await axiosInstance.get('general-settings');
        return { props: { generalSettings: settingsResponse.data || null } };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { props: { generalSettings: null } };
    }
}

export default function PilesFistulaPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Piles & Fistula Treatment in Visakhapatnam - Laser Surgery - ${siteName}`}</title>
                <meta name="description" content="Minimally invasive piles (hemorrhoids) and fistula treatment at A1 Laparoscopy Hospital. Laser and laparoscopic options for faster recovery with less pain. Day-care procedures available." />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Piles & Fistula Treatment - ${siteName}`} />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/piles-fistula-treatment-visakhapatnam" />
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/piles-fistula-treatment-visakhapatnam" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getPilesFistulaSchema()) }} />
            </Head>
            <div className="container py-5">
                <h1>Piles & Fistula Treatment - Minimally Invasive Solutions</h1>
                <p>A1 Laparoscopy Hospital offers advanced minimally invasive treatments for piles (hemorrhoids) and anal fistulas using laser and laparoscopic techniques for faster recovery.</p>
                
                <h2>Piles (Hemorrhoids) Treatment</h2>
                <h3>Symptoms:</h3>
                <ul>
                    <li>Bleeding during bowel movements</li>
                    <li>Itching or irritation in anal region</li>
                    <li>Pain or discomfort</li>
                    <li>Swelling around anus</li>
                    <li>Lump near anus (prolapsed hemorrhoid)</li>
                </ul>
                
                <h2>Anal Fistula Treatment</h2>
                <h3>Symptoms:</h3>
                <ul>
                    <li>Persistent drainage of pus or blood</li>
                    <li>Pain and swelling around anus</li>
                    <li>Foul-smelling discharge</li>
                    <li>Irritation of skin around anus</li>
                    <li>Pain during bowel movements</li>
                </ul>
                
                <h2>Treatment Options</h2>
                <ul>
                    <li><strong>Laser Surgery:</strong> Minimally invasive, less pain, faster healing</li>
                    <li><strong>Laparoscopic Techniques:</strong> For complex cases</li>
                    <li><strong>Day-Care Procedures:</strong> Most cases don't require overnight stay</li>
                </ul>
                
                <h2>Benefits of Our Approach</h2>
                <ul>
                    <li>Minimal post-operative pain</li>
                    <li>Faster recovery (return to work in days)</li>
                    <li>Lower recurrence rates</li>
                    <li>Minimal scarring</li>
                    <li>Performed by experienced surgeons</li>
                </ul>
                
                <div className="mt-4"><a href="/contact" className="btn btn-primary">Book Consultation</a></div>
            </div>
        </>
    );
}
