import React from 'react';

export default function Image({ src, alt = '', priority, fill, layout, objectFit, objectPosition, quality, unoptimized, placeholder, blurDataURL, loader, onLoadingComplete, style, loading, ...props }) {
  return <img {...props} src={typeof src === 'object' ? src.src : src} alt={alt}
    loading={priority ? 'eager' : loading || 'lazy'} fetchPriority={priority ? 'high' : undefined}
    decoding="async" onLoad={onLoadingComplete}
    style={{ ...((fill || layout === 'fill') ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : {}), objectFit, objectPosition, ...style }} />;
}
