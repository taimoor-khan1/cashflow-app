/**
 * Date utility functions for the Cashflow app
 */

/**
 * Format a date string to a readable format
 * @param {string|Date} date - Date string or Date object
 * @param {string} format - Format type: 'short', 'long', 'relative'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'long') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    
    case 'relative':
      return getRelativeTimeString(dateObj);
    
    case 'long':
    default:
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  }
};

/**
 * Format a time string
 * @param {string|Date} date - Date string or Date object
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (date, includeSeconds = false) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: true,
  });
};

/**
 * Get relative time string (e.g., "2 hours ago", "yesterday")
 * @param {Date} date - Date object
 * @returns {string} Relative time string
 */
export const getRelativeTimeString = (date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays === 1) {
    return 'yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return formatDate(date, 'short');
  }
};

/**
 * Check if a date is today
 * @param {string|Date} date - Date string or Date object
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if a date is yesterday
 * @param {string|Date} date - Date string or Date object
 * @returns {boolean} True if date is yesterday
 */
export const isYesterday = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return dateObj.toDateString() === yesterday.toDateString();
};

/**
 * Get the start of a week for a given date
 * @param {string|Date} date - Date string or Date object
 * @returns {Date} Start of week (Sunday)
 */
export const getStartOfWeek = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const startOfWeek = new Date(dateObj);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day;
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

/**
 * Get the end of a week for a given date
 * @param {string|Date} date - Date string or Date object
 * @returns {Date} End of week (Saturday)
 */
export const getEndOfWeek = (date) => {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};

/**
 * Get the start of a month for a given date
 * @param {string|Date} date - Date string or Date object
 * @returns {Date} Start of month
 */
export const getStartOfMonth = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
};

/**
 * Get the end of a month for a given date
 * @param {string|Date} date - Date string or Date object
 * @returns {Date} End of month
 */
export const getEndOfMonth = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0, 23, 59, 59, 999);
};

/**
 * Add days to a date
 * @param {string|Date} date - Date string or Date object
 * @param {number} days - Number of days to add
 * @returns {Date} New date
 */
export const addDays = (date, days) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const newDate = new Date(dateObj);
  newDate.setDate(dateObj.getDate() + days);
  return newDate;
};

/**
 * Subtract days from a date
 * @param {string|Date} date - Date string or Date object
 * @param {number} days - Number of days to subtract
 * @returns {Date} New date
 */
export const subtractDays = (date, days) => {
  return addDays(date, -days);
};

/**
 * Check if a date is between two other dates
 * @param {string|Date} date - Date to check
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {boolean} True if date is between start and end dates
 */
export const isDateBetween = (date, startDate, endDate) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const startObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const endObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  return dateObj >= startObj && dateObj <= endObj;
};

/**
 * Get the number of days between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Number of days between dates
 */
export const getDaysBetween = (startDate, endDate) => {
  const startObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const endObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffTime = Math.abs(endObj - startObj);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format a date for input fields (YYYY-MM-DD)
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Parse a date string in YYYY-MM-DD format
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date|null} Date object or null if invalid
 */
export const parseDateFromInput = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null;
  
  const [year, month, day] = dateString.split('-').map(Number);
  
  if (!year || !month || !day) return null;
  
  const date = new Date(year, month - 1, day);
  
  // Check if the date is valid
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  
  return date;
};
