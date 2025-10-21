import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { postsApi } from "../services/blogApi";
import PostCard from "../components/PostCard";

const Home = () => {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["published-posts"],
    queryFn: postsApi.getPublishedPosts,
  });

  return (
    <>
      <Helmet>
        <title>Finance Insights - Expert Financial Analysis & Guidance</title>
        <meta
          name="description"
          content="Discover expert financial insights, analysis, and guidance to make informed financial decisions."
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Posts Section */}
        <section
          id="posts"
          className="py-16 md:py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest Insights
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our latest articles on financial planning, investment
                strategies, and market analysis
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse"
                  >
                    <div className="bg-gray-200 rounded-2xl h-48 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-red-50 border-2 border-red-200 p-8 rounded-2xl text-center">
                  <svg
                    className="w-12 h-12 text-red-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-red-800 mb-2">
                    Error Loading Posts
                  </h3>
                  <p className="text-red-600">{error.message}</p>
                </div>
              </div>
            )}

            {/* Posts Grid */}
            {posts && posts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-in-up">
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {posts && posts.length === 0 && (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    We're working on some amazing content. Check back soon!
                  </p>
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl font-medium">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                    </svg>
                    Coming Soon
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
