import React from 'react';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getHerniaRepairSchema } from '@/utils/schemas';

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

export default function HerniaRepairPage({ generalSettings }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Laparoscopic Hernia Repair in Visakhapatnam - ${siteName}`}</title>
                <meta name="description" content="Expert laparoscopic hernia repair surgery at A1 Laparoscopy Hospital, Visakhapatnam. Minimally invasive mesh reinforcement for inguinal, umbilical, and incisional hernias. Fast recovery with Dr. Naveen Kumar Anem." />
                
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Laparoscopic Hernia Repair - ${siteName}`} />
                <meta property="og:description" content="Minimally invasive hernia repair with mesh reinforcement" />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/hernia-repair-visakhapatnam" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={`Laparoscopic Hernia Repair - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/hernia-repair-visakhapatnam" />
                
                {/* Structured Data - MedicalProcedure Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(getHerniaRepairSchema())
                    }}
                />
            </Head>
            <div className="container py-5">
                <h1>Laparoscopic Hernia Repair in Visakhapatnam</h1>
                <p>A1 Laparoscopy Hospital specializes in advanced laparoscopic hernia repair procedures using minimally invasive techniques with mesh reinforcement for lasting results.</p>
                
                <h2>Types of Hernias We Treat</h2>
                <ul>
                    <li><strong>Inguinal Hernia:</strong> Most common type, occurs in the groin area</li>
                    <li><strong>Umbilical Hernia:</strong> Occurs near the belly button</li>
                    <li><strong>Incisional Hernia:</strong> Develops at the site of previous surgical scars</li>
                </ul>
                
                <h2>Surgical Procedure</h2>
                <p>Our laparoscopic hernia repair is performed under general anaesthesia through 3 small incisions. A surgical mesh is placed to reinforce the weakened abdominal wall, providing strong and durable repair.</p>
                
                <h2>Benefits of Laparoscopic Approach</h2>
                <ul>
                    <li>Smaller incisions (5-10mm)</li>
                    <li>Less post-operative pain</li>
                    <li>Faster recovery (typically 1-2 weeks)</li>
                    <li>Lower risk of infection</li>
                    <li>Minimal scarring</li>
                    <li>Shorter hospital stay</li>
                </ul>
                
                <h2>Recovery & Follow-up</h2>
                <p>Most patients recover within 1-2 weeks. We provide follow-up consultations at 1 week and 1 month post-surgery to monitor healing and ensure optimal outcomes.</p>
                
                <div className="mt-4">
                    <a href="/contact" className="btn btn-primary">Schedule Consultation</a>
                </div>
            </div>
        </>
    );
}
