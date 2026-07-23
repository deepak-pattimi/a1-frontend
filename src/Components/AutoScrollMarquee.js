import React, { useRef, useState, useEffect } from 'react';

const AutoScrollMarquee = ({ children, speed = 1.5 }) => {
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef(null);

  // Auto-scrolling logic
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let scrollPos = el.scrollLeft;

    const scroll = () => {
      if (!isDown && !isHovered) {
        scrollPos += speed;
        // Loop back when we reach half the width (since we duplicated items)
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      } else {
        // If user is dragging or hovering, keep track of their scroll position
        // so when they release, auto-scroll continues from where they left off
        scrollPos = el.scrollLeft;
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDown, isHovered, speed]);

  // Dragging logic for mouse
  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    
    let newScrollPos = scrollLeft - walk;
    
    // Handle infinite loop for manual dragging
    if (newScrollPos >= scrollRef.current.scrollWidth / 2) {
        newScrollPos = 0;
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(0);
    } else if (newScrollPos <= 0) {
        newScrollPos = scrollRef.current.scrollWidth / 2;
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(newScrollPos);
    }
    
    scrollRef.current.scrollLeft = newScrollPos;
  };

  return (
    <div
      className="reviews-marquee-wrapper-js"
      ref={scrollRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      // Touch events for mobile swiping support (optional, as overflow-x can handle it, 
      // but this keeps it consistent and stops auto-scroll while touching)
      onTouchStart={() => setIsDown(true)}
      onTouchEnd={() => setIsDown(false)}
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        cursor: isDown ? 'grabbing' : 'grab',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
        width: '100%',
        paddingBottom: '2rem'
      }}
    >
      {/* Hide scrollbar for webkit */}
      <style jsx>{`
        .reviews-marquee-wrapper-js::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div 
        className="reviews-marquee-track-js" 
        style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          width: 'max-content',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AutoScrollMarquee;
