import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { postsApi } from "../services/blogApi";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all-posts"],
    queryFn: postsApi.getAllPosts,
  });

  const createPostMutation = useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-posts"] });
      setShowForm(false);
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }) => postsApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-posts"] });
      setShowForm(false);
      setEditingPost(null);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-posts"] });
    },
  });

  const handleCreatePost = (postData) => {
    createPostMutation.mutate(postData);
  };

  const handleUpdatePost = (postData) => {
    updatePostMutation.mutate({ id: editingPost.id, data: postData });
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDeletePost = (post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      deletePostMutation.mutate(post.id);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  if (showForm) {
    return (
      <>
        <Helmet>
          <title>
            {editingPost ? "Edit Post" : "Create Post"} - Admin Dashboard
          </title>
        </Helmet>

        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h1>
              <p className="text-gray-600">
                {editingPost
                  ? "Update your post content and settings."
                  : "Write a new blog post and share it with the world."}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <PostForm
                post={editingPost}
                onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
                onCancel={handleCancelForm}
                isLoading={
                  createPostMutation.isPending || updatePostMutation.isPending
                }
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - My Personal Blog</title>
        <meta
          name="description"
          content="Manage your blog posts, categories, and content."
        />
      </Helmet>

      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your blog posts and content
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>New Post</span>
            </button>
          </div>

          {/* Stats */}
          {posts && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
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
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Posts
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {posts.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Published
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {posts.filter((post) => post.published).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-yellow-600"
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
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Drafts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {posts.filter((post) => !post.published).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Error Loading Posts
                </h3>
                <p className="text-red-600">{error.message}</p>
              </div>
            </div>
          )}

          {/* Posts List */}
          {posts && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  showActions={true}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {posts && posts.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by creating your first blog post.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Your First Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
