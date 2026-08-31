import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;
  
  // Validate URL parameter
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  // Security: Only allow images from trusted domains
  const customBackend = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
  const allowedDomains = [
    customBackend,
    'https://admin.a1laparoscopyhospital.com',
    'https://a1laparoscopyhospital.com',
    'http://localhost:8000',
    'http://127.0.0.1:8000'
  ].filter(Boolean);
  
  const isAllowed = allowedDomains.some(domain => url.startsWith(domain));
  
  if (!isAllowed) {
    return res.status(403).json({ error: 'Domain not allowed' });
  }
  
  try {
    // Fetch the image from external source
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'A1 Hospital Website Bot'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    // Get image buffer
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Set appropriate headers
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Length', buffer.length);
    
    // Send image data
    res.send(buffer);
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}
