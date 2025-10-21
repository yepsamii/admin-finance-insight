import { Link } from "react-router-dom";
import { formatDate } from "../utils/dateFormatter";
import { truncateText } from "../utils/textHelpers";

const PostCard = ({ post, showActions = false, onEdit, onDelete }) => {
  return (
    <article className="group bg-white rounded overflow-hidden transition-all duration-300 border border-gray-200 hover:border-gray-300">
      {/* Header Image */}
      <Link
        to={`/post/${post.slug}`}
        className="block relative overflow-hidden aspect-video bg-gradient-to-br from-gray-100 to-gray-200"
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
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1.5 bg-white text-blue-700 text-xs font-semibold rounded border border-blue-200">
              <svg
                className="w-3 h-3 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              {post.categories.name}
            </span>
          </div>
        )}

        {/* Draft Badge */}
        {!post.published && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded border border-yellow-200">
              <svg
                className="w-3 h-3 mr-1.5"
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

      <div className="p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          <Link
            to={`/post/${post.slug}`}
            className="hover:text-blue-600 transition-colors duration-200"
          >
            {post.title}
          </Link>
        </h2>

        {/* Description */}
        {post.description && (
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {truncateText(post.description)}
          </p>
        )}

        {/* Tags */}
        {post.post_tags && post.post_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.post_tags.slice(0, 3).map((postTag) => (
              <span
                key={postTag.tags.id}
                className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-gray-200"
              >
                <svg
                  className="w-3 h-3 mr-1 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {postTag.tags.name}
              </span>
            ))}
            {post.post_tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-100">
                +{post.post_tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer - Meta & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">
              {formatDate(post.published_at || post.created_at)}
            </span>
          </div>

          {showActions ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(post);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                title="Edit post"
              >
                <svg
                  className="w-5 h-5"
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
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                title="Delete post"
              >
                <svg
                  className="w-5 h-5"
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
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:translate-x-1 transition-transform duration-200"
            >
              Read more
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
