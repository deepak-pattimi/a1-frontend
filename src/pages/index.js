import React from 'react';
import Home from '@/Components/Home';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getHomepageSchema } from '@/utils/schemas';

/**
 * Safely serialize an object for Next.js props.
 * Replaces `undefined` values (which Next.js cannot serialize) with `null`.
 */
function safeSerialize(obj) {
    return JSON.parse(JSON.stringify(obj, (_, v) => (v === undefined ? null : v)));
}

export async function getServerSideProps() {
    try {
        // Only fetch lightweight, SEO-critical data server-side.
        // Heavy data (gallery) is loaded client-side to keep payload under 128 kB.
        const [bannersResponse, specializedResponse, departmentsResponse, settingsResponse] =
            await Promise.all([
                axiosInstance.get('get-banners-list').catch(() => ({ data: [] })),
                axiosInstance.get('get-specialized-list').catch(() => ({ data: [] })),
                axiosInstance.get('get-depratments-list').catch(() => ({ data: [] })),
                axiosInstance.get('general-settings').catch(() => ({ data: null })),
            ]);

        const banners = Array.isArray(bannersResponse.data)
            ? safeSerialize(
                bannersResponse.data
                    .sort((a, b) => (a.order_position ?? 0) - (b.order_position ?? 0))
              )
            : [];

        const specialized = Array.isArray(specializedResponse.data)
            ? safeSerialize(
                specializedResponse.data
                    .sort((a, b) => (a.order_position ?? 0) - (b.order_position ?? 0))
              )
            : [];

        // Strip the heavy HTML `content` field from departments to reduce payload
        const departments = Array.isArray(departmentsResponse.data)
            ? safeSerialize(
                departmentsResponse.data
                    .sort((a, b) => (a.order_position ?? 0) - (b.order_position ?? 0))
                    .map(({ content: _content, ...rest }) => rest) // omit content
              )
            : [];
            
        const generalSettings = settingsResponse.data ? safeSerialize(settingsResponse.data) : null;

        return {
            props: { banners, specialized, departments, generalSettings },
        };
    } catch (error) {
        console.error('Error fetching homepage data:', error);
        return {
            props: { banners: [], specialized: [], departments: [], generalSettings: null },
        };
    }
}

export default function HomePage({ banners, specialized, departments, generalSettings }) {
    return (
        <>
            <Head>
                <title>{generalSettings?.title || 'Laparoscopic Surgeon | A1 Laparoscopy | Vizag'}</title>
                <meta
                    name="description"
                    content={generalSettings?.meta_description || 'Expert laparoscopic, bariatric & piles surgery with 17+ years of experience. Faster recovery, less pain & affordable care. Book your appointment today!'}
                />
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(getHomepageSchema()) }}
                />
            </Head>

            <Home
                initialBanners={banners}
                initialSpecialized={specialized}
                initialDepartments={departments}
            />
        </>
    );
}
