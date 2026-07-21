import React from 'react';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getHysteroscopySchema } from '@/utils/schemas';

export async function getServerSideProps() {
    try {
        const settingsResponse = await axiosInstance.get('general-settings');
        return { props: { generalSettings: settingsResponse.data || null } };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { props: { generalSettings: null } };
    }
}

export default function HysteroscopyPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Hysteroscopy Procedure in Visakhapatnam - ${siteName}`}</title>
                <meta name="description" content="Advanced hysteroscopy at A1 Laparoscopy Hospital by Dr. I.S. Prathyusha. No incisions required. Diagnose and treat fibroids, polyps, abnormal bleeding with minimally invasive technique." />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Hysteroscopy - ${siteName}`} />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/hysteroscopy-visakhapatnam" />
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/hysteroscopy-visakhapatnam" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getHysteroscopySchema()) }} />
            </Head>
            <div className="container py-5">
                <h1>Hysteroscopy - No Incision Gynecological Procedure</h1>
                <p>Hysteroscopy at A1 Laparoscopy Hospital allows Dr. I.S. Prathyusha to diagnose and treat uterine conditions using a thin camera passed through the cervix — no external incisions required.</p>
                <h2>Conditions Diagnosed & Treated</h2>
                <ul>
                    <li>Uterine fibroids</li>
                    <li>Endometrial polyps</li>
                    <li>Abnormal uterine bleeding</li>
                    <li>Adhesions (scar tissue)</li>
                    <li>Septate uterus</li>
                    <li>Infertility evaluation</li>
                </ul>
                <h2>Procedure Details</h2>
                <p>A thin camera (hysteroscope) is passed through the cervix into the uterus. No skin incisions needed. Performed under general or local anaesthesia depending on complexity.</p>
                <h2>Benefits</h2>
                <ul>
                    <li>No external incisions or scars</li>
                    <li>Minimal discomfort</li>
                    <li>Quick recovery (often same-day discharge)</li>
                    <li>Accurate diagnosis and treatment in one procedure</li>
                    <li>Preserves fertility when appropriate</li>
                </ul>
                <div className="mt-4"><a href="/contact" className="btn btn-primary">Consult Dr. Prathyusha</a></div>
            </div>
        </>
    );
}
