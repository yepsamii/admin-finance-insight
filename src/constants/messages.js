/**
 * User-facing messages and text constants
 */

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You must be logged in to perform this action.",
  FORBIDDEN: "You do not have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "An unexpected error occurred. Please try again later.",
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your internet connection.",
};

export const SUCCESS_MESSAGES = {
  POST_CREATED: "Post created successfully!",
  POST_UPDATED: "Post updated successfully!",
  POST_DELETED: "Post deleted successfully!",
  RESOURCE_UPLOADED: "Resource uploaded successfully!",
  RESOURCE_UPDATED: "Resource updated successfully!",
  RESOURCE_DELETED: "Resource deleted successfully!",
  CATEGORY_CREATED: "Category created successfully!",
  CATEGORY_UPDATED: "Category updated successfully!",
  CATEGORY_DELETED: "Category deleted successfully!",
  TAG_CREATED: "Tag created successfully!",
  TAG_UPDATED: "Tag updated successfully!",
  TAG_DELETED: "Tag deleted successfully!",
};

export const CONFIRMATION_MESSAGES = {
  DELETE_POST:
    "Are you sure you want to delete this post? This action cannot be undone.",
  DELETE_RESOURCE:
    "Are you sure you want to delete this resource? This action cannot be undone.",
  DELETE_CATEGORY:
    "Are you sure you want to delete this category? This will affect all posts using this category.",
  DELETE_TAG:
    "Are you sure you want to delete this tag? This will remove the tag from all posts.",
};

export const LOADING_MESSAGES = {
  LOADING_POSTS: "Loading posts...",
  LOADING_RESOURCES: "Loading resources...",
  LOADING_CATEGORIES: "Loading categories...",
  LOADING_TAGS: "Loading tags...",
  SAVING: "Saving...",
  UPLOADING: "Uploading...",
  DELETING: "Deleting...",
};
