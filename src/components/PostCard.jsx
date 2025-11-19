import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { formatDate } from "../utils/dateFormatter";
import { truncateText } from "../utils/textHelpers";
import { postsApi } from "../services/blogApi";

const PostCard = ({
  post,
  showActions = false,
  onEdit,
  onDelete,
  onPublishToggle,
}) => {
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);
  const [currentPublishedState, setCurrentPublishedState] = useState(
    post.published
  );

  const handlePublishToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsTogglingPublish(true);
    try {
      await postsApi.updatePost(post.id, {
        ...post,
        published: !currentPublishedState,
      });
      setCurrentPublishedState(!currentPublishedState);
      toast.success(
        !currentPublishedState
          ? "Post published successfully!"
          : "Post unpublished successfully!"
      );
      // Notify parent component if callback provided
      if (onPublishToggle) {
        onPublishToggle(post.id, !currentPublishedState);
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error(error.message || "Failed to update publish status");
    } finally {
      setIsTogglingPublish(false);
    }
  };

  return (
    <article className="group bg-white rounded-lg overflow-hidden transition-shadow duration-200 shadow-sm hover:shadow-md border border-gray-200">
      {/* Header Image */}
      <Link
        to={`/post/${post.slug}`}
        className="block relative overflow-hidden aspect-video bg-gray-100"
      >
        {post.header_image_url ? (
          <>
            <img
              src={post.header_image_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Category Badge - Floating */}
        {post.categories && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2 py-1 bg-gray-900/80 backdrop-blur text-white text-xs font-medium rounded">
              {post.categories.name.toUpperCase()}
            </span>
          </div>
        )}

        {/* Draft Badge */}
        {!currentPublishedState && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded border border-yellow-200">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Draft
            </span>
          </div>
        )}
      </Link>

      <div className="p-5">
        {/* Category Badge - Inside Card */}
        {post.categories && (
          <div className="mb-2">
            <span className="inline-block text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {post.categories.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
          <Link
            to={`/post/${post.slug}`}
            className="hover:text-navy-700 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Description */}
        {post.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {truncateText(post.description, 120)}
          </p>
        )}

        {/* Footer - Meta & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <span>{formatDate(post.published_at || post.created_at)}</span>
          </div>

          {showActions ? (
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePublishToggle}
                disabled={isTogglingPublish}
                className={`p-2 rounded transition-colors ${
                  currentPublishedState
                    ? "text-green-600 hover:bg-green-50"
                    : "text-gray-600 hover:bg-gray-100"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={
                  currentPublishedState
                    ? "Published - Click to unpublish"
                    : "Draft - Click to publish"
                }
              >
                {isTogglingPublish ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                ) : currentPublishedState ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(post);
                }}
                className="p-2 text-navy-600 hover:bg-gray-100 rounded transition-colors"
                title="Edit post"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(post);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete post"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              to={`/post/${post.slug}`}
              className="inline-flex items-center text-xs font-semibold text-gray-900 hover:text-navy-700 transition-colors"
            >
              Read More →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
