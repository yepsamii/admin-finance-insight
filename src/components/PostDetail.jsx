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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Left */}
          <aside className="lg:w-80 flex-shrink-0 order-2 lg:order-1">
            <div className="lg:sticky lg:top-20 space-y-6">
              {/* Recent Posts */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {/* Mock recent posts - you'd fetch these from API */}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to="/"
                          className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mb-1"
                        >
                          The Future of Cryptocurrency in Traditional Banking
                        </Link>
                        <p className="text-xs text-gray-500">July 16, 2025</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              {post.categories && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <Link
                      to="/"
                      className="flex items-center text-sm text-gray-700 hover:text-blue-600"
                    >
                      <span className="flex-1">Finance</span>
                      <span className="text-gray-400">8</span>
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center text-sm text-gray-700 hover:text-blue-600"
                    >
                      <span className="flex-1">Tax</span>
                      <span className="text-gray-400">4</span>
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center text-sm text-gray-700 hover:text-blue-600"
                    >
                      <span className="flex-1">Economics</span>
                      <span className="text-gray-400">5</span>
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center text-sm text-gray-700 hover:text-blue-600"
                    >
                      <span className="flex-1">Auditing</span>
                      <span className="text-gray-400">2</span>
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center text-sm text-gray-700 hover:text-blue-600"
                    >
                      <span className="flex-1">Accounting</span>
                      <span className="text-gray-400">4</span>
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center text-sm text-gray-700 hover:text-blue-600"
                    >
                      <span className="flex-1">Industry Analysis</span>
                      <span className="text-gray-400">3</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Popular Tags */}
              {post.post_tags && post.post_tags.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Tax Planning",
                      "Audit",
                      "Compliance",
                      "Money",
                      "Investing",
                      "Stocks",
                      "Market Trends",
                      "Inflation",
                      "Bonds",
                    ].map((tag) => (
                      <Link
                        key={tag}
                        to="/"
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <article className="flex-1 order-1 lg:order-2 bg-white rounded-lg border border-gray-200 p-8">
            {/* Header Image */}
            {post.header_image_url && (
              <div className="relative aspect-video w-full mb-8 overflow-hidden rounded">
                <img
                  src={post.header_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Category & Meta Bar */}
            <div className="mb-4">
              {post.categories && (
                <span className="inline-block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {post.categories.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Subtitle/Description */}
            {post.description && (
              <p className="text-lg text-gray-600 italic mb-6">
                Stay Ahead of New Regulations
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
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
                <span>Tax</span>
              </div>

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
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>

              <div className="flex items-center">
                <span>
                  Updated on {formatDate(post.updated_at || post.created_at)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="blog-content prose prose-lg max-w-none mb-12">
              <BlockNoteView
                editor={editor}
                theme="light"
                editable={false}
              />
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mock related posts */}
                {[1, 2, 3].map((i) => (
                  <Link
                    key={i}
                    to="/"
                    className="group"
                  >
                    <div className="aspect-video bg-gray-200 rounded mb-3 overflow-hidden">
                      <div className="w-full h-full group-hover:scale-110 transition-transform duration-300"></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                      Share Market
                    </span>
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                      Navigating the 2025 Share Market: Top Stocks to Watch
                    </h4>
                    <p className="text-xs text-gray-500 mt-2">July 7, 2025</p>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
