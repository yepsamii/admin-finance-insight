import { Link } from "react-router-dom";

const PostCard = ({ post, showActions = false, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header Image */}
      {post.header_image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={post.header_image_url}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category */}
        {post.categories && (
          <div className="mb-3">
            <Link
              to={`/category/${post.categories.slug}`}
              className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
            >
              {post.categories.name}
            </Link>
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link
            to={`/post/${post.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Description */}
        {post.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {truncateText(post.description)}
          </p>
        )}

        {/* Tags */}
        {post.post_tags && post.post_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.post_tags.map((postTag) => (
              <span
                key={postTag.tags.id}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                #{postTag.tags.name}
              </span>
            ))}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{formatDate(post.published_at || post.created_at)}</span>
            {!post.published && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Draft
              </span>
            )}
          </div>

          {showActions && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(post)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
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
                onClick={() => onDelete(post)}
                className="text-red-600 hover:text-red-800 transition-colors"
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
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
