import React from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Blogs() {
  // Static blog data
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Hormonal Imbalances",
      excerpt: "Learn about the causes and treatments for hormonal imbalances and how they affect your daily life.",
      category: "Endocrinology",
      date: "2024-01-15",
      readTime: "5 min read",
      image: "https://placehold.co/400x250/3498db/ffffff?text=Hormones"
    },
    {
      id: 2,
      title: "The Benefits of Minimally Invasive Surgery",
      excerpt: "Explore how laparoscopic techniques have revolutionized surgical procedures and patient recovery.",
      category: "Surgery",
      date: "2024-01-10",
      readTime: "7 min read",
      image: "https://placehold.co/400x250/e74c3c/ffffff?text=Surgery"
    },
    {
      id: 3,
      title: "Nutrition Tips for Women's Health",
      excerpt: "Essential nutrients and dietary recommendations specifically for women's health throughout life stages.",
      category: "Nutrition",
      date: "2024-01-05",
      readTime: "6 min read",
      image: "https://placehold.co/400x250/2ecc71/ffffff?text=Nutrition"
    },
    {
      id: 4,
      title: "Managing Stress in Modern Life",
      excerpt: "Effective strategies for managing stress and maintaining mental wellness in our busy lives.",
      category: "Mental Health",
      date: "2024-01-01",
      readTime: "4 min read",
      image: "https://placehold.co/400x250/f39c12/ffffff?text=Stress"
    }
  ];

  const filteredPosts = {
    gynecology: blogPosts.slice(0, 2),
    infertility: blogPosts.slice(2, 4),
    maternity: blogPosts.slice(0, 2),
    surgery: blogPosts.slice(1, 3),
    laparoscopic: blogPosts.slice(2, 4)
  };

  return (
    <div className="blogs-page">
      <Container>
        <div className="breadcrums py-4">
          <div className="row pt-4">
            <div className="col-auto col-md-10">
              <nav aria-label="breadcrumb" className="second">
                <ol className="breadcrumb indigo lighten-6 first">
                  <li className="breadcrumb-item font-weight-bold">
                    <Link className="black-text text-uppercase bread_a" to="/">
                      <span className="mr-md-3 mr-2">Home</span>
                    </Link>
                    <i className="fa fa-angle-double-right" aria-hidden="true" />
                  </li>
                  <li className="breadcrumb-item font-weight-bold">
                    <Link className="black-text text-uppercase bread_a" to="/patient-guide">
                      <span className="mr-md-3 mr-2">Patient Guide</span>
                    </Link>
                    <i className="fa fa-angle-double-right text-uppercase" aria-hidden="true" />
                  </li>
                  <li className="breadcrumb-item font-weight-bold">
                    <span className="black-text text-uppercase bread_a active-2">Blogs</span>
                  </li>
                </ol>
              </nav>
            </div>
            <h1 className='Title_header'>Our Treatment Blogs</h1>
          </div>
        </div>

        <div className="text-center my-4">
          <Link to="/blogs" className="btn btn-primary btn-lg">View Our Modern Blog Layout</Link>
        </div>

        <div className='container px-0'>
          <Tabs
            defaultActiveKey="gynecology"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="gynecology" title="Gynecology">
              <div className='container-fluid'>
                <Row>
                  {filteredPosts.gynecology.map((post) => (
                    <Col md={6} lg={4} xl={3} key={`gyn-${post.id}`} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <Card.Img variant="top" src={post.image} alt={post.title} />
                        <Card.Body className="d-flex flex-column">
                          <div className="category-tag mb-2">
                            {post.category}
                          </div>
                          <Card.Title className="mb-2">
                            <Link to={`/blog/${post.id}`} className="blog-link">
                              {post.title}
                            </Link>
                          </Card.Title>
                          <Card.Text className="flex-grow-1 text-muted">
                            {post.excerpt}
                          </Card.Text>
                          <div className="mt-auto blog-meta">
                            <small className="text-muted">
                              <i className="fas fa-calendar-alt me-1"></i> {post.date} • 
                              <i className="fas fa-clock ms-1 me-1"></i> {post.readTime}
                            </small>
                          </div>
                          <div className="mt-2">
                            <Link to={`/blog/${post.id}`} className="btn btn-outline-primary btn-sm mt-2">
                              Read More
                            </Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Tab>
            
            <Tab eventKey="infertility" title="Infertility">
              <div className='container-fluid'>
                <Row>
                  {filteredPosts.infertility.map((post) => (
                    <Col md={6} lg={4} xl={3} key={`inf-${post.id}`} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <Card.Img variant="top" src={post.image} alt={post.title} />
                        <Card.Body className="d-flex flex-column">
                          <div className="category-tag mb-2">
                            {post.category}
                          </div>
                          <Card.Title className="mb-2">
                            <Link to={`/blog/${post.id}`} className="blog-link">
                              {post.title}
                            </Link>
                          </Card.Title>
                          <Card.Text className="flex-grow-1 text-muted">
                            {post.excerpt}
                          </Card.Text>
                          <div className="mt-auto blog-meta">
                            <small className="text-muted">
                              <i className="fas fa-calendar-alt me-1"></i> {post.date} • 
                              <i className="fas fa-clock ms-1 me-1"></i> {post.readTime}
                            </small>
                          </div>
                          <div className="mt-2">
                            <Link to={`/blog/${post.id}`} className="btn btn-outline-primary btn-sm mt-2">
                              Read More
                            </Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Tab>
            
            <Tab eventKey="maternity" title="Maternity">
              <div className='container-fluid'>
                <Row>
                  {filteredPosts.maternity.map((post) => (
                    <Col md={6} lg={4} xl={3} key={`mat-${post.id}`} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <Card.Img variant="top" src={post.image} alt={post.title} />
                        <Card.Body className="d-flex flex-column">
                          <div className="category-tag mb-2">
                            {post.category}
                          </div>
                          <Card.Title className="mb-2">
                            <Link to={`/blog/${post.id}`} className="blog-link">
                              {post.title}
                            </Link>
                          </Card.Title>
                          <Card.Text className="flex-grow-1 text-muted">
                            {post.excerpt}
                          </Card.Text>
                          <div className="mt-auto blog-meta">
                            <small className="text-muted">
                              <i className="fas fa-calendar-alt me-1"></i> {post.date} • 
                              <i className="fas fa-clock ms-1 me-1"></i> {post.readTime}
                            </small>
                          </div>
                          <div className="mt-2">
                            <Link to={`/blog/${post.id}`} className="btn btn-outline-primary btn-sm mt-2">
                              Read More
                            </Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Tab>
            
            <Tab eventKey="surgery" title="Surgery">
              <div className='container-fluid'>
                <Row>
                  {filteredPosts.surgery.map((post) => (
                    <Col md={6} lg={4} xl={3} key={`sur-${post.id}`} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <Card.Img variant="top" src={post.image} alt={post.title} />
                        <Card.Body className="d-flex flex-column">
                          <div className="category-tag mb-2">
                            {post.category}
                          </div>
                          <Card.Title className="mb-2">
                            <Link to={`/blog/${post.id}`} className="blog-link">
                              {post.title}
                            </Link>
                          </Card.Title>
                          <Card.Text className="flex-grow-1 text-muted">
                            {post.excerpt}
                          </Card.Text>
                          <div className="mt-auto blog-meta">
                            <small className="text-muted">
                              <i className="fas fa-calendar-alt me-1"></i> {post.date} • 
                              <i className="fas fa-clock ms-1 me-1"></i> {post.readTime}
                            </small>
                          </div>
                          <div className="mt-2">
                            <Link to={`/blog/${post.id}`} className="btn btn-outline-primary btn-sm mt-2">
                              Read More
                            </Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Tab>
            
            <Tab eventKey="laparoscopic" title="Laparoscopic">
              <div className='container-fluid'>
                <Row>
                  {filteredPosts.laparoscopic.map((post) => (
                    <Col md={6} lg={4} xl={3} key={`lap-${post.id}`} className="mb-4">
                      <Card className="h-100 shadow-sm">
                        <Card.Img variant="top" src={post.image} alt={post.title} />
                        <Card.Body className="d-flex flex-column">
                          <div className="category-tag mb-2">
                            {post.category}
                          </div>
                          <Card.Title className="mb-2">
                            <Link to={`/blog/${post.id}`} className="blog-link">
                              {post.title}
                            </Link>
                          </Card.Title>
                          <Card.Text className="flex-grow-1 text-muted">
                            {post.excerpt}
                          </Card.Text>
                          <div className="mt-auto blog-meta">
                            <small className="text-muted">
                              <i className="fas fa-calendar-alt me-1"></i> {post.date} • 
                              <i className="fas fa-clock ms-1 me-1"></i> {post.readTime}
                            </small>
                          </div>
                          <div className="mt-2">
                            <Link to={`/blog/${post.id}`} className="btn btn-outline-primary btn-sm mt-2">
                              Read More
                            </Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Tab>
          </Tabs>
        </div>

        <div className='bookappointment my-4'>
          <div className="row">
            <div className="col-md-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15219.318009617673!2d78.396404!3d17.5156505!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91530ac9ecf7%3A0x1946e7ee6bcc884d!2sDr.%20Padmanabha%20Varma's%20Hormone%20Clinic%20-%20Diabetes%20%2CThyroid%20%26%20Endocrine%20Super%20Speciality%20Centre!5e0!3m2!1sen!2sin!4v1691808841355!5m2!1sen!2sin"
                width="100%" 
                height="450" 
                style={{ border: "0" }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="col-md-4">
              <div className='formSubmit'>
                <p>We Are Ready To Help You With A Smile!</p>
                <h4 className='font-weight-bold'>
                  <i className="fa fa-phone"></i> Call Us: <span className='colorora'>+91 81002 77610</span>
                </h4>

                <form>
                  <input type="text" placeholder="Fullname*" className='form-control mb-3' />

                  <input type="text" placeholder="Mobile*" className='form-control mb-3' />

                  <input type="text" placeholder="Email*" className='form-control mb-3' />

                  <select className='form-control mb-3'>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Thyroid">Thyroid</option>
                    <option value="Adrenal">Adrenal</option>
                    <option value="Pituitary">Pituitary</option>
                    <option value="Gonaos">Gonaos</option>
                    <option value="VitaminD & Calcium">VitaminD & Calcium</option>
                    <option value="Growth">Growth</option>
                    <option value="Obesity">Obesity</option>
                  </select>
                  <div className='my-3'>
                    <textarea placeholder='Please tell us your concern in detail' className='form-control my-3'>
                    </textarea>
                  </div>
                </form>

                <div className='my-3'>
                  <a href="#" className='bookapp my-4 w-100'>Book Appointment</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Blogs