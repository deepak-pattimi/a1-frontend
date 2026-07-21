import React from 'react';
import BlogGrid from '@/Components/PatientGuide/BlogGrid';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';

export async function getServerSideProps() {
    try {
        const [settingsResponse, blogsResponse] = await Promise.all([
            axiosInstance.get('general-settings'),
            axiosInstance.get('get-blogs-list')
        ]);

        // Strip heavy content from blogs list to reduce SSR payload size
        const blogs = (blogsResponse.data?.blogs?.data || []).map(blog => {
            const { blog_content, ...rest } = blog;
            return {
                ...rest,
                // Keep only a small snippet for the card description
                excerpt: blog.excerpt || (blog_content ? blog_content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' : '')
            };
        });

        return {
            props: {
                generalSettings: settingsResponse.data || null,
                blogs: blogs,
                groupedCategories: blogsResponse.data?.grouped_categories || []
            }
        };
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return {
            props: {
                generalSettings: null,
                blogs: []
            }
        };
    }
}

export default function BlogsPage({ generalSettings, blogs, groupedCategories }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    
    return (
        <>
            <Head>
                <title>{`Blogs - ${siteName}`}</title>
                <meta name="description" content="Read our latest health tips, medical news, laparoscopic surgery guides, and patient success stories." />
                
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Blogs - ${siteName}`} />
                <meta property="og:description" content="Health tips, medical news, and patient stories" />
                <meta property="og:url" content="https://www.a1laparoscopyhospital.com/blogs" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:title" content={`Blogs - ${siteName}`} />
                
                {/* Canonical */}
                <link rel="canonical" href="https://www.a1laparoscopyhospital.com/blogs/" />
            </Head>
            <BlogGrid initialBlogs={blogs} initialGroupedCategories={groupedCategories} />
        </>
    );
}

