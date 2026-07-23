import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Image, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaUser, FaTags, FaArrowLeft, FaShareAlt, FaHeart, FaComment, FaThumbsUp } from 'react-icons/fa';
import { API_URL } from '../constants';
// import './BlogDetail.css'; // Moved to _app.js

const BlogDetail = ({ initialBlog, initialRelatedPosts = [], initialPopularPosts = [] }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [blogPost, setBlogPost] = useState(initialBlog || null);
  const [relatedPosts, setRelatedPosts] = useState(initialRelatedPosts);
  const [popularPosts, setPopularPosts] = useState(initialPopularPosts);
  const [liked, setLiked] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleItem = (itemId) => {
    if (expandedItem === itemId) {
      setExpandedItem(null); // Collapse if already expanded
    } else {
      setExpandedItem(itemId); // Expand clicked item
    }
  };

  useEffect(() => {
    // If we have initial data from SSR, don't fetch again unless slug changes
    if (initialBlog && !slug) {
      return;
    }

    const controller = new AbortController();

    const fetchBlogDetail = async () => {
      try {
        const response = await fetch(`${API_URL}get-blog-detail/${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: controller.signal
        });
        const data = await response.json();

        if (response.ok) {
          setBlogPost(data.blog);
          setRelatedPosts(data.related || []);
          setPopularPosts(data.popular || []);
          setLiked(data.is_liked || false);
        } else {
          setBlogPost(null);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching blog detail:', error);
        }
      }
    };

    if (slug && !initialBlog) {
      fetchBlogDetail();
    } else if (slug && initialBlog) {
      // Initial data exists but slug might have changed (client navigation)
      // Related and popular posts can still be fetched
      fetchBlogDetail();
    }

    return () => controller.abort();
  }, [slug, initialBlog]);

  const handleLike = async () => {
    if (liked) return;


    try {
      const response = await fetch(`${API_URL}like-blog/${blogPost.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBlogPost(prev => ({ ...prev, likes: data.likes }));
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blogPost.blog_title,
          text: 'Check out this article!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!blogPost) {
    return (
      <Container className="py-5">
        <Row>
          <Col className="text-center">
            <h2>Blog post not found</h2>
            <Link href="/blogs" className="btn btn-primary">Back to Blogs</Link>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className="blog-detail-page">
      <Container>
        <Row className="mb-4">
          <Col>
            <Link href="/blogs" className="back-link">
              <FaArrowLeft className="me-2" /> Back to Blog
            </Link>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <article className="blog-article">
              <header className="blog-header mb-4">
                <div className="category-tag article">{blogPost.category}</div>
                <h1 className="display-4 mt-3 mb-3">{blogPost.blog_title}</h1>

                <div className="blog-meta d-flex flex-wrap gap-3 mb-4">

                  <div className="d-flex align-items-center">
                    <FaCalendarAlt className="me-2 text-primary" />
                    <span suppressHydrationWarning>{new Date(blogPost.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaClock className="me-2 text-primary" />
                    <span>{blogPost.read_time || '5 min read'}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaThumbsUp className="me-2 text-success" />
                    <span>{blogPost.views.toLocaleString()} views</span>
                  </div>
                </div>

                <Image
                  src={blogPost.blog_image ? (blogPost.blog_image.startsWith('http') ? blogPost.blog_image : `https://admin.a1laparoscopyhospital.com${blogPost.blog_image}`) : 'https://placehold.co/800x400?text=No+Image'}
                  alt={blogPost.blog_title}
                  className="img-fluid rounded shadow-sm"
                  fluid
                />
              </header>

              <div
                className="blog-content mt-4"
                dangerouslySetInnerHTML={{ __html: blogPost.blog_content }}
              ></div>

              {/* FAQ Section */}
              {blogPost.faqs && Array.isArray(blogPost.faqs) && blogPost.faqs.filter(f => f.answer && f.answer.trim() !== '').length > 0 && (
                <div className="google-faq-container mt-5">
                  <h3 className="mb-4">Frequently asked questions</h3>
                  <div className="accordion google-faq-accordion" id="faqAccordion">
                    {blogPost.faqs.filter(f => f.answer && f.answer.trim() !== '').map((item, index) => {
                      const itemId = index;
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
                              <div dangerouslySetInnerHTML={{ __html: item.answer }} />
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
              {/* End FAQ Section */}

              <footer className="blog-footer mt-5 pt-4 border-top">
                {blogPost.tags && (
                  <div className="tags-section mb-4">
                    <h5 className="d-inline-block me-3"><FaTags className="me-2" />Tags:</h5>
                    <div className="d-inline-flex flex-wrap gap-2">
                      {/* Handle tags if they are string "tag1, tag2" vs array */}
                      {(typeof blogPost.tags === 'string' ? blogPost.tags.split(',') : blogPost.tags).map((tag, index) => (
                        <Badge key={index} bg="light" text="dark" className="tag-badge">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="action-buttons d-flex gap-3">
                  <Button
                    variant={liked ? "danger" : "outline-primary"}
                    onClick={handleLike}
                    className="d-flex align-items-center"
                  >
                    <FaHeart className="me-2" /> {liked ? 'Liked' : 'Like'}
                    <span className="ms-1">({blogPost.likes || 0})</span>
                  </Button>

                  <Button variant="outline-primary" className="d-flex align-items-center" onClick={handleShare}>
                    <FaShareAlt className="me-2" /> Share
                  </Button>


                </div>
              </footer>
            </article>
          </Col>

          <Col md={4}>
            <div className="blog-detail-sidebar">
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title className="mb-3">Search</Card.Title>
                  <Form.Control
                    type="text"
                    placeholder="Search articles..."
                  />
                </Card.Body>
              </Card>

              {popularPosts.length > 0 && (
                <Card>
                  <Card.Header className="bg-white text-dark border-bottom">
                    Popular Articles
                  </Card.Header>
                  <Card.Body>
                    {popularPosts.map((post) => (
                      <div key={`pop-${post.id}`} className="related-post mb-3 pb-3 border-bottom">
                        <Link href={`/blog/${post.slug}`} className="related-link d-flex">
                          <Image
                            src={post.blog_image ? (post.blog_image.startsWith('http') ? post.blog_image : `https://admin.a1laparoscopyhospital.com${post.blog_image}`) : 'https://placehold.co/100x100?text=No+Image'}
                            className="related-thumb"
                            alt={post.blog_title}
                          />
                          <div>
                            <h6 className="mb-1">{post.blog_title.substring(0, 40)}{post.blog_title.length > 40 ? '...' : ''}</h6>
                            <small className="text-muted" suppressHydrationWarning>
                              {new Date(post.created_at).toLocaleDateString()} • {post.read_time}
                            </small>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogDetail;