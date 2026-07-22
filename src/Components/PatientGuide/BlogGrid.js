import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import axiosInstance from '../../utils/axiosConfig';

const BlogGrid = ({ initialBlogs = [], initialGroupedCategories = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedCategories, setGroupedCategories] = useState(initialGroupedCategories);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = useCallback(async (signal) => {
    try {
      setLoading(true);
      
      const params = {};
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await axiosInstance.get('get-blogs-list', { 
        params,
        signal 
      });
      
      const data = response.data;
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
  }, [searchTerm]);

  useEffect(() => {
    // Only re-fetch if we are searching, otherwise use SSR initial data
    if (searchTerm) {
        const controller = new AbortController();
        const delayDebounceFn = setTimeout(() => {
            fetchBlogs(controller.signal);
        }, 500);
        return () => {
            clearTimeout(delayDebounceFn);
            controller.abort();
        };
    } else {
        setGroupedCategories(initialGroupedCategories);
    }
  }, [searchTerm, fetchBlogs, initialGroupedCategories]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderBlogCard = (post) => (
    <Col md={6} lg={4} xl={3} key={post.id} className="mb-4">
      <Card className="blog-card h-100 shadow-sm">
        <Card.Img
          variant="top"
          src={post.blog_image ? (post.blog_image.startsWith('http') ? post.blog_image : `https://admin.a1laparoscopyhospital.com${post.blog_image}`) : 'https://placehold.co/400x250?text=No+Image'}
          className="card-img-top rounded-top"
          alt={post.blog_title}
        />
        <Card.Body className="d-flex flex-column">
          <div className="category-tag mb-2">
            {post.category || 'Blog'}
          </div>
          <Card.Title className="mb-2">
            <Link href={`/blog/${post.slug}`} className="blog-link">
              {post.blog_title}
            </Link>
          </Card.Title>
          <Card.Text as="div" className="flex-grow-1 text-muted">
            {post.blog_content ? post.blog_content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : ''}
          </Card.Text>
          <div className="mt-auto blog-meta">
            <small className="text-muted">
              <i className="fas fa-calendar-alt me-1"></i> {new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} •
              <i className="fas fa-clock ms-1 me-1"></i> {post.read_time || '5 min read'} •
              <i className="fas fa-eye ms-1 me-1"></i> {post.views || 0}
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

  return (
    <div className="blog-grid-page">
      <Container>
        <div className="blog-header text-center mb-5 mt-4">
          <h1 className="display-4 fw-bold">Our Health & Wellness Blog</h1>
          <p className="lead">Stay informed with the latest medical insights and health tips from our experts</p>
        </div>

        <Row className="mb-5 justify-content-center">
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Search articles..."
              className="mb-3 mb-md-0"
              onChange={handleSearch}
              value={searchTerm}
            />
          </Col>
        </Row>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            {groupedCategories && groupedCategories.length > 0 ? (
                groupedCategories.map(category => (
                    category.blogs && category.blogs.length > 0 && (
                        <div key={category.id} className="mb-5">
                            <h2 className="mb-4 border-bottom pb-2" style={{color: '#0d6efd', fontWeight: 'bold'}}>{category.name}</h2>
                            <Row>
                                {category.blogs.map(post => renderBlogCard(post))}
                            </Row>
                        </div>
                    )
                ))
            ) : (
                <div className="text-center py-5">
                  <h3>No blog posts found</h3>
                  <p className="text-muted">Try adjusting your search or filter criteria</p>
                </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default BlogGrid;