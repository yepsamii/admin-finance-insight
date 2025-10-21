import { Link } from "react-router-dom";
import { formatDate, calculateReadingTime } from "../utils/dateFormatter";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useEffect } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const PostDetail = ({ post }) => {
  // Initialize BlockNote editor in read-only mode
  const editor = useCreateBlockNote({ editable: false });

  useEffect(() => {
    if (post && post.content) {
      try {
        const blocks = JSON.parse(post.content);
        editor.replaceBlocks(editor.document, blocks);
      } catch (error) {
        // If content is not valid JSON, treat it as plain text
        console.error("Error parsing content:", error);
        editor.replaceBlocks(editor.document, [
          {
            type: "paragraph",
            content: post.content,
          },
        ]);
      }
    }
  }, [post, editor]);

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
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Image */}
        {post.header_image_url && (
          <div className="relative aspect-video w-full mb-10 overflow-hidden rounded border border-gray-200">
            <img
              src={post.header_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        )}

        {/* Category & Meta Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {post.categories && (
            <Link
              to={`/category/${post.categories.slug}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-1.5"
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
            </Link>
          )}

          {!post.published && (
            <span className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded border border-yellow-200">
              <svg
                className="w-4 h-4 mr-1.5"
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
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-blue-600"
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

          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">
              {calculateReadingTime(post.content)} min read
            </span>
          </div>

          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span>Share</span>
          </button>
        </div>

        {/* Description */}
        {post.description && (
          <div className="mb-10 p-6 bg-blue-50 rounded border-l-4 border-blue-600">
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              {post.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {post.post_tags && post.post_tags.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Topics Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.post_tags.map((postTag) => (
                <span
                  key={postTag.tags.id}
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-200 hover:border-blue-300 transition-all duration-200"
                >
                  <svg
                    className="w-3.5 h-3.5 mr-2 text-blue-500"
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
            </div>
          </div>
        )}

        {/* Content */}
        <div className="blog-content prose prose-lg max-w-none mb-12">
          <BlockNoteView
            editor={editor}
            theme="light"
            editable={false}
          />
        </div>

        {/* Bottom Navigation & CTA */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 rounded transition-all duration-200"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to all articles
            </Link>

            <div className="flex items-center space-x-4">
              <button
                className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                title="Like"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <button
                className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                title="Bookmark"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
