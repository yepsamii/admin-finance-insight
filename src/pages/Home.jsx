import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { postsApi } from '../services/blogApi';
import PostCard from '../components/PostCard';

const Home = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['published-posts'],
    queryFn: postsApi.getPublishedPosts,
  });

  return (
    <>
      <Helmet>
        <title>My Personal Blog</title>
        <meta name="description" content="Welcome to my personal blog where I share thoughts, tutorials, and experiences." />
      </Helmet>
      
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              My Personal Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Welcome to my corner of the internet where I share thoughts, tutorials, and experiences about technology, life, and everything in between.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Posts</h3>
                <p className="text-red-600">{error.message}</p>
              </div>
            </div>
          )}

          {/* Posts Grid */}
          {posts && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {posts && posts.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500">Check back later for new content!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;