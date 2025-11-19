import { Link } from "react-router-dom";
import { formatDate } from "../utils/dateFormatter";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import PostPageSidebar from "./PostPageSidebar";
import { useQuery } from "@tanstack/react-query";
import { postsApi } from "../services/blogApi";

const PostDetail = ({ post }) => {
  const [imageError, setImageError] = useState(false);
  const [editorError, setEditorError] = useState(false);
  const [postNotFoundShown, setPostNotFoundShown] = useState(false);

  // Initialize BlockNote editor in read-only mode
  // This MUST be called unconditionally (hooks rule)
  const editor = useCreateBlockNote({ editable: false });

  // Extract tag IDs from post
  const tagIds = post?.post_tags?.map((pt) => pt.tags?.id).filter(Boolean) || [];

  // Fetch related posts based on category and tags
  const { data: relatedPosts, isLoading: relatedPostsLoading } = useQuery({
    queryKey: ["relatedPosts", post?.id, post?.category_id, tagIds],
    queryFn: () =>
      postsApi.getRelatedPosts(post.id, post.category_id, tagIds, 3),
    enabled: !!post?.id,
  });

  // Show post not found toast only once
  useEffect(() => {
    if (!post && !postNotFoundShown) {
      toast.error("Post not found. It may have been removed or doesn't exist.");
      setPostNotFoundShown(true);
    }
  }, [post, postNotFoundShown]);

  // Load content into editor with error handling
  useEffect(() => {
    if (!editor || !post || !post.content) return;

    try {
      // Check if content is empty or invalid
      if (post.content.trim() === "") {
        toast.error("Post content is empty");
        return;
      }

      const blocks = JSON.parse(post.content);

      // Validate parsed blocks
      if (!Array.isArray(blocks)) {
        throw new Error("Invalid content format: expected array of blocks");
      }

      editor.replaceBlocks(editor.document, blocks);
    } catch (error) {
      console.error("Error parsing content:", error);
      toast.error("Failed to load post content. Some formatting may be lost.");

      // Fallback: try to display as plain text
      try {
        editor.replaceBlocks(editor.document, [
          {
            type: "paragraph",
            content: post.content,
          },
        ]);
      } catch (fallbackError) {
        console.error("Fallback content display failed:", fallbackError);
        toast.error("Unable to display post content");
        setEditorError(true);
      }
    }
  }, [post, editor]);

  // Validate critical post data
  useEffect(() => {
    if (post) {
      if (!post.title || post.title.trim() === "") {
        toast.error("Post is missing a title");
      }
      if (!post.content) {
        toast.error("Post content is unavailable");
      }
    }
  }, [post]);

  // Handle image loading error
  const handleImageError = (e) => {
    console.error("Image failed to load:", post?.header_image_url);
    setImageError(true);
    toast.error("Failed to load post header image");
    e.target.style.display = "none";
  };

  // Safe tag mapping with error handling
  const getTags = () => {
    try {
      if (!post?.post_tags || !Array.isArray(post.post_tags)) {
        return null;
      }

      const tags = post.post_tags
        .map((tag) => {
          if (!tag?.tags?.name) {
            console.warn("Invalid tag structure:", tag);
            return null;
          }
          return tag.tags.name;
        })
        .filter(Boolean);

      return tags.length > 0 ? tags.join(", ") : null;
    } catch (error) {
      console.error("Error processing tags:", error);
      toast.error("Failed to load post tags");
      return null;
    }
  };

  // Safe date formatting with error handling
  const formatDateSafe = (date) => {
    try {
      if (!date) {
        throw new Error("Date is null or undefined");
      }
      return formatDate(date);
    } catch (error) {
      console.error("Error formatting date:", date, error);
      toast.error("Error displaying date information");
      return "Date unavailable";
    }
  };

  // Post not found UI (early return after all hooks)
  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-blue-100 rounded flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Left */}
          <PostPageSidebar post={post} />

          {/* Main Content */}
          <article className="w-full order-1 lg:order-2 bg-white rounded-lg border border-gray-200 p-8">
            {/* Header Image */}
            {post.header_image_url && !imageError && (
              <figure className="w-full relative aspect-video mb-8 rounded overflow-hidden bg-gray-100">
                <img
                  src={post.header_image_url}
                  alt={post.title || "Post header image"}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                />
              </figure>
            )}

            {/* Category & Meta Bar */}
            <div className="mb-4">
              {post.categories?.name && (
                <span className="inline-block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {post.categories.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title || "Untitled Post"}
            </h1>

            {/* Subtitle/Description */}
            {post.description && (
              <p className="text-lg text-gray-600 italic mb-6">
                Stay Ahead of New Regulations
              </p>
            )}

            {/* Tags Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
              {getTags() && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{getTags()}</span>
                </div>
              )}

              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {formatDateSafe(post.published_at || post.created_at)}
                </span>
              </div>

              <div className="flex items-center">
                <span>
                  Updated on{" "}
                  {formatDateSafe(post.updated_at || post.created_at)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="blog-content prose prose-lg mb-12 max-w-[798px] font">
              {editorError ? (
                <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-red-800 font-semibold mb-2">
                    Content Display Error
                  </h3>
                  <p className="text-red-600 text-sm">
                    Unable to display the post content. Please try refreshing
                    the page.
                  </p>
                </div>
              ) : editor ? (
                <BlockNoteView
                  editor={editor}
                  theme="light"
                  editable={false}
                />
              ) : (
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-600 text-sm">Loading content...</p>
                </div>
              )}
            </div>

            {/* Share This Article */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Share This Article
              </h3>
              <div className="flex items-center space-x-3">
                <button className="p-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button className="p-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button className="p-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Related Posts */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Related Posts
              </h3>
              {relatedPostsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : relatedPosts && relatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/post/${relatedPost.slug}`}
                      className="group"
                    >
                      <div className="aspect-video bg-gray-200 rounded mb-3 overflow-hidden">
                        {relatedPost.header_image_url ? (
                          <img
                            src={relatedPost.header_image_url}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200"></div>
                        )}
                      </div>
                      {relatedPost.categories?.name && (
                        <span className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                          {relatedPost.categories.name}
                        </span>
                      )}
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(
                          relatedPost.published_at || relatedPost.created_at
                        )}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No related posts found
                </p>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
