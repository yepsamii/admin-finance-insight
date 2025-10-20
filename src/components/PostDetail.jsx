import { Link } from 'react-router-dom';

const PostDetail = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <p className="text-gray-600 mb-4">The post you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Image */}
      {post.header_image_url && (
        <div className="aspect-video w-full mb-8 overflow-hidden rounded-lg">
          <img
            src={post.header_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Category */}
      {post.categories && (
        <div className="mb-4">
          <Link
            to={`/category/${post.categories.slug}`}
            className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
          >
            {post.categories.name}
          </Link>
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {post.title}
      </h1>

      {/* Meta Information */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <span>{formatDate(post.published_at || post.created_at)}</span>
          {!post.published && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {post.description && (
        <div className="mb-8">
          <p className="text-xl text-gray-600 leading-relaxed">
            {post.description}
          </p>
        </div>
      )}

      {/* Tags */}
      {post.post_tags && post.post_tags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {post.post_tags.map((postTag) => (
              <span
                key={postTag.tags.id}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                #{postTag.tags.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Back to Home */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all posts
        </Link>
      </div>
    </article>
  );
};

export default PostDetail;
