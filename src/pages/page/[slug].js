import React from 'react';
import DynamicPage from '@/Components/Dynamicpage/Dynamicpage';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';
import { getBlogPostSchema, blogPostMapping } from '@/utils/schemas';

export async function getServerSideProps({ params }) {
    try {
        const { slug } = params;
        
        // Fetch page data server-side for SEO
        const [pageResponse, settingsResponse] = await Promise.all([
            axiosInstance.get(`get-dynamic-page/${slug}`),
            axiosInstance.get('general-settings')
        ]);

        if (!pageResponse.data) {
            return {
                notFound: true
            };
        }

        // Find blog post mapping to determine author and topic
        const blogMapping = blogPostMapping.find(post => post.slug === slug);
        const authorType = blogMapping?.author === 'dr-prathyusha-gynecologist' ? 'dr-prathyusha' : 'dr-naveen';

        return {
            props: {
                pageData: pageResponse.data,
                generalSettings: settingsResponse.data || null,
                slug: slug,
                authorType: authorType,
                about: blogMapping?.about || ''
            }
        };
    } catch (error) {
        console.error('Error fetching page:', error);
        return {
            notFound: true
        };
    }
}

export default function PageDynamic({ pageData, generalSettings, slug, authorType, about }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    const title = pageData?.page_name || pageData?.title || 'Page';
    const description = pageData?.meta_description || pageData?.short_description || `Learn more about ${title} at ${siteName}`;
    
    // Prepare blog post schema data
    const blogSchemaData = {
        slug: slug,
        title: title,
        description: description,
        datePublished: pageData?.created_at ? new Date(pageData.created_at).toISOString().split('T')[0] : undefined,
        dateModified: pageData?.updated_at ? new Date(pageData.updated_at).toISOString().split('T')[0] : undefined,
        authorType: authorType,
        about: about
    };
    
    return (
        <>
            <Head>
                <title>{`${title} - ${siteName}`}</title>
                <meta name="description" content={description} />
                
                {/* Open Graph */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={`${title} - ${siteName}`} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={`https://www.a1laparoscopyhospital.com/page/${slug}`} />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={`${title} - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href={`https://www.a1laparoscopyhospital.com/page/${slug}`} />
                
                {/* Structured Data - MedicalWebPage Schema for Blog Posts */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(getBlogPostSchema(blogSchemaData))
                    }}
                />
            </Head>
            <DynamicPage initialPageData={pageData} />
        </>
    );
}
