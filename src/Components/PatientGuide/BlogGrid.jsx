import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Spinner } from 'react-bootstrap';
import Link from '@/ui/Link';
import axiosInstance from '../../utils/axiosConfig';
import { getImageUrl } from '../../utils/imageUtils';

const ITEMS_PER_PAGE = 12;

const BlogGrid = ({ initialBlogs = [], initialGroupedCategories = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState(initialBlogs);
  const [groupedCategories, setGroupedCategories] = useState(initialGroupedCategories);
  const [loading, setLoading] = useState(false);

  // Normalize all available blogs
  const allBlogsList = useMemo(() => {
    if (blogs && blogs.length > 0) {
      return blogs;
    }
    // Fallback: extract blogs from grouped categories if blogs list was empty
    const collected = [];
    (groupedCategories || []).forEach(cat => {
      (cat.blogs || []).forEach(b => {
        if (!collected.some(existing => existing.id === b.id)) {
          collected.push({
            ...b,
            blogCategory: b.blogCategory || { id: cat.id, name: cat.name, slug: cat.slug }
          });
        }
      });
    });
    return collected;
  }, [blogs, groupedCategories]);

  // Extract clean categories list with blog counts
  const categoriesList = useMemo(() => {
    return (groupedCategories || []).map(cat => {
      const blogsInCat = allBlogsList.filter(b => 
        b.blog_category_id === cat.id || 
        b.blogCategory?.id === cat.id || 
        b.blogCategory?.slug === cat.slug ||
        b.blog_category?.slug === cat.slug ||
        b.category === cat.name
      );
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        count: cat.blogs_count ?? blogsInCat.length
      };
    });
  }, [groupedCategories, allBlogsList]);

  // Real-time API search handler if searching on server
  const fetchBlogs = useCallback(async (searchQuery, signal) => {
    try {
      setLoading(true);
      const params = { per_page: 100 };
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await axiosInstance.get('get-blogs-list', { params, signal });
      const data = response.data;

      if (data.blogs?.data) {
        const sanitized = data.blogs.data.map(b => {
          const { blog_content: _content, ...rest } = b;
          return {
            ...rest,
            excerpt: b.excerpt || (b.blog_content ? b.blog_content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' : '')
          };
        });
        setBlogs(sanitized);
      }

      if (data.grouped_categories) {
        setGroupedCategories(data.grouped_categories);
      }
      setLoading(false);
    } catch (error) {
      if (error.name !== 'AbortError' && error.message !== 'canceled') {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTerm.trim()) {
      const controller = new AbortController();
      const delayDebounceFn = setTimeout(() => {
        fetchBlogs(searchTerm.trim(), controller.signal);
      }, 400);
      return () => {
        clearTimeout(delayDebounceFn);
        controller.abort();
      };
    } else {
      setBlogs(initialBlogs);
      setGroupedCategories(initialGroupedCategories);
    }
  }, [searchTerm, fetchBlogs, initialBlogs, initialGroupedCategories]);

  // Filtered blogs based on Category & Search
  const filteredBlogs = useMemo(() => {
    let result = allBlogsList;

    if (selectedCategory !== 'all') {
      result = result.filter(b => {
        const catSlug = b.blogCategory?.slug || b.blog_category?.slug;
        const catName = b.blogCategory?.name || b.blog_category?.name || b.category;
        const catId = b.blog_category_id || b.blogCategory?.id;

        return (
          catSlug === selectedCategory ||
          catName === selectedCategory ||
          String(catId) === String(selectedCategory)
        );
      });
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(b => 
        (b.blog_title && b.blog_title.toLowerCase().includes(q)) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allBlogsList, selectedCategory, searchTerm]);

  // Pagination calculation
  const totalBlogs = filteredBlogs.length;
  const totalPages = Math.ceil(totalBlogs / ITEMS_PER_PAGE) || 1;
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBlogs, currentPage]);

  const handleCategoryChange = (slugOrName) => {
    setSelectedCategory(slugOrName);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 320, behavior: 'smooth' });
      }
    }
  };

  const renderBlogCard = (post) => {
    const categoryName = post.blogCategory?.name || post.blog_category?.name || post.category || 'Health & Care';

    return (
      <Col md={6} lg={4} xl={3} key={post.id} className="mb-4">
        <Card className="blog-card h-100 shadow-sm border-0">
          <Link href={`/blog/${post.slug}`} className="text-decoration-none">
            <Card.Img
              variant="top"
              loading="lazy"
              decoding="async"
              src={post.blog_image ? getImageUrl(post.blog_image) : 'https://placehold.co/400x250?text=No+Image'}
              className="card-img-top rounded-top"
              alt={post.blog_title}
            />
          </Link>
          <Card.Body className="d-flex flex-column">
            <div className="category-tag mb-2" title={categoryName}>
              {categoryName}
            </div>
            <Card.Title className="mb-2">
              <Link href={`/blog/${post.slug}`} className="blog-link">
                {post.blog_title}
              </Link>
            </Card.Title>
            <Card.Text as="div" className="flex-grow-1 text-muted">
              {post.excerpt || (post.blog_content ? post.blog_content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : '')}
            </Card.Text>
            <div className="mt-auto blog-meta">
              <small className="text-muted" suppressHydrationWarning>
                <i className="fas fa-calendar-alt me-1"></i> {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                {post.read_time && <> • <i className="fas fa-clock ms-1 me-1"></i> {post.read_time}</>}
              </small>
            </div>
            <div className="mt-2">
              <Link href={`/blog/${post.slug}`} className="btn-read-more mt-2">
                Read More
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <div className="blog-grid-page">
      <Container>
        {/* Header Section */}
        <div className="blog-header text-center mb-4 mt-2">
          <h1 className="display-4 fw-bold">Our Health & Wellness Blog</h1>
          <p className="lead">Stay informed with the latest medical insights, expert advice, and laparoscopic care guides</p>
        </div>

        {/* Search Bar */}
        <Row className="mb-4 justify-content-center">
          <Col md={8} lg={6}>
            <div className="position-relative">
              <Form.Control
                type="text"
                placeholder="Search articles by title or keyword..."
                className="py-2 px-3 shadow-sm"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                value={searchTerm}
              />
            </div>
          </Col>
        </Row>

        {/* Category Filter Tabs */}
        <div className="category-filter d-flex flex-wrap justify-content-center gap-2 mb-4">
          <button
            type="button"
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            All Blogs ({allBlogsList.length})
          </button>
          {categoriesList.map(cat => (
            <button
              key={cat.id || cat.slug}
              type="button"
              className={`category-btn ${selectedCategory === cat.slug || selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.slug || cat.name)}
            >
              {cat.name} {cat.count > 0 ? `(${cat.count})` : ''}
            </button>
          ))}
        </div>

        {/* Results Counter / Feedback */}
        <div className="d-flex justify-content-between align-items-center mb-4 px-2">
          <span className="text-muted small">
            Showing {totalBlogs > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} – {Math.min(currentPage * ITEMS_PER_PAGE, totalBlogs)} of {totalBlogs} articles
            {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
          </span>
          {selectedCategory !== 'all' && (
            <button 
              className="btn btn-sm btn-link text-decoration-none p-0 text-primary"
              onClick={() => handleCategoryChange('all')}
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="d-flex justify-content-center my-5 py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading blogs...</span>
            </Spinner>
          </div>
        ) : paginatedBlogs.length > 0 ? (
          <>
            <Row>
              {paginatedBlogs.map(post => renderBlogCard(post))}
            </Row>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav aria-label="Blog pagination" className="d-flex justify-content-center mt-5 mb-4">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      &laquo;
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <li
                      key={pageNumber}
                      className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-5 my-4">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h3>No blog posts found</h3>
            <p className="text-muted">
              {searchTerm 
                ? `No articles matched your search "${searchTerm}".`
                : 'No articles found in this category.'}
            </p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setCurrentPage(1);
              }}
            >
              View All Articles
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default BlogGrid;
