import { ASSETS_URL } from '@/Components/constants';

/**
 * Safely converts an API image path to a valid, encoded URL.
 * Handles:
 *  - Relative paths → prepends ASSETS_URL
 *  - Spaces in filenames → %20 encoded
 *  - Double slashes (e.g. domain//storage) → normalized
 */
export const getImageUrl = (url) => {
  if (!url) return '';

  // Build full URL if relative
  let fullUrl = url.startsWith('http') ? url : `${ASSETS_URL}/${url}`;

  // Fix double slashes after the protocol (e.g. https://domain//path → https://domain/path)
  fullUrl = fullUrl.replace(/([^:])\/\/+/g, '$1/');

  // Encode the URL properly — split protocol+host from path to avoid encoding slashes
  try {
    const urlObj = new URL(fullUrl);
    // Re-encode the pathname (handles spaces, special chars)
    urlObj.pathname = urlObj.pathname
      .split('/')
      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
      .join('/');
    return urlObj.toString();
  } catch {
    // Fallback: simple space encoding
    return fullUrl.replace(/ /g, '%20');
  }
};
