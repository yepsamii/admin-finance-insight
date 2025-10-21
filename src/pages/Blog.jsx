import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { postsApi } from "../services/blogApi";
import PostCard from "../components/PostCard";
import FilterSidebar from "../components/FilterSidebar";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["published-posts"],
    queryFn: postsApi.getPublishedPosts,
  });

  // Calculate post counts for categories and tags
  const postCounts = useMemo(() => {
    if (!posts) return { categories: {}, tags: {} };

    const categoryCounts = {};
    const tagCounts = {};

    posts.forEach((post) => {
      // Count categories
      if (post.category_id) {
        categoryCounts[post.category_id] =
          (categoryCounts[post.category_id] || 0) + 1;
      }

      // Count tags
      if (post.post_tags) {
        post.post_tags.forEach((pt) => {
          const tagId = pt.tags.id;
          tagCounts[tagId] = (tagCounts[tagId] || 0) + 1;
        });
      }
    });

    return { categories: categoryCounts, tags: tagCounts };
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    if (!posts) return [];

    let filtered = [...posts];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (post) => post.category_id === selectedCategory
      );
    }

    // Filter by tags (posts must have at least one selected tag)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) => {
        if (!post.post_tags) return false;
        const postTagIds = post.post_tags.map((pt) => pt.tags.id);
        return selectedTags.some((tagId) => postTagIds.includes(tagId));
      });
    }

    // Sort posts
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.published_at || b.created_at) -
          new Date(a.published_at || a.created_at)
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.published_at || a.created_at) -
          new Date(b.published_at || b.created_at)
        );
      }
      return 0;
    });

    return filtered;
  }, [posts, selectedCategory, selectedTags, sortBy]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  return (
    <>
      <Helmet>
        <title>
          Blog - Finance Insights | Expert Financial Analysis & Guidance
        </title>
        <meta
          name="description"
          content="Discover expert financial insights, analysis, and guidance to make informed financial decisions."
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                📝 Financial Insights Blog
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Explore our latest articles on financial planning, investment
                strategies, and market analysis
              </p>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Filter */}
              <aside className="lg:w-80 flex-shrink-0">
                <FilterSidebar
                  selectedCategory={selectedCategory}
                  selectedTags={selectedTags}
                  onCategoryChange={handleCategoryChange}
                  onTagChange={handleTagChange}
                  onResetFilters={handleResetFilters}
                  postCounts={postCounts}
                />
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Controls Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCategory || selectedTags.length > 0
                        ? "Filtered Posts"
                        : "All Posts"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Showing {filteredAndSortedPosts.length} of{" "}
                      {posts?.length || 0}{" "}
                      {posts?.length === 1 ? "post" : "posts"}
                    </p>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <label className="sr-only">Sort by</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-gray-900 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all duration-200"
                    >
                      <option value="newest">Sort by: Newest</option>
                      <option value="oldest">Sort by: Oldest</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
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
                {filteredAndSortedPosts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in-up">
                    {filteredAndSortedPosts.map((post, index) => (
                      <div
                        key={post.id}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results State */}
                {!isLoading &&
                  !error &&
                  posts &&
                  posts.length > 0 &&
                  filteredAndSortedPosts.length === 0 && (
                    <div className="text-center py-20">
                      <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          No posts found
                        </h3>
                        <p className="text-gray-600 text-lg mb-6">
                          Try adjusting your filters to find more content.
                        </p>
                        <button
                          onClick={handleResetFilters}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  )}

                {/* Empty State */}
                {!isLoading && !error && posts && posts.length === 0 && (
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
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;
