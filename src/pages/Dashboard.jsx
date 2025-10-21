import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { postsApi, categoriesApi, tagsApi } from "../services/blogApi";
import { resourcesApi } from "../services/resourcesApi";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import ResourceCard from "../components/ResourceCard";
import ResourceForm from "../components/ResourceForm";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTag, setEditingTag] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [tagForm, setTagForm] = useState({ name: "" });
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

  // ============ CATEGORIES & TAGS QUERIES & MUTATIONS ============
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  });

  const createCategoryMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCategoryForm({ name: "", description: "" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
      setCategoryForm({ name: "", description: "" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const createTagMutation = useMutation({
    mutationFn: tagsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setTagForm({ name: "" });
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }) => tagsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setEditingTag(null);
      setTagForm({ name: "" });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: tagsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
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

  // ============ CATEGORY HANDLERS ============
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategoryMutation.mutate({
        id: editingCategory.id,
        data: categoryForm,
      });
    } else {
      createCategoryMutation.mutate(categoryForm);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
    });
  };

  const handleDeleteCategory = (id) => {
    if (
      window.confirm(
        "Are you sure? This will affect posts using this category."
      )
    ) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "" });
  };

  // ============ TAG HANDLERS ============
  const handleTagSubmit = (e) => {
    e.preventDefault();
    if (editingTag) {
      updateTagMutation.mutate({ id: editingTag.id, data: tagForm });
    } else {
      createTagMutation.mutate(tagForm);
    }
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setTagForm({ name: tag.name });
  };

  const handleDeleteTag = (id) => {
    if (
      window.confirm("Are you sure? This will remove the tag from all posts.")
    ) {
      deleteTagMutation.mutate(id);
    }
  };

  const handleCancelTagEdit = () => {
    setEditingTag(null);
    setTagForm({ name: "" });
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

      <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Manage all your content, resources, and settings in one place
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 inline-flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === "posts"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Blog Posts</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === "resources"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2">
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Resources</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === "categories"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2">
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span>Categories</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("tags")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === "tags"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2">
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span>Tags</span>
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
                  <div className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                          Total Posts
                        </p>
                        <p className="text-4xl font-bold text-gray-900 mb-1">
                          {posts.length}
                        </p>
                        <p className="text-sm text-gray-600">
                          All content created
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-7 h-7 text-white"
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
                  </div>

                  {/* Published Card */}
                  <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">
                          Published
                        </p>
                        <p className="text-4xl font-bold text-gray-900 mb-1">
                          {posts.filter((post) => post.published).length}
                        </p>
                        <p className="text-sm text-gray-600">Live articles</p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-7 h-7 text-white"
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
                  </div>

                  {/* Drafts Card */}
                  <div className="group bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-2">
                          Drafts
                        </p>
                        <p className="text-4xl font-bold text-gray-900 mb-1">
                          {posts.filter((post) => !post.published).length}
                        </p>
                        <p className="text-sm text-gray-600">
                          Work in progress
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-7 h-7 text-white"
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
                  </div>
                </div>
              )}

              {/* Create Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowPostForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
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
                      className="bg-white rounded-2xl p-6 shadow-md animate-pulse"
                    >
                      <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
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
                  <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 p-8 rounded-2xl text-center shadow-lg">
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
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-lg"
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
                      />
                    ))}
                  </div>
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
                      Ready to Start Writing?
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      Create your first post and start sharing your financial
                      insights with the world.
                    </p>
                    <button
                      onClick={() => setShowPostForm(true)}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl font-semibold active:scale-95"
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
                <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {editingResource ? "Edit Resource" : "Upload New Resource"}
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
                <div className="mb-8">
                  <button
                    onClick={() => setShowResourceForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center space-x-2"
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
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading resources...</p>
                  </div>
                </div>
              ) : resourcesError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                  <p className="font-semibold">Error loading resources</p>
                  <p className="text-sm mt-1">{resourcesError.message}</p>
                </div>
              ) : resources && resources.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    {resources.length} resource
                    {resources.length !== 1 ? "s" : ""} total
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onEdit={handleEditResource}
                        onDelete={handleDeleteResource}
                        isAdmin={true}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No resources yet
                  </h3>
                  <p className="text-gray-600">
                    Upload your first resource to get started
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ============ CATEGORIES TAB ============ */}
          {activeTab === "categories" && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Category Form */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <form
                  onSubmit={handleCategorySubmit}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          name: e.target.value,
                        })
                      }
                      className="input-field"
                      placeholder="e.g., Investment Strategy"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="textarea-field"
                      placeholder="Brief description of this category"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={
                        createCategoryMutation.isPending ||
                        updateCategoryMutation.isPending
                      }
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      {createCategoryMutation.isPending ||
                      updateCategoryMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
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
                              d={
                                editingCategory
                                  ? "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  : "M12 4v16m8-8H4"
                              }
                            />
                          </svg>
                          {editingCategory
                            ? "Update Category"
                            : "Create Category"}
                        </>
                      )}
                    </button>
                    {editingCategory && (
                      <button
                        type="button"
                        onClick={handleCancelCategoryEdit}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold active:scale-95"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Categories List */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Categories
                  </h2>
                  {categories && categories.length > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      {categories.length} total
                    </span>
                  )}
                </div>
                {categoriesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : categories && categories.length > 0 ? (
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="group flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-gray-600">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 active:scale-95"
                            title="Edit category"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 active:scale-95"
                            title="Delete category"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">
                      No categories yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Create your first category to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============ TAGS TAB ============ */}
          {activeTab === "tags" && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Tag Form */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingTag ? "Edit Tag" : "Add New Tag"}
                </h2>
                <form
                  onSubmit={handleTagSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Tag Name *
                    </label>
                    <input
                      type="text"
                      value={tagForm.name}
                      onChange={(e) => setTagForm({ name: e.target.value })}
                      className="input-field"
                      placeholder="e.g., stocks, crypto, retirement"
                      required
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Tags help organize and categorize your content
                    </p>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={
                        createTagMutation.isPending ||
                        updateTagMutation.isPending
                      }
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      {createTagMutation.isPending ||
                      updateTagMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
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
                              d={
                                editingTag
                                  ? "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  : "M12 4v16m8-8H4"
                              }
                            />
                          </svg>
                          {editingTag ? "Update Tag" : "Create Tag"}
                        </>
                      )}
                    </button>
                    {editingTag && (
                      <button
                        type="button"
                        onClick={handleCancelTagEdit}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold active:scale-95"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Tags List */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Tags</h2>
                  {tags && tags.length > 0 && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                      {tags.length} total
                    </span>
                  )}
                </div>
                {tagsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : tags && tags.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:from-purple-50 hover:to-purple-100 transition-all duration-200"
                      >
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-700">
                          #{tag.name}
                        </span>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEditTag(tag)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            title="Edit tag"
                          >
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                            title="Delete tag"
                          >
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No tags yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Create your first tag to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
