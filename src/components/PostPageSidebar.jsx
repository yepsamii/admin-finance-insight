import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { postsApi } from "../services/blogApi";
import { formatDate } from "../utils/dateFormatter";

const PostPageSidebar = ({ post }) => {
  // Fetch latest 3 posts
  const { data: latestPosts, isLoading } = useQuery({
    queryKey: ["latestPosts"],
    queryFn: () => postsApi.getLatestPosts(3),
  });

  return (
    <aside className="lg:w-80 flex-shrink-0 order-2 lg:order-1">
      <div className="lg:sticky lg:top-20 space-y-6">
        {/* Recent Created Posts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h3>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : latestPosts && latestPosts.length > 0 ? (
            <div className="space-y-4">
              {latestPosts.map((latestPost) => (
                <div
                  key={latestPost.id}
                  className="flex items-start space-x-3"
                >
                  {latestPost.header_image_url ? (
                    <img
                      src={latestPost.header_image_url}
                      alt={latestPost.title}
                      className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 object-cover"
                      onError={(e) => {
                        e.target.src = "";
                        e.target.className =
                          "w-16 h-16 bg-gray-200 rounded flex-shrink-0";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/post/${latestPost.slug}`}
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mb-1"
                    >
                      {latestPost.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {formatDate(latestPost.created_at)}
                    </p>
                    {latestPost.categories?.name && (
                      <p className="text-xs text-gray-400 mt-1">
                        {latestPost.categories.name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No posts available</p>
          )}
        </div>

        {/* Categories */}
        {post.categories && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
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
  );
};

export default PostPageSidebar;
