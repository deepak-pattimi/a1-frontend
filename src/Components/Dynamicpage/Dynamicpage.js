import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axiosInstance from '../../utils/axiosConfig';
import { Helmet, HelmetProvider } from 'react-helmet-async';
// import "react-tabs/style/react-tabs.css"; // Moved to _app.js
// import "react-toastify/dist/ReactToastify.css"; // Moved to _app.js
import loader from "../../assets/loader/loader.gif";

const DynamicPage = ({ initialPageData }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [pageData, setPageData] = useState(initialPageData || null);
  const [loading, setLoading] = useState(!initialPageData);
  const [error, setError] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);

  // Determine if current page is a blog post
  const isBlogPost = pageData &&
    (pageData.page_category?.toLowerCase().includes('blog') ||
      pageData.page_type?.toLowerCase().includes('blog') ||
      (pageData.page_name?.toLowerCase().includes('blog') ||
        pageData.page_name?.toLowerCase().includes('post')));

  useEffect(() => {
    if (!slug) return;

    // If initialPageData matches the current slug parameter, use it directly
    if (initialPageData && (initialPageData.slug === slug || initialPageData.page_slug === slug)) {
      setPageData(initialPageData);
      setLoading(false);
      return;
    }

    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`get-dynamic-page/${slug}`);

        if (!response.data) {
          throw new Error('Page not found');
        }
        setPageData(response.data);
      } catch (error) {
        console.error('Error fetching page data:', error);
        // Network errors are already handled by axios interceptor
        if (error.isNetworkError || error.isTimeoutError) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError(error.message || 'Failed to load page');
        }
        if (error.response?.status === 404) {
          router.replace('/404');
        }
      } finally {
        setLoading(false);
      }
    };

    return () => {
      if (!initialPageData) {
        setPageData(null);
        setLoading(true);
        setError(null);
        setOtherBlogs([]);
      }
    };
  }, [slug, router, initialPageData]);

  // Effect to fetch other blogs after page data is loaded
  useEffect(() => {
    if (pageData && isBlogPost) {
      fetchOtherBlogs(pageData.id);
    }
  }, [pageData, isBlogPost]);

  const fetchOtherBlogs = async (currentBlogId) => {
    try {
      setBlogsLoading(true);
      // Use the correct endpoint for blogs
      const response = await axiosInstance.get('get-blogs-list');
      
      // Handle the nested structure of get-blogs-list
      let blogList = [];
      if (response.data?.blogs?.data && Array.isArray(response.data.blogs.data)) {
        blogList = response.data.blogs.data;
      } else if (response.data && Array.isArray(response.data)) {
        blogList = response.data;
      }

      if (blogList.length > 0) {
        // Filter out the current blog post and map fields for compatibility
        const filteredBlogs = blogList
          .filter(blog => blog.id !== currentBlogId)
          .map(blog => ({
            ...blog,
            // Ensure fields like page_name exist for the UI to render correctly
            page_name: blog.blog_title || blog.page_name || 'Untitled Post',
            slug: blog.slug || '',
            content: blog.blog_content || blog.content || ''
          }));
          
        // Limit to 3 other blogs
        setOtherBlogs(filteredBlogs.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching other blogs:', error);
      // Fallback: Try pages by category as a last resort
      try {
        const response = await axiosInstance.get('get-pages-by-category/Blog');
        if (response.data && Array.isArray(response.data)) {
          const filteredBlogs = response.data.filter(blog => blog.id !== currentBlogId);
          setOtherBlogs(filteredBlogs.slice(0, 3));
        }
      } catch (altError) {
        console.error('Alternative fetch also failed:', altError);
        setOtherBlogs([]);
      }
    } finally {
      setBlogsLoading(false);
    }
  };


  const toggleItem = (id) => {
    setExpandedItem(prev => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <img src={loader.src} alt="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5 text-center">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="container my-5 text-center">
        <h2>Page Not Found</h2>
        <p>The requested page could not be found.</p>
      </div>
    );
  }

  return (
    <HelmetProvider>
      {/* Helmet for dynamic meta tags */}
      <Helmet>
        <title>{pageData.seo_title || pageData.page_name || 'Dynamic Page'}</title>
        <meta name="description" content={pageData.seo_description || ''} />
        <meta name="keywords" content={pageData.seo_keywords || ''} />
      </Helmet>

      <div className="container mt-4 mb-5">
        {/* Enhanced Breadcrumb */}
        <nav aria-label="breadcrumb" className="custom-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">
                <i className="fas fa-home me-1"></i> Home /
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {pageData.page_name}
            </li>
          </ol>
        </nav>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold">{pageData.page_name}</h1>
              <div className="title-underline"></div>
            </div>


            {/* Enhanced Main Content Section with attractive styling */}
            <div className="content-wrapper mt-5 pt-4 border-top">
              <style>
                {`
                    .content-wrapper {
                      font-family: 'Open Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      line-height: 1.8;
                      color: #333;
                      background: #ffffff;
                      border-radius: 12px;
                      padding: 30px;
                      box-shadow: 0 5px 25px rgba(0,0,0,0.08);
                      position: relative;
                      overflow: hidden;
                    }
                    
                    .content-wrapper:before {
                      content: '';
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 5px;
                      height: 100%;
                      background: linear-gradient(to bottom, #3498db, #1abc9c);
                    }
                    
                    .title-underline {
                      width: 80px;
                      height: 4px;
                      background: linear-gradient(to right, #3498db, #1abc9c);
                      margin: 15px auto;
                      border-radius: 2px;
                    }
                    
                    .content-wrapper h1,
                    .content-wrapper h2,
                    .content-wrapper h3,
                    .content-wrapper h4,
                    .content-wrapper h5,
                    .content-wrapper h6 {
                      margin-top: 2rem;
                      margin-bottom: 1.3rem;
                      color: #2c3e50;
                      font-weight: 700;
                      line-height: 1.3;
                      position: relative;
                    }
                    
                    .content-wrapper h1 {
                      font-size: 2.6rem;
                      border-bottom: 3px solid #3498db;
                      padding-bottom: 0.8rem;
                      margin-bottom: 2.2rem;
                      display: inline-block;
                    }
                    
                    .content-wrapper h1:after {
                      content: '';
                      position: absolute;
                      bottom: -3px;
                      left: 0;
                      width: 40%;
                      height: 3px;
                      background: linear-gradient(to right, #3498db, #1abc9c);
                      border-radius: 3px;
                    }
                    
                    .content-wrapper h2 {
                      font-size: 2.1rem;
                      border-bottom: 2px solid #3498db;
                      padding-bottom: 0.6rem;
                      margin-bottom: 2rem;
                      position: relative;
                      color: #2c3e50;
                    }
                    
                    .content-wrapper h2:before {
                      content: '';
                      position: absolute;
                      left: 0;
                      bottom: -8px;
                      width: 70px;
                      height: 3px;
                      background: #1abc9c;
                      border-radius: 3px;
                    }
                    
                    .content-wrapper h3 {
                      font-size: 1.6rem;
                      color: #34495e;
                    }
                    
                    .content-wrapper h4 {
                      font-size: 1.4rem;
                      color: #34495e;
                    }
                    
                    .content-wrapper p {
                      margin-bottom: 1.6rem;
                      font-size: 1.1rem;
                      text-align: justify;
                      color: #444;
                      line-height: 1.9;
                      letter-spacing: 0.3px;
                    }
                    
                    .content-wrapper a {
                      color: #3498db;
                      text-decoration: none;
                      font-weight: 600;
                      position: relative;
                      transition: all 0.3s;
                      padding-bottom: 2px;
                    }
                    
                    .content-wrapper a:after {
                      content: '';
                      position: absolute;
                      width: 0;
                      height: 2px;
                      bottom: 0;
                      left: 0;
                      background: #1abc9c;
                      transition: width 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
                    }
                    
                    .content-wrapper a:hover {
                      color: #2980b9;
                    }
                    
                    .content-wrapper a:hover:after {
                      width: 100%;
                    }
                    
                    /* Custom Breadcrumb Styles */
                    .custom-breadcrumb {
                      background-color: #f8f9fa;
                      border-radius: 8px;
                      padding: 12px 20px;
                      margin-bottom: 30px;
                      box-shadow: 0 3px 10px rgba(0,0,0,0.05);
                    }
                    
                    .custom-breadcrumb .breadcrumb {
                      margin-bottom: 0;
                      background-color: transparent;
                      padding: 0;
                    }
                    
                    .custom-breadcrumb .breadcrumb-item {
                      font-size: 0.95rem;
                    }
                    
                    .custom-breadcrumb .breadcrumb-item.active {
                      color: #2c3e50;
                      font-weight: 600;
                    }
                    
                    .custom-breadcrumb .breadcrumb-item a {
                      color: #3498db;
                      text-decoration: none;
                      display: flex;
                      align-items: center;
                      transition: color 0.3s;
                    }
                    
                    .custom-breadcrumb .breadcrumb-item a:hover {
                      color: #1abc9c;
                      text-decoration: underline;
                    }
                    
                    .custom-breadcrumb .breadcrumb-item+.breadcrumb-item::before {
                      color: #3498db;
                      content: "\\00a0\\00a0/\\00a0\\00a0"; /* Space slash space */
                      font-weight: 600;
                      padding: 0;
                    }
                    
                    .content-wrapper ul,
                    .content-wrapper ol {
                      padding-left: 2.2rem;
                      margin-bottom: 1.8rem;
                      list-style: none; /* Remove default list styling */
                    }
                    
                    .content-wrapper li {
                      margin-bottom: 0.3rem; /* Further reduced gap between list items */
                      position: relative;
                      padding-left: 1.5rem;
                      line-height: 1.7;
                      list-style: none; /* Ensure no default list styling */
                    }
                    
                    .content-wrapper li:before {
                      content: '';
                      position: absolute;
                      left: 0;
                      top: 0.7rem;
                      width: 8px;
                      height: 8px;
                      background: #3498db;
                      border-radius: 50%;
                      transition: all 0.3s;
                    }
                    
                    .content-wrapper li:hover:before {
                      background: #1abc9c;
                      transform: scale(1.2);
                    }
                    
                    .content-wrapper ol li:before {
                      content: counter(li-counter);
                      counter-increment: li-counter;
                      font-size: 0.8rem;
                      background: linear-gradient(to bottom, #3498db, #1abc9c);
                      color: white;
                      border-radius: 50%;
                      width: 24px;
                      height: 24px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      position: absolute;
                      left: 0;
                      top: 0.4rem;
                    }
                    
                    .content-wrapper blockquote {
                      border-left: 5px solid #1abc9c;
                      background: linear-gradient(to bottom right, #f8f9fa, #e9ecef);
                      padding: 2rem 2.5rem;
                      margin: 2.5rem 0;
                      font-style: italic;
                      color: #555;
                      position: relative;
                      border-radius: 0 8px 8px 0;
                      font-size: 1.25rem;
                      box-shadow: 0 6px 15px rgba(0,0,0,0.06);
                      border: 1px solid #e0e7ee;
                    }
                    
                    .content-wrapper blockquote:before {
                      content: '"';
                      position: absolute;
                      top: 10px;
                      left: 10px;
                      font-size: 3rem;
                      color: rgba(52, 152, 219, 0.2);
                      font-family: Georgia, serif;
                    }
                    
                    .content-wrapper img {
                      max-width: 100%;
                      height: auto;
                      border-radius: 12px;
                      margin: 2rem 0;
                      box-shadow: 0 10px 30px rgba(0,0,0,0.12);
                      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                      border: 1px solid #eee;
                    }
                    
                    .content-wrapper img:hover {
                      transform: translateY(-8px);
                      box-shadow: 0 15px 40px rgba(0,0,0,0.18);
                    }
                    
                    .content-wrapper table {
                      width: 100%;
                      border-collapse: collapse;
                      margin: 2.2rem 0;
                      box-shadow: 0 6px 18px rgba(0,0,0,0.07);
                      border-radius: 10px;
                      overflow: hidden;
                      border: 1px solid #e0e7ee;
                    }
                    
                    .content-wrapper th,
                    .content-wrapper td {
                      padding: 1.2rem 1.5rem;
                      text-align: left;
                      border-bottom: 1px solid #eee;
                    }
                    
                    .content-wrapper th {
                      background: linear-gradient(to bottom, #3498db, #2980b9);
                      color: white;
                      font-weight: 600;
                      text-transform: uppercase;
                      letter-spacing: 0.8px;
                      font-size: 0.85rem;
                      text-align: center;
                    }
                    
                    .content-wrapper tr:last-child td {
                      border-bottom: none;
                    }
                    
                    .content-wrapper tr:nth-child(even) {
                      background-color: #f8f9fa;
                    }
                    
                    .content-wrapper tr:hover {
                      background-color: #e3f2fd;
                      transform: scale(1.01);
                      transition: all 0.2s;
                    }
                    
                    .content-wrapper strong {
                      font-weight: 700;
                      color: #2c3e50;
                      background: linear-gradient(to right, #e3f2fd, #d6eaf8);
                      padding: 0.2rem 0.5rem;
                      border-radius: 4px;
                      border-left: 3px solid #3498db;
                    }
                    
                    .content-wrapper em {
                      font-style: italic;
                      color: #e74c3c;
                      background: linear-gradient(to right, #fadbd8, #fadbd8);
                      padding: 0.2rem 0.5rem;
                      border-radius: 4px;
                      border-left: 3px solid #e74c3c;
                    }
                    
                    .content-wrapper hr {
                      border: 0;
                      height: 1px;
                      background: linear-gradient(to right, transparent, #ddd, transparent);
                      margin: 3rem 0;
                      position: relative;
                    }
                    
                    .content-wrapper hr:before {
                      content: '';
                      position: absolute;
                      top: -8px;
                      left: 50%;
                      transform: translateX(-50%);
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #3498db;
                      box-shadow: 0 0 0 8px rgba(52, 152, 219, 0.2);
                    }
                    
                    .content-wrapper code {
                      background-color: #f1f2f6;
                      padding: 0.4rem 0.7rem;
                      border-radius: 6px;
                      font-family: 'Courier New', monospace;
                      font-size: 0.95rem;
                      border: 1px solid #e0e7ee;
                      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
                    }
                    
                    .content-wrapper pre {
                      background: linear-gradient(to bottom, #2c3e50, #1a252f);
                      color: #ecf0f1;
                      padding: 2rem;
                      border-radius: 12px;
                      overflow-x: auto;
                      margin: 2.2rem 0;
                      box-shadow: inset 0 2px 15px rgba(0,0,0,0.3), 0 6px 15px rgba(0,0,0,0.1);
                      border: 1px solid #34495e;
                      position: relative;
                    }
                    
                    .content-wrapper pre code {
                      background: none;
                      color: inherit;
                      padding: 0;
                    }
                    
                    .highlighted-section {
                      background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
                      padding: 2.2rem;
                      border-radius: 15px;
                      margin: 2.5rem 0;
                      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
                      border-left: 5px solid #1abc9c;
                      border: 1px solid #e0e7ee;
                      position: relative;
                      overflow: hidden;
                    }
                    
                    .highlighted-section:before {
                      content: '';
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 4px;
                      background: linear-gradient(to right, #3498db, #1abc9c);
                    }
                    
                    .content-wrapper ul, .content-wrapper ol {
                      counter-reset: li-counter;
                    }
                    
                    .section-card {
                      background: white;
                      border-radius: 15px;
                      padding: 2.2rem;
                      margin: 2.2rem 0;
                      box-shadow: 0 6px 20px rgba(0,0,0,0.06);
                      border: 1px solid #e0e7ee;
                      transition: all 0.3s ease;
                    }
                    
                    .section-card:hover {
                      transform: translateY(-5px);
                      box-shadow: 0 12px 30px rgba(0,0,0,0.1);
                    }
                    
                    /* Blog Card Styles */
                    .blog-card {
                      transition: all 0.3s ease;
                      border: 1px solid #e0e7ee;
                      border-radius: 12px;
                      overflow: hidden;
                    }
                    
                    .blog-card:hover {
                      transform: translateY(-5px);
                      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    }
                    
                    .read-more-btn {
                      border-color: #3498db;
                      color: #3498db;
                      transition: all 0.3s;
                    }
                    
                    .read-more-btn:hover {
                      background-color: #3498db;
                      color: white;
                    }
                    
                    /* Skeleton Loading Styles */
                    .skeleton-title {
                      height: 24px;
                      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                      background-size: 200% 100%;
                      animation: skeleton-loading 1.5s infinite;
                      border-radius: 4px;
                    }
                    
                    .skeleton-text {
                      height: 18px;
                      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                      background-size: 200% 100%;
                      animation: skeleton-loading 1.5s infinite;
                      border-radius: 4px;
                    }
                    
                    .skeleton-text-short {
                      height: 18px;
                      width: 60%;
                      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                      background-size: 200% 100%;
                      animation: skeleton-loading 1.5s infinite;
                      border-radius: 4px;
                    }
                    
                    @keyframes skeleton-loading {
                      0% {
                        background-position: 200% 0;
                      }
                      100% {
                        background-position: -200% 0;
                      }
                    }
                  `}
              </style>

              {pageData.content ? (
                <div className="styled-content" dangerouslySetInnerHTML={{ __html: pageData.content }} />
              ) : (
                <div className="text-center py-5">
                  <h4 className="text-muted">No content available</h4>
                  <p className="text-secondary">Please check back later for updates</p>
                </div>
              )}
            </div>

            {/* FAQ Section - if applicable */}
            {pageData.faqs && pageData.faqs.filter(f => f.answer && f.answer.trim() !== '').length > 0 && (
              <div className="google-faq-container mt-5">
                <h3 className="mb-4">Frequently asked questions</h3>
                <div className="accordion google-faq-accordion" id="faqAccordion">
                  {pageData.faqs.filter(f => f.answer && f.answer.trim() !== '').map((item, index) => {
                    const itemId = item.id || index;
                    return (
                      <div className="accordion-item google-faq-item" key={itemId}>
                        <h2 className="accordion-header google-faq-header" id={`heading${itemId}`}>
                          <button
                            className={`accordion-button google-faq-button ${expandedItem !== itemId ? 'collapsed' : ''}`}
                            type="button"
                            onClick={() => toggleItem(itemId)}
                            aria-expanded={expandedItem === itemId}
                            aria-controls={`collapse${itemId}`}
                          >
                            <span>{item.question}</span>
                          </button>
                        </h2>

                        <div
                          id={`collapse${itemId}`}
                          className={`collapse ${expandedItem === itemId ? 'show' : ''}`}
                          aria-labelledby={`heading${itemId}`}
                        >
                          <div className="accordion-body google-faq-body">
                            <div dangerouslySetInnerHTML={{ __html: item.answer || item.content }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <style jsx>{`
                  .google-faq-container {
                    background-color: #ffffff;
                    color: #202124;
                    padding: 24px;
                    border-radius: 12px;
                    border: 1px solid #dfe1e5;
                    font-family: Roboto, Arial, sans-serif;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                  }
                  .google-faq-container h3 {
                    font-size: 20px;
                    font-weight: 400;
                    margin-bottom: 20px;
                    color: #202124;
                  }
                  .google-faq-accordion {
                    background-color: transparent;
                  }
                  .google-faq-item {
                    background-color: transparent;
                    border: none;
                    border-top: 1px solid #dfe1e5;
                    border-radius: 0;
                  }
                  .google-faq-item:first-of-type {
                    border-top: none;
                  }
                  .google-faq-button {
                    background-color: transparent !important;
                    color: #202124 !important;
                    font-size: 16px;
                    padding: 16px 0;
                    box-shadow: none !important;
                    border: none;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  }
                  .google-faq-button::after {
                    filter: invert(0.5);
                    width: 1.25rem;
                    height: 1.25rem;
                    background-size: 1.25rem;
                  }
                  .google-faq-body {
                    padding: 0 0 16px 0;
                    color: #4d5156;
                    font-size: 14px;
                    line-height: 1.5;
                  }
                `}</style>
              </div>
            )}

          </div>
        </div>

        {/* Show other blogs if this is a blog post */}
        {isBlogPost && otherBlogs.length > 0 && (
          <div className="row mt-5 pt-4 border-top">
            <div className="col-12">
              <h3 className="mb-4 pb-2 border-bottom">Related Articles</h3>
              <div className="row g-4">
                {otherBlogs.map((blog) => (
                  <div key={blog.id} className="col-md-4">
                    <div className="card h-100 blog-card">
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{blog.page_name}</h5>
                        <p className="card-text flex-grow-1">
                          {blog.excerpt ? blog.excerpt : blog.content ?
                            (blog.content.length > 120 ? blog.content.substring(0, 120) + '...' : blog.content) :
                            'Read more about this topic...'}
                        </p>
                        <Link
                          href={`/page/${blog.slug}`}
                          className="btn btn-outline-primary mt-auto read-more-btn"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading state for other blogs */}
        {isBlogPost && blogsLoading && (
          <div className="row mt-5 pt-4 border-top">
            <div className="col-12">
              <h3 className="mb-4">Related Articles</h3>
              <div className="row g-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="col-md-4">
                    <div className="card h-100">
                      <div className="card-body d-flex flex-column">
                        <div className="skeleton-title mb-2"></div>
                        <div className="skeleton-text mb-3"></div>
                        <div className="skeleton-text-short mt-auto"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default DynamicPage;