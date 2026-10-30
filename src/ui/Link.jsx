import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Link({ href, prefetch, legacyBehavior, passHref, children, ...props }) {
  if (/^(https?:|mailto:|tel:|#)/.test(href || '')) return <a href={href} {...props}>{children}</a>;
  return <RouterLink to={href || '/'} {...props}>{children}</RouterLink>;
}
