import React, { useRef, useState, useEffect } from 'react';

const AutoScrollMarquee = ({ children, speed = 1.2 }) => {
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isDownRef = useRef(false);
  const isHoveredRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const animationRef = useRef(null);
  const hasDraggedRef = useRef(false);

  // Keep refs in sync
  useEffect(() => {
    isDownRef.current = isDown;
  }, [isDown]);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Window-level safety listeners: ensure drag/hover states ALWAYS release
  useEffect(() => {
    const handleGlobalUp = () => {
      if (isDownRef.current) {
        isDownRef.current = false;
        setIsDown(false);
        hasDraggedRef.current = false;
      }
    };

    // If window blurs or page scrolls, release hover/drag to prevent stuck states
    const handleWindowBlur = () => {
      isDownRef.current = false;
      isHoveredRef.current = false;
      setIsDown(false);
      setIsHovered(false);
    };

    const handlePageScroll = () => {
      // When page scrolls vertically, unstick any frozen hover
      if (isHoveredRef.current && !isDownRef.current) {
        setIsHovered(false);
        isHoveredRef.current = false;
      }
    };

    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    window.addEventListener('touchcancel', handleGlobalUp);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('scroll', handlePageScroll, { passive: true });

    return () => {
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
      window.removeEventListener('touchcancel', handleGlobalUp);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, []);

  // Frame-rate independent smooth scrolling loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || speed <= 0) return;

    let lastTime = performance.now();

    const scroll = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (!isDownRef.current && !isHoveredRef.current) {
        const step = speed * 60 * dt;
        const halfWidth = el.scrollWidth / 2;

        if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        } else {
          el.scrollLeft += step;
        }
      }

      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  // Dragging handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    const el = scrollRef.current;
    if (!el) return;

    isDownRef.current = true;
    setIsDown(true);
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDownRef.current) return;
    const el = scrollRef.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;

    // Only consider it a drag if moved more than 5px (prevents breaking click events)
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }

    let newScrollPos = scrollLeftRef.current - walk;
    const halfWidth = el.scrollWidth / 2;

    if (halfWidth > 0) {
      if (newScrollPos >= halfWidth) {
        newScrollPos -= halfWidth;
        startXRef.current = x;
        scrollLeftRef.current = newScrollPos;
      } else if (newScrollPos < 0) {
        newScrollPos += halfWidth;
        startXRef.current = x;
        scrollLeftRef.current = newScrollPos;
      }
    }

    el.scrollLeft = newScrollPos;
  };

  const handleTouchStart = (e) => {
    const el = scrollRef.current;
    if (!el || !e.touches || e.touches.length === 0) return;

    isDownRef.current = true;
    setIsDown(true);
    hasDraggedRef.current = false;
    startXRef.current = e.touches[0].pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDownRef.current) return;
    const el = scrollRef.current;
    if (!el || !e.touches || e.touches.length === 0) return;

    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;

    let newScrollPos = scrollLeftRef.current - walk;
    const halfWidth = el.scrollWidth / 2;

    if (halfWidth > 0) {
      if (newScrollPos >= halfWidth) {
        newScrollPos -= halfWidth;
        startXRef.current = x;
        scrollLeftRef.current = newScrollPos;
      } else if (newScrollPos < 0) {
        newScrollPos += halfWidth;
        startXRef.current = x;
        scrollLeftRef.current = newScrollPos;
      }
    }

    el.scrollLeft = newScrollPos;
  };

  return (
    <div
      className="reviews-marquee-wrapper-js"
      ref={scrollRef}
      onMouseEnter={() => {
        setIsHovered(true);
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        isHoveredRef.current = false;
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => {
        isDownRef.current = false;
        setIsDown(false);
      }}
      style={{
        overflowX: 'auto',
        overflowY: 'visible',
        touchAction: 'pan-y', // CRITICAL: allows vertical page scroll on touch/mobile
        cursor: isDown ? 'grabbing' : 'grab',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        width: '100%',
        paddingBottom: '1.5rem',
        userSelect: isDown ? 'none' : 'auto',
      }}
    >
      <style>{`
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
