/**
 * File handling utilities
 */

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

/**
 * Get file extension from filename
 * @param {string} filename - File name
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return "";
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

/**
 * Get file icon emoji based on file type
 * @param {string} fileType - MIME type
 * @returns {string} Icon emoji
 */
export const getFileIcon = (fileType) => {
  if (!fileType) return "📎";

  const iconMap = {
    pdf: "📄",
    word: "📝",
    doc: "📝",
    excel: "📊",
    spreadsheet: "📊",
    powerpoint: "📽️",
    presentation: "📽️",
    text: "📃",
    markdown: "📃",
    zip: "📦",
    archive: "📦",
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (fileType.includes(key)) {
      return icon;
    }
  }

  return "📎";
};

/**
 * Validate file type
 * @param {File} file - File object
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {boolean} Is valid
 */
export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - File object
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} Is valid
 */
export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};
