/**
 * Utility functions index file
 * Export all utility functions from a single location
 */

// Date utilities
export * from './dateUtils';

/**
 * Format amount as Pakistani Rupees (PKR)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₨0';
  }
  
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Resolve category ID to category name
 * @param {string} categoryId - The category ID to resolve
 * @param {Array} categories - Array of category objects with id and name properties
 * @returns {string} Category name or the original ID if not found
 */
export const resolveCategoryName = (categoryId, categories = []) => {
  if (!categoryId || !Array.isArray(categories)) {
    return categoryId || 'Other';
  }
  
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
};

// You can add more utility exports here as needed
// export * from './stringUtils';
// export * from './numberUtils';
// export * from './validationUtils';
