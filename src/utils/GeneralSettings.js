// Note: This file uses fetch instead of axios for general settings
// The API_URL constant is not used in this file

// Default settings in case API fails
const defaultSettings = {
  logo: '/images/logo.png',
  favicon: '/favicon.ico',
  phone: '+1 234 567 8900',
  email: 'info@example.com',
  address: '123 Main St, City, Country',
  facebook: 'https://facebook.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
  copyright: '© 2023 All Rights Reserved',
  title: 'Website Title'
};

/**
 * Fetch general settings from the API
 * @returns {Promise<Object>} General settings object
 */
export const fetchGeneralSettings = async () => {
  try {
    const response = await fetch('/api/general-settings');
    if (!response.ok) {
      throw new Error('Failed to fetch general settings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching general settings:', error);
    // Return default settings if API call fails
    return getSetting();
  }
};

/**
 * Update favicon dynamically
 * @param {string} faviconUrl - The URL of the new favicon
 */
export const updateFavicon = (faviconUrl) => {
  if (!faviconUrl) return;

  const favicon = document.getElementById('favicon');
  if (favicon) {
    favicon.href = faviconUrl;
  } else {
    const link = document.createElement('link');
    link.id = 'favicon';
    link.rel = 'icon';
    link.href = faviconUrl;
    document.head.appendChild(link);
  }

  // Also update apple touch icon
  const appleTouchIcon = document.getElementById('apple-touch-icon');
  if (appleTouchIcon) {
    appleTouchIcon.href = faviconUrl;
  }
};

/**
 * Get a specific setting with fallback to default
 * @param {string} key - The setting key to retrieve
 * @param {string} defaultValue - Default value if setting is not found
 * @returns {string} The setting value or default
 */
export const getSetting = (key, defaultValue = '') => {
  try {
    const cachedSettings = localStorage.getItem('generalSettings');
    if (cachedSettings) {
      const settings = JSON.parse(cachedSettings);
      return settings[key] || defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error);
    return defaultValue;
  }
};

export default defaultSettings;