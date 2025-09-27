import { RATING_THRESHOLDS, RATING_LABELS, COLORS } from './constants';
import dayjs from 'dayjs';

/**
 * Format time duration in seconds to human readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted time string
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Get rating based on score percentage
 * @param {number} score - Achieved score
 * @param {number} maxScore - Maximum possible score
 * @returns {string} - Rating label
 */
export const getRating = (score, maxScore) => {
  if (!maxScore || maxScore === 0) return RATING_LABELS.POOR;
  
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= RATING_THRESHOLDS.EXCELLENT) return RATING_LABELS.EXCELLENT;
  if (percentage >= RATING_THRESHOLDS.GOOD) return RATING_LABELS.GOOD;
  if (percentage >= RATING_THRESHOLDS.AVERAGE) return RATING_LABELS.AVERAGE;
  return RATING_LABELS.POOR;
};

/**
 * Get color based on rating
 * @param {string} rating - Rating label
 * @returns {string} - Color code
 */
export const getRatingColor = (rating) => {
  switch (rating) {
    case RATING_LABELS.EXCELLENT: return COLORS.SUCCESS;
    case RATING_LABELS.GOOD: return COLORS.PRIMARY;
    case RATING_LABELS.AVERAGE: return COLORS.WARNING;
    case RATING_LABELS.POOR: return COLORS.ERROR;
    default: return COLORS.PRIMARY;
  }
};

/**
 * Get difficulty color
 * @param {string} difficulty - Difficulty level
 * @returns {string} - Color code
 */
export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return COLORS.EASY;
    case 'medium': return COLORS.MEDIUM;
    case 'hard': return COLORS.HARD;
    default: return COLORS.PRIMARY;
  }
};

/**
 * Calculate score percentage
 * @param {number} score - Achieved score
 * @param {number} maxScore - Maximum possible score
 * @returns {number} - Percentage (0-100)
 */
export const calculatePercentage = (score, maxScore) => {
  if (!maxScore || maxScore === 0) return 0;
  return Math.round((score / maxScore) * 100);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Is valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Clean phone number (remove non-digits)
 * @param {string} phone - Phone number to clean
 * @returns {string} - Cleaned phone number
 */
export const cleanPhoneNumber = (phone) => {
  return phone.replace(/\D/g, '');
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} - Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get relative time from now
 * @param {number|Date} date - Date to compare
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (date) => {
  return dayjs(date).fromNow();
};

/**
 * Format date
 * @param {number|Date} date - Date to format
 * @param {string} format - Format string
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = 'MMM DD, YYYY HH:mm') => {
  return dayjs(date).format(format);
};

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 * @param {any} value - Value to check
 * @returns {boolean} - Is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Deep clone object
 * @param {any} obj - Object to clone
 * @returns {any} - Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
};

/**
 * Sort array by property
 * @param {Array} array - Array to sort
 * @param {string} property - Property to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} - Sorted array
 */
export const sortByProperty = (array, property, order = 'asc') => {
  return [...array].sort((a, b) => {
    let valueA = a[property];
    let valueB = b[property];
    
    // Handle null/undefined values
    if (valueA == null) valueA = '';
    if (valueB == null) valueB = '';
    
    // Convert to lowercase for string comparison
    if (typeof valueA === 'string') valueA = valueA.toLowerCase();
    if (typeof valueB === 'string') valueB = valueB.toLowerCase();
    
    if (order === 'desc') {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    } else {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    }
  });
};

/**
 * Filter array by search term
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} - Filtered array
 */
export const filterBySearchTerm = (array, searchTerm, searchFields) => {
  if (!searchTerm || searchTerm.trim().length === 0) return array;
  
  const term = searchTerm.toLowerCase().trim();
  
  return array.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      if (value == null) return false;
      return value.toString().toLowerCase().includes(term);
    });
  });
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Generate random color
 * @param {string} seed - Seed for consistent color generation
 * @returns {string} - Hex color code
 */
export const generateColor = (seed) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', 
    '#722ed1', '#13c2c2', '#eb2f96', '#fa541c'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};