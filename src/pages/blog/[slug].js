import React from 'react';
import BlogDetail from '@/Components/PatientGuide/BlogDetail';
import Head from 'next/head';
import axiosInstance from '@/utils/axiosConfig';

export async function getServerSideProps({ params }) {
    try {
        const { slug } = params;
        
        // Fetch blog data server-side for SEO
        const [blogResponse, settingsResponse] = await Promise.all([
            axiosInstance.get(`get-blog-detail/${slug}`),
            axiosInstance.get('general-settings')
        ]);

        // The API returns { blog: {...}, related: [...], popular: [...] }
        if (!blogResponse.data?.blog) {
            return {
                notFound: true
            };
        }

        return {
            props: {
                blog: blogResponse.data.blog,
                relatedPosts: blogResponse.data.related || [],
                popularPosts: blogResponse.data.popular || [],
                generalSettings: settingsResponse.data || null,
                slug: slug
            }
        };
    } catch (error) {
        console.error('Error fetching blog:', error);
        return {
            notFound: true
        };
    }
}

export default function BlogDetailPage({ blog, relatedPosts, popularPosts, generalSettings, slug }) {
    const siteName = generalSettings?.website_name || 'A1 Laparoscopy Hospital';
    const title = blog?.blog_title || 'Blog Post';
    const description = blog?.short_description || blog?.meta_description || `Read ${title} on ${siteName}`;
    const imageUrl = blog?.blog_image ? (blog.blog_image.startsWith('http') ? blog.blog_image : `https://admin.a1laparoscopyhospital.com/${blog.blog_image}`) : generalSettings?.logo;
    
    return (
        <>
            <Head>
                <title>{`${title} - ${siteName}`}</title>
                <meta name="description" content={description} />
                
                {/* Open Graph */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={`${title} - ${siteName}`} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:url" content={`https://a1laparoscopyhospital.com/blog/${slug}`} />
                <meta property="article:published_time" content={blog?.created_at} />
                <meta property="article:modified_time" content={blog?.updated_at} />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={`${title} - ${siteName}`} />
                <meta property="twitter:description" content={description} />
                <meta property="twitter:image" content={imageUrl} />
                
                {/* Canonical */}
                <link rel="canonical" href={`https://a1laparoscopyhospital.com/blog/${slug}`} />
                
                {/* Structured Data for Article */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Article',
                            headline: title,
                            description: description,
                            image: imageUrl,
                            datePublished: blog?.created_at,
                            dateModified: blog?.updated_at,
                            author: {
                                '@type': 'Person',
                                name: blog?.author || 'Dr. Naveen Kumar Anem'
                            },
                            publisher: {
                                '@type': 'Organization',
                                name: siteName,
                                logo: {
                                    '@type': 'ImageObject',
                                    url: generalSettings?.logo
                                }
                            }
                        })
                    }}
                />
            </Head>
            <BlogDetail 
                initialBlog={blog} 
                initialRelatedPosts={relatedPosts} 
                initialPopularPosts={popularPosts} 
            />
        </>
    );
}
