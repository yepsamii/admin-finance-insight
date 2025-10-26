import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { postsApi } from "../services/blogApi";
import { resourcesApi } from "../services/resourcesApi";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import ResourceCard from "../components/ResourceCard";
import ResourceForm from "../components/ResourceForm";
import CategoryTagSidebar from "../components/CategoryTagSidebar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const queryClient = useQueryClient();

  // ============ POSTS QUERIES & MUTATIONS ============
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["all-posts"],
    queryFn: postsApi.getAllPosts,
  });

  const createPostMutation = useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-posts"] });
      setShowPostForm(false);
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }) => postsApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-posts"] });
      setShowPostForm(false);
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

  // ============ RESOURCES QUERIES & MUTATIONS ============
  const {
    data: resources,
    isLoading: resourcesLoading,
    error: resourcesError,
  } = useQuery({
    queryKey: ["resources"],
    queryFn: resourcesApi.getAllResources,
  });

  const createResourceMutation = useMutation({
    mutationFn: resourcesApi.createResource,
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      setShowResourceForm(false);
      alert("Resource uploaded successfully!");
    },
    onError: (error) => {
      alert(error.message || "Failed to upload resource");
    },
  });

  const updateResourceMutation = useMutation({
    mutationFn: ({ id, data }) => resourcesApi.updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      setShowResourceForm(false);
      setEditingResource(null);
      alert("Resource updated successfully!");
    },
    onError: (error) => {
      alert(error.message || "Failed to update resource");
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: resourcesApi.deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      alert("Resource deleted successfully!");
    },
    onError: (error) => {
      alert(error.message || "Failed to delete resource");
    },
  });

  // ============ POST HANDLERS ============
  const handleCreatePost = (postData) => {
    createPostMutation.mutate(postData);
  };

  const handleUpdatePost = (postData) => {
    updatePostMutation.mutate({ id: editingPost.id, data: postData });
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowPostForm(true);
  };

  const handleDeletePost = (post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      deletePostMutation.mutate(post.id);
    }
  };

  const handleCancelPostForm = () => {
    setShowPostForm(false);
    setEditingPost(null);
  };

  const handlePostPublishToggle = () => {
    // Invalidate queries to refresh the data
    queryClient.invalidateQueries({ queryKey: ["all-posts"] });
    queryClient.invalidateQueries({ queryKey: ["published-posts"] });
  };

  // ============ RESOURCE HANDLERS ============
  const handleResourceSubmit = async (resourceData) => {
    if (editingResource) {
      await updateResourceMutation.mutateAsync({
        id: editingResource.id,
        data: resourceData,
      });
    } else {
      await createResourceMutation.mutateAsync(resourceData);
    }
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowResourceForm(true);
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      await deleteResourceMutation.mutateAsync(id);
    }
  };

  const handleCancelResourceForm = () => {
    setShowResourceForm(false);
    setEditingResource(null);
  };

  const handleResourcePublishToggle = () => {
    // Invalidate queries to refresh the data
    queryClient.invalidateQueries(["resources"]);
  };

  // ============ RENDER POST FORM ============
  if (showPostForm) {
    return (
      <>
        <Helmet>
          <title>
            {editingPost ? "Edit Post" : "Create Post"} - Admin Dashboard
          </title>
        </Helmet>

        <div className="min-h-screen py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
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
                onCancel={handleCancelPostForm}
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

  // ============ MAIN DASHBOARD RENDER ============
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Finance Insights</title>
        <meta
          name="description"
          content="Manage your blog posts, resources, categories, and tags."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex">
        {/* Main Content */}
        <div className="flex-1 py-8 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage all your content, resources, and settings in one place
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6 inline-flex gap-1">
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-6 py-2.5 rounded-md font-semibold text-sm transition-colors ${
                  activeTab === "posts"
                    ? "bg-navy-800 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Blog Posts</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`px-6 py-2.5 rounded-md font-semibold text-sm transition-colors ${
                  activeTab === "resources"
                    ? "bg-navy-800 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Resources</span>
                </div>
              </button>
            </div>

            {/* ============ BLOG POSTS TAB ============ */}
            {activeTab === "posts" && (
              <div>
                {/* Stats */}
                {posts && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Posts Card */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-navy-600 rounded-lg">
                          <svg
                            className="w-6 h-6 text-white"
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
                      </div>
                      <h3 className="text-xs font-semibold text-navy-600 uppercase tracking-wide mb-2">
                        Total Posts
                      </h3>
                      <p className="text-4xl font-bold text-gray-900 mb-1">
                        {posts.length}
                      </p>
                      <p className="text-sm text-gray-600">
                        All content created
                      </p>
                    </div>

                    {/* Published Card */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-green-600 rounded-lg">
                          <svg
                            className="w-6 h-6 text-white"
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
                      </div>
                      <h3 className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
                        Published
                      </h3>
                      <p className="text-4xl font-bold text-gray-900 mb-1">
                        {posts.filter((post) => post.published).length}
                      </p>
                      <p className="text-sm text-gray-600">Live articles</p>
                    </div>

                    {/* Drafts Card */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-orange-500 rounded-lg">
                          <svg
                            className="w-6 h-6 text-white"
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
                      </div>
                      <h3 className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">
                        Drafts
                      </h3>
                      <p className="text-4xl font-bold text-gray-900 mb-1">
                        {posts.filter((post) => !post.published).length}
                      </p>
                      <p className="text-sm text-gray-600">Work in progress</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => setShowPostForm(true)}
                    className="inline-flex items-center px-6 py-3 bg-navy-800 text-white rounded-lg font-semibold hover:bg-navy-900 transition-colors"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Create New Post</span>
                  </button>
                </div>

                {/* Loading State */}
                {postsLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse"
                      >
                        <div className="bg-gray-200 rounded h-48 mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Error State */}
                {postsError && (
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-red-50 border border-red-200 p-8 rounded-lg text-center">
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-white"
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
                      </div>
                      <h3 className="text-xl font-bold text-red-800 mb-2">
                        Error Loading Posts
                      </h3>
                      <p className="text-red-600 mb-4">{postsError.message}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}

                {/* Posts List */}
                {posts && posts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Your Posts ({posts.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          showActions={true}
                          onEdit={handleEditPost}
                          onDelete={handleDeletePost}
                          onPublishToggle={handlePostPublishToggle}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {posts && posts.length === 0 && (
                  <div className="text-center py-16">
                    <div className="max-w-md mx-auto bg-white rounded-lg p-8 border border-gray-200">
                      <div className="w-20 h-20 bg-navy-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-10 h-10 text-white"
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
                        Ready to Start Writing?
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Create your first post and start sharing your financial
                        insights with the world.
                      </p>
                      <button
                        onClick={() => setShowPostForm(true)}
                        className="inline-flex items-center px-6 py-3 bg-navy-800 text-white rounded-lg hover:bg-navy-900 transition-colors font-semibold"
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Create Your First Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============ RESOURCES TAB ============ */}
            {activeTab === "resources" && (
              <div>
                {/* Upload/Edit Form */}
                {showResourceForm && (
                  <div className="mb-8 bg-white rounded-lg p-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {editingResource
                        ? "Edit Resource"
                        : "Upload New Resource"}
                    </h2>
                    <ResourceForm
                      resource={editingResource}
                      onSubmit={handleResourceSubmit}
                      onCancel={handleCancelResourceForm}
                    />
                  </div>
                )}

                {/* Upload Button */}
                {!showResourceForm && (
                  <div className="mb-6">
                    <button
                      onClick={() => setShowResourceForm(true)}
                      className="px-6 py-3 bg-navy-800 text-white rounded-lg hover:bg-navy-900 transition-colors font-semibold flex items-center space-x-2"
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Upload New Resource</span>
                    </button>
                  </div>
                )}

                {/* Resources Grid */}
                {resourcesLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold">
                        Loading resources...
                      </p>
                    </div>
                  </div>
                ) : resourcesError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                    <p className="font-bold">Error loading resources</p>
                    <p className="text-sm mt-1">{resourcesError.message}</p>
                  </div>
                ) : resources && resources.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <p className="text-gray-600 font-semibold">
                        {resources.length} resource
                        {resources.length !== 1 ? "s" : ""} total
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {resources.map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onEdit={handleEditResource}
                          onDelete={handleDeleteResource}
                          isAdmin={true}
                          onPublishToggle={handleResourcePublishToggle}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="max-w-md mx-auto bg-white rounded-lg p-8 border border-gray-200">
                      <div className="w-20 h-20 bg-navy-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        No resources yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Upload your first resource to get started
                      </p>
                      <button
                        onClick={() => setShowResourceForm(true)}
                        className="inline-flex items-center px-6 py-3 bg-navy-800 text-white rounded-lg hover:bg-navy-900 transition-colors font-semibold"
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Upload First Resource
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Sidebar */}
        <aside className="w-96 flex-shrink-0 bg-white border-l border-gray-200 hidden lg:block">
          <div className="h-full overflow-auto">
            <CategoryTagSidebar />
          </div>
        </aside>
      </div>
    </>
  );
};

export default Dashboard;
