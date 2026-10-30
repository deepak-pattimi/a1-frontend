import React from 'react';
import Home from '@/Components/Home';
import Head from '@/ui/Head';
import axiosInstance from '@/utils/axiosConfig';
import { getHomepageSchema } from '@/utils/schemas';

/**
 * Safely serialize an object for Next.js props.
 * Replaces `undefined` values (which Next.js cannot serialize) with `null`.
 */
function safeSerialize(obj) {
    return JSON.parse(JSON.stringify(obj, (_, v) => (v === undefined ? null : v)));
}

export async function loadPageData({ res }) {
    if (res) {
        res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
    }
    try {
        // Fast path: try single consolidated endpoint first (<10ms on Node.js backend)
        try {
            const consolidated = await axiosInstance.get('get-homepage-data', { timeout: 3500 });
            if (consolidated.data && consolidated.data.banners) {
                const d = consolidated.data;
                return {
                    props: {
                        banners: safeSerialize(d.banners || []),
                        specialized: safeSerialize(d.specialized || []),
                        departments: safeSerialize(d.departments || []),
                        generalSettings: safeSerialize(d.general_settings || null),
                        categories: safeSerialize(d.categories || []),
                        highlights: safeSerialize(d.highlights || []),
                        firstgallery: safeSerialize(d.firstgallery || []),
                        aboutitems: safeSerialize(d.aboutitems || []),
                        h2Section: safeSerialize(d.home_h2 || null),
                        imagegallery: safeSerialize(d.imagegallery || []),
                        testimonials: safeSerialize(d.testimonials || []),
                        aboutPage: safeSerialize(d.about_page || null),
                        videos: safeSerialize(d.videogallery || []),
                        reviews: safeSerialize(d.reviews || []),
                    },
                };
            }
        } catch {
            // Fallback to parallel requests if consolidated endpoint is not available
        }

        // Fetch all live backend endpoints in parallel (fallback)
        const [
            bannersResponse,
            specializedResponse,
            departmentsResponse,
            settingsResponse,
            highlightsResponse,
            firstgalleryResponse,
            aboutitemsResponse,
            h2Response,
            imagegalleryResponse,
            testimonialsResponse,
            aboutPageResponse,
            videosResponse,
            categoriesResponse,
            reviewsResponse,
        ] = await Promise.all([
            axiosInstance.get('get-banners-list').catch(() => ({ data: [] })),
            axiosInstance.get('get-specialized-list').catch(() => ({ data: [] })),
            axiosInstance.get('get-depratments-list').catch(() => ({ data: [] })),
            axiosInstance.get('general-settings').catch(() => ({ data: null })),
            axiosInstance.get('get-highlights-list').catch(() => ({ data: [] })),
            axiosInstance.get('get-firstgallery-list').catch(() => ({ data: [] })),
            axiosInstance.get('get-aboutitems-list').catch(() => ({ data: [] })),
            axiosInstance.get('get-home-h2').catch(() => ({ data: null })),
            axiosInstance.get('get-imagegallery-list').catch(() => ({ data: [] })),
            axiosInstance.get('get-testimonials-list').catch(() => ({ data: [] })),
            axiosInstance.get('get-about-page').catch(() => ({ data: null })),
            axiosInstance.get('get-videogallery-list').catch(() => ({ data: [] })),
            axiosInstance.get('get-dynamic-page-category').catch(() => ({ data: [] })),
            axiosInstance.get('get-reviews-list').catch(() => ({ data: [] })),
        ]);

        const banners = Array.isArray(bannersResponse.data)
            ? safeSerialize(bannersResponse.data.sort((a, b) => (a.order_position ?? 0) - (b.order_position ?? 0)))
            : [];
        const specialized = Array.isArray(specializedResponse.data)
            ? safeSerialize(specializedResponse.data.sort((a, b) => (a.order_position ?? 0) - (b.order_position ?? 0)))
            : [];
        const departments = Array.isArray(departmentsResponse.data)
            ? safeSerialize(departmentsResponse.data.sort((a, b) => (a.order_position ?? 0) - (b.order_position ?? 0)))
            : [];
        const generalSettings = settingsResponse.data ? safeSerialize(settingsResponse.data) : null;
        const highlights = Array.isArray(highlightsResponse.data) ? safeSerialize(highlightsResponse.data) : [];
        const firstgallery = Array.isArray(firstgalleryResponse.data) ? safeSerialize(firstgalleryResponse.data) : [];
        const aboutitems = Array.isArray(aboutitemsResponse.data) ? safeSerialize(aboutitemsResponse.data) : [];
        const h2Section = h2Response.data ? safeSerialize(h2Response.data) : null;
        const imagegallery = Array.isArray(imagegalleryResponse.data) ? safeSerialize(imagegalleryResponse.data) : [];
        const testimonials = Array.isArray(testimonialsResponse.data) ? safeSerialize(testimonialsResponse.data) : [];
        const aboutPage = aboutPageResponse.data ? safeSerialize(aboutPageResponse.data) : null;
        const videos = Array.isArray(videosResponse.data) ? safeSerialize(videosResponse.data) : [];
        const categories = Array.isArray(categoriesResponse.data) ? safeSerialize(categoriesResponse.data) : [];
        const reviews = Array.isArray(reviewsResponse.data) ? safeSerialize(reviewsResponse.data) : [];

        return {
            props: {
                banners,
                specialized,
                departments,
                generalSettings,
                categories,
                highlights,
                firstgallery,
                aboutitems,
                h2Section,
                imagegallery,
                testimonials,
                aboutPage,
                videos,
                reviews,
            },
        };
    } catch (error) {
        console.error('Error fetching homepage data:', error);
        return {
            props: { banners: [], specialized: [], departments: [], generalSettings: null, categories: [] },
        };
    }
}

export default function HomePage({
    banners,
    specialized,
    departments,
    generalSettings,
    categories = [],
    highlights = [],
    firstgallery = [],
    aboutitems = [],
    h2Section = null,
    imagegallery = [],
    testimonials = [],
    aboutPage = null,
    videos = [],
    reviews = null
}) {
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
                initialHighlights={highlights}
                initialFirstgallery={firstgallery}
                initialAboutitems={aboutitems}
                initialH2Section={h2Section}
                initialImagegallery={imagegallery}
                initialTestimonials={testimonials}
                initialAboutPage={aboutPage}
                initialVideos={videos}
                initialReviews={reviews}
            />
        </>
    );
}
