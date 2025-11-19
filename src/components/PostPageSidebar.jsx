import { Link } from "react-router-dom";

const PostPageSidebar = ({post}) => {
  return (
    <aside className="lg:w-80 flex-shrink-0 order-2 lg:order-1">
      <div className="lg:sticky lg:top-20 space-y-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h3>
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
