const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Base URL for the website
const baseUrl = 'https://a1laparoscopyhospital.com';

// API endpoints
const apiBase = 'https://admin.a1laparoscopyhospital.com/api/client/';

async function generateSitemap() {
    console.log('🗺️  Generating sitemap.xml...');
    
    try {
        let pages = [];
        let blogs = [];
        
        // Fetch dynamic data from backend
        try {
            const [pagesResponse, blogsResponse] = await Promise.all([
                axios.get(`${apiBase}get-dynamic-page-category`),
                axios.get(`${apiBase}get-blogs-list`)
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
            if (blogsResponse.data && Array.isArray(blogsResponse.data)) {
                blogs = blogsResponse.data.map(blog => ({
                    slug: blog.slug,
                    updated_at: blog.updated_at || new Date().toISOString()
                }));
            }
        } catch (error) {
            console.error('⚠️  Warning: Could not fetch dynamic data for sitemap:', error.message);
            console.log('   Continuing with static pages only...');
        }
        
        // Define static routes
        const staticRoutes = [
            { slug: '', priority: 1.0, changefreq: 'daily' },
            { slug: 'Aboutdr', priority: 0.8, changefreq: 'monthly' },
            { slug: 'Contact', priority: 0.8, changefreq: 'monthly' },
            { slug: 'Reviews', priority: 0.7, changefreq: 'weekly' },
            { slug: 'Gallery', priority: 0.7, changefreq: 'weekly' },
            { slug: 'image-gallery', priority: 0.7, changefreq: 'weekly' },
            { slug: 'video-gallery', priority: 0.7, changefreq: 'weekly' },
            { slug: 'blogs', priority: 0.9, changefreq: 'daily' },
        ];
        
        // Generate XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${baseUrl}/${route.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
${pages.map(page => `  <url>
    <loc>${baseUrl}/page/${page.slug}</loc>
    <lastmod>${new Date(page.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
${blogs.map(blog => `  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${new Date(blog.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;
        
        // Write sitemap.xml to public directory
        const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
        fs.writeFileSync(sitemapPath, xml);
        
        console.log(`✅ Sitemap generated successfully!`);
        console.log(`   📄 Location: ${sitemapPath}`);
        console.log(`   📊 Total URLs: ${staticRoutes.length + pages.length + blogs.length}`);
        console.log(`   - Static pages: ${staticRoutes.length}`);
        console.log(`   - Dynamic pages: ${pages.length}`);
        console.log(`   - Blog posts: ${blogs.length}`);
        
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

// Run the generator
generateSitemap();
