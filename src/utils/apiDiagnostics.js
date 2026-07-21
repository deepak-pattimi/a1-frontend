/**
 * API Diagnostics utility for debugging mobile network issues
 */

import axiosInstance from './axiosConfig';
import { API_URL } from '../Components/constants';

/**
 * Test API connectivity
 */
export const testAPIConnectivity = async () => {
  const results = {
    success: false,
    error: null,
    details: {},
    timestamp: new Date().toISOString(),
  };

  try {
    // Test basic connectivity
    const startTime = Date.now();
    const response = await axiosInstance.get('general-settings', {
      timeout: 10000,
    });
    const endTime = Date.now();

    results.success = true;
    results.details = {
      status: response.status,
      responseTime: endTime - startTime,
      dataReceived: !!response.data,
      url: API_URL + 'general-settings',
    };
  } catch (error) {
    results.error = {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
      } : null,
      isNetworkError: error.isNetworkError,
      isCorsError: error.isCorsError,
      isTimeoutError: error.isTimeoutError,
    };
    results.details = {
      url: API_URL + 'general-settings',
      hasResponse: !!error.response,
    };
  }

  return results;
};

/**
 * Log diagnostic information
 */
export const logDiagnostics = () => {
  if (typeof window === 'undefined') return;

  const diagnostics = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    onLine: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
    connection: null,
    location: window.location.href,
    apiUrl: API_URL,
    timestamp: new Date().toISOString(),
  };

  // Get network connection info if available
  if (navigator.connection) {
    diagnostics.connection = {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData,
    };
  }

  return diagnostics;
};

/**
 * Check if API URL is accessible
 */
export const checkAPIURL = async () => {
  try {
    // Try to fetch the API URL directly
    const response = await fetch(API_URL, {
      method: 'OPTIONS', // CORS preflight
      mode: 'cors',
    });
    return {
      accessible: true,
      corsEnabled: response.ok,
    };
  } catch (error) {
    return {
      accessible: false,
      error: error.message,
    };
  }
};

