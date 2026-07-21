import React from 'react';
import { useRouter } from 'next/router';
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

export default function GalleryRedirect({ generalSettings }) {
    const router = useRouter();
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    // Redirect to image-gallery
    React.useEffect(() => {
        router.replace('/image-gallery');
    }, [router]);
    
    return (
        <>
            <Head>
                <title>{`Gallery - ${siteName}`}</title>
                <meta name="robots" content="noindex, follow" />
                <link rel="canonical" href="https://a1laparoscopyhospital.com/image-gallery/" />
            </Head>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <p>Redirecting to gallery...</p>
            </div>
        </>
    );
}
