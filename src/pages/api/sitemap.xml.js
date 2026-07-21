import axiosInstance from '@/utils/axiosConfig';

export default async function handler(req, res) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.a1laparoscopyhospital.com';
    
    try {
        // Fetch dynamic data from backend
        let pages = [];
        let blogs = [];
        
        try {
            const [pagesResponse, blogsResponse] = await Promise.all([
                axiosInstance.get('get-dynamic-page-category'),
                axiosInstance.get('get-blogs-list')
            ]);
            
            // Extract all page slugs from categories
            if (pagesResponse.data && Array.isArray(pagesResponse.data)) {
                pagesResponse.data.forEach(category => {
                    if (category.pages && Array.isArray(category.pages)) {
                        category.pages.forEach(page => {
                            pages.push({
                                slug: page.slug,
                                updated_at: page.updated_at || new Date().toISOString()
                            });
                        });
                    }
                });
            }
            
            // Extract blog slugs
            const blogData = blogsResponse.data?.blogs?.data || blogsResponse.data;
            if (blogData && Array.isArray(blogData)) {
                blogs = blogData.map(blog => ({
                    slug: blog.slug,
                    updated_at: blog.updated_at || new Date().toISOString()
                }));
            }
        } catch (error) {
            console.error('Error fetching sitemap data:', error);
            // Continue with static pages even if API fails
        }
        
        // Define static routes - removed Aboutclinic as it doesn't exist
        const staticRoutes = [
            { slug: '', priority: 1.0, changefreq: 'daily' }, // Homepage
            { slug: 'Aboutdr/', priority: 0.8, changefreq: 'monthly' },
            { slug: 'Contact/', priority: 0.8, changefreq: 'monthly' },
            { slug: 'Reviews/', priority: 0.7, changefreq: 'weekly' },
            { slug: 'Gallery/', priority: 0.7, changefreq: 'weekly' },
            { slug: 'image-gallery/', priority: 0.7, changefreq: 'weekly' },
            { slug: 'video-gallery/', priority: 0.7, changefreq: 'weekly' },
            { slug: 'blogs/', priority: 0.9, changefreq: 'daily' },
        ];
        
        // Generate XML with trailing slashes to match trailingSlash: true in next.config.js
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${baseUrl}/${route.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
${pages.map(page => `  <url>
    <loc>${baseUrl}/page/${page.slug}/</loc>
    <lastmod>${new Date(page.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
${blogs.map(blog => `  <url>
    <loc>${baseUrl}/blog/${blog.slug}/</loc>
    <lastmod>${new Date(blog.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

        
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
        res.status(200).send(xml);
        
    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).json({ error: 'Failed to generate sitemap' });
    }
}
