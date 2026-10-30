import React, { useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { useLocation, NavLink } from 'react-router-dom';
import { FaBars, FaPhoneAlt, FaArrowRight, FaPlus } from 'react-icons/fa';

export default function MobileHeader({ categories = [], generalSettings }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 992px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  const close = () => setOpen(false);
  const phone = generalSettings?.header_phone;
  return <>
    <header className="mobile-site-header">
      <NavLink to="/" className="mobile-brand" aria-label="A1 Laparoscopy Hospital home">
        <img
          src="/favicon.png"
          alt="A1 Laparoscopy Hospital"
          className="mobile-brand-logo"
          width="42"
          height="42"
          style={{ width: '42px', height: '42px', objectFit: 'contain', flexShrink: 0 }}
        />
        <span><strong>A1 Laparoscopy</strong><small>HOSPITAL · VISAKHAPATNAM</small></span>
      </NavLink>
      <button className="mobile-menu-toggle" onClick={() => setOpen(true)} aria-label="Open navigation menu" aria-expanded={open} aria-controls="mobile-site-navigation">
        <FaBars aria-hidden="true" />
      </button>
    </header>
    <Offcanvas show={open} onHide={close} placement="end" className="mobile-nav-drawer" id="mobile-site-navigation" aria-labelledby="mobile-menu-title">
      <Offcanvas.Header closeButton><Offcanvas.Title id="mobile-menu-title">Explore A1</Offcanvas.Title></Offcanvas.Header>
      <Offcanvas.Body>
        <p className="mobile-menu-eyebrow">CARE, CLOSER TO YOU</p>
        <nav aria-label="Mobile navigation" className="mobile-nav-list">
          <NavLink to="/" end onClick={close}>Home <FaArrowRight aria-hidden="true" /></NavLink>
          {(categories || []).map(category => <details key={category.id} className="mobile-nav-group">
            <summary>{category.name}<FaPlus aria-hidden="true" /></summary>
            <div>{(category.pages || []).map(page => <NavLink key={page.id} to={`/page/${page.slug}`} onClick={close}>{page.page_name}</NavLink>)}</div>
          </details>)}
          <NavLink to="/about-doctor" onClick={close}>Our doctor <FaArrowRight aria-hidden="true" /></NavLink>
          <NavLink to="/about-clinic" onClick={close}>Our hospital <FaArrowRight aria-hidden="true" /></NavLink>
          <NavLink to="/blogs" onClick={close}>Health articles <FaArrowRight aria-hidden="true" /></NavLink>
          <NavLink to="/image-gallery" onClick={close}>Gallery <FaArrowRight aria-hidden="true" /></NavLink>
          <NavLink to="/Contact" onClick={close}>Contact us <FaArrowRight aria-hidden="true" /></NavLink>
        </nav>
        <NavLink to="/book-appointment" onClick={close} className="mobile-menu-book">Book an appointment <FaArrowRight aria-hidden="true" /></NavLink>
        {phone && <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="mobile-menu-phone"><FaPhoneAlt aria-hidden="true" /><span><small>Call our care team</small>{phone}</span></a>}
      </Offcanvas.Body>
    </Offcanvas>
  </>;
}
