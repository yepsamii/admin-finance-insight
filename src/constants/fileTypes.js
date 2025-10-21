/**
 * File type constants
 */

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/webm",
  "video/ogg",
];

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/markdown",
  "application/zip",
  "application/x-zip-compressed",
];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50MB

export const FILE_UPLOAD_ERRORS = {
  INVALID_TYPE: "Invalid file type. Please select a supported file format.",
  SIZE_EXCEEDED: "File size exceeds the maximum allowed size.",
  UPLOAD_FAILED: "Failed to upload file. Please try again.",
};
