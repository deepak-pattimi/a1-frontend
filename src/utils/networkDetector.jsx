/**
 * Network connectivity detector for mobile devices
 * Helps detect and handle network issues gracefully
 */

export const isOnline = () => {
  return navigator.onLine;
};

export const setupNetworkListener = (onOnline, onOffline) => {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    if (onOnline) onOnline();
  });

  window.addEventListener('offline', () => {
    if (onOffline) onOffline();
  });

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * Check if device is on a mobile network (slow connection)
 */
export const isMobileNetwork = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return false;
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (!connection) {
    return false;
  }

  // Check effective type (4g, 3g, 2g, slow-2g)
  const effectiveType = connection.effectiveType;
  if (effectiveType && (effectiveType === '2g' || effectiveType === 'slow-2g')) {
    return true;
  }

  // Check if connection type indicates mobile
  const type = connection.type;
  if (type && (type === 'cellular' || type === '2g' || type === '3g')) {
    return true;
  }

  return false;
};

/**
 * Get network information
 */
export const getNetworkInfo = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return {
      online: navigator.onLine || true,
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0,
      saveData: false
    };
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  return {
    online: navigator.onLine,
    effectiveType: connection.effectiveType || 'unknown',
    downlink: connection.downlink || 0,
    rtt: connection.rtt || 0,
    saveData: connection.saveData || false
  };
};


