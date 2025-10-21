/**
 * Date formatting utilities
 */

/**
 * Format date to human-readable string
 * @param {string} dateString - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Date(dateString).toLocaleDateString("en-US", defaultOptions);
};

/**
 * Calculate reading time based on content
 * @param {string} content - Text content or JSON string
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {number} Reading time in minutes
 */
export const calculateReadingTime = (content, wordsPerMinute = 200) => {
  let textContent = content;

  // Try to parse as BlockNote JSON
  try {
    const blocks = JSON.parse(content);
    if (Array.isArray(blocks)) {
      // Extract text from BlockNote blocks
      textContent = blocks
        .map((block) => {
          if (block.content) {
            if (Array.isArray(block.content)) {
              return block.content.map((c) => c.text || "").join("");
            }
            return block.content;
          }
          return "";
        })
        .join(" ");
    }
  } catch {
    // If not JSON, use content as is
    textContent = content;
  }

  const words = textContent
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time
 */
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "week", seconds: 604800 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.name}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};
