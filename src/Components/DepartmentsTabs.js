"use client";
import React, { useState } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';

export default function DepartmentsTabs({ departments, getImageUrl }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = departments[activeIndex];

  return (
    <div className="row g-4 align-items-start">
      {/* Sidebar */}
      <div className="col-lg-4">
        <div className="dept-tabs-sidebar">
          {departments.map((dept, index) => (
            <button
              key={dept.id}
              className={`dept-tab-btn ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-selected={index === activeIndex}
            >
              <div className="dept-tab-icon">
                {dept.image ? (
                  <Image src={getImageUrl(dept.image)} alt={dept.title || ''} width={40} height={40} />
                ) : (
                  <i className="fas fa-stethoscope" style={{ color: index === activeIndex ? 'white' : '#2c4964' }} />
                )}
              </div>
              <div className="dept-tab-label">
                <h5>{dept.title}</h5>
                {dept.short_description && (
                  <p>{dept.short_description}</p>
                )}
              </div>
              <span className="dept-tab-arrow">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Panel */}
      <div className="col-lg-8">
        {active && (
          <div className="dept-content-panel" key={active.id}>
            {/* Image */}
            {active.image ? (
              <Image
                src={getImageUrl(active.image)}
                alt={active.title || 'Department'}
                className="dept-panel-image"
                width={800}
                height={400}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            ) : (
              <div className="dept-panel-image-placeholder">
                <i className="fas fa-hospital" />
              </div>
            )}

            {/* Body */}
            <div className="dept-panel-body">
              <span className="dept-panel-tag">Department</span>
              <h3>{active.title}</h3>
              {active.short_description && (
                <p>{active.short_description}</p>
              )}
              {active.content && (
                <div style={{ color: '#5a6a7a', fontSize: '0.93rem', lineHeight: '1.7', marginBottom: '20px' }}>
                  {parse(active.content)}
                </div>
              )}
              <a href="/Contact/" className="dept-learn-more">
                Book Consultation
                <i className="fas fa-arrow-right" style={{ fontSize: '12px' }} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
