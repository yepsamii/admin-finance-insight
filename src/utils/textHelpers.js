/**
 * Text manipulation utilities
 */

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: "...")
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150, suffix = "...") => {
  if (!text || text.length <= maxLength) return text || "";
  return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Generate URL-friendly slug from text
 * @param {string} text - Text to slugify
 * @returns {string} Slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Capitalize first letter of string
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Convert string to title case
 * @param {string} text - Text to convert
 * @returns {string} Title cased text
 */
export const toTitleCase = (text) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};
