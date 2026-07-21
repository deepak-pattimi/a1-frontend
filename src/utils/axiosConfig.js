import axios from 'axios';
import { API_URL } from '../Components/constants';
import { toast } from 'react-toastify';

// Detect if running on mobile device
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000, // 20 seconds timeout for mobile networks (increased)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Important for mobile browsers
  withCredentials: false,
  // Allow axios to handle redirects
  maxRedirects: 5,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add mobile-specific headers if needed
    if (isMobile()) {
      // Some mobile browsers need these headers
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    // Mark request start time for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic for mobile networks
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Enhanced error logging for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Axios Error Details:', {
        message: error.message,
        code: error.code,
        response: error.response?.status,
        responseData: error.response?.data,
        config: {
          url: originalRequest?.url,
          method: originalRequest?.method,
          baseURL: originalRequest?.baseURL,
        },
        isMobile: isMobile(),
      });
    }

    // Check if we have a response (server responded)
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      // Handle specific status codes
      if (status === 500) {
        if (typeof window !== 'undefined') {
          toast.error('Server error. Please try again later.');
        }
      } else if (status === 404) {
        // Don't show toast for 404, let components handle it
      } else if (status === 401 || status === 403) {
        if (typeof window !== 'undefined') {
          toast.error('Access denied. Please refresh the page.');
        }
      } else if (status === 0) {
        // Status 0 usually means CORS or network issue
        // Don't show error, let it retry or fail silently
        console.warn('Request failed with status 0 - possible CORS or network issue');
      }

      // Return error with response - let components handle it
      return Promise.reject(error);
    }

    // No response from server - this is a real network issue
    // But we need to be more careful about what we classify as network errors

    // Check for actual network errors (not CORS or SSL issues)
    const isActualNetworkError =
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      (error.message && (
        error.message === 'Network Error' ||
        error.message.includes('ERR_NETWORK') ||
        error.message.includes('Network request failed')
      ));

    // Check for CORS errors (different from network errors)
    const isCorsError =
      error.message && (
        error.message.includes('CORS') ||
        error.message.includes('Cross-Origin') ||
        error.message.includes('Access-Control')
      );

    // Check for SSL/Certificate errors
    const isSSLError =
      error.message && (
        error.message.includes('SSL') ||
        error.message.includes('certificate') ||
        error.message.includes('TLS') ||
        error.code === 'EPROTO'
      );

    // Handle CORS errors specifically
    if (isCorsError) {
      console.error('CORS Error detected - this is a server configuration issue');
      if (typeof window !== 'undefined' && isMobile()) {
        // On mobile, CORS errors are more common - show helpful message
        toast.error('Connection blocked. Please contact support if this persists.');
      }
      return Promise.reject({
        ...error,
        message: 'CORS error - server configuration issue',
        isCorsError: true
      });
    }

    // Handle SSL errors - retry with HTTP in development
    if (isSSLError) {
      console.warn('SSL Error detected - this may be a certificate issue');
      
      // In development, you might want to use HTTP instead
      if (process.env.NODE_ENV === 'development' && originalRequest) {
        const httpUrl = originalRequest.url.replace('https://', 'http://');
        console.log(`Retrying with HTTP: ${httpUrl}`);
        
        // Retry with HTTP (for development only)
        originalRequest.url = httpUrl;
        originalRequest.baseURL = originalRequest.baseURL?.replace('https://', 'http://');
        
        try {
          return await axiosInstance(originalRequest);
        } catch (retryError) {
          console.error('HTTP retry also failed:', retryError);
        }
      }
      
      if (typeof window !== 'undefined') {
        toast.error('Security connection error. Please check your network.');
      }
      return Promise.reject({
        ...error,
        message: 'SSL/Certificate error - please check backend SSL configuration',
        isSSLError: true
      });
    }

    // Handle actual network errors with retry logic
    if (isActualNetworkError) {
      // Check if we can retry (only if we have a config)
      if (originalRequest && !originalRequest._retry && (originalRequest._retryCount || 0) < 3) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

        // Wait before retrying (exponential backoff)
        const delay = 1000 * originalRequest._retryCount;
        if (process.env.NODE_ENV === 'development') {
          console.log(`Retrying request (attempt ${originalRequest._retryCount}) after ${delay}ms`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));

        return axiosInstance(originalRequest);
      }

      // Only show network error if we've exhausted retries AND it's a critical request
      // For non-critical requests, fail silently to avoid false positives
      const isCriticalRequest = originalRequest?.url?.includes('general-settings') ||
        originalRequest?.url?.includes('get-banners-list');

      if (typeof window !== 'undefined' && isCriticalRequest) {
        // On mobile, be more specific about the error
        if (isMobile()) {
          toast.error('Unable to connect. Please check your internet and try again.');
        } else {
          toast.error('Network error. Please check your internet connection and try again.');
        }
      }
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true
      });
    }

    // Handle other errors that might be network-related but not clearly identified
    // On mobile, these could be CORS, SSL, or other issues that appear as network errors
    if (!error.response && !isActualNetworkError && !isCorsError && !isSSLError) {
      // This might be a network error, but we're not sure
      // Retry once, but don't show error message unless it's critical
      if (originalRequest && !originalRequest._retry && (originalRequest._retryCount || 0) < 2) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
        await new Promise(resolve => setTimeout(resolve, 2000));
        return axiosInstance(originalRequest);
      }

      // Don't show error for non-critical requests - let components handle it
      // This prevents false "network error" messages on mobile
      return Promise.reject(error);
    }

    // Handle timeout errors separately
    if (error.code === 'ECONNABORTED' && error.message && error.message.includes('timeout')) {
      // Retry timeout errors once
      if (originalRequest && !originalRequest._retry && (originalRequest._retryCount || 0) < 1) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
        await new Promise(resolve => setTimeout(resolve, 2000));
        return axiosInstance(originalRequest);
      }

      if (typeof window !== 'undefined') {
        toast.error('Request timed out. Please try again.');
      }
      return Promise.reject({
        ...error,
        message: 'Request timed out. Please try again.',
        isTimeoutError: true
      });
    }

    // For any other errors, don't show toast - let components handle it
    // This prevents false "network error" messages
    return Promise.reject(error);
  }
);

export default axiosInstance;

