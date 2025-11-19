import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { postsApi, categoriesApi, tagsApi } from "../services/blogApi";
import { resourcesApi } from "../services/resourcesApi";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import ResourceCard from "../components/ResourceCard";
import ResourceForm from "../components/ResourceForm";
import CategoryTagSidebar from "../components/CategoryTagSidebar";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // ============ CATEGORIES & TAGS QUERIES ============
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
    onError: (error) => {
      console.error("Error fetching categories:", error);
      toast.error(
        `Failed to load categories: ${error.message || "Unknown error"}`
      );
    },
  });

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
    onError: (error) => {
      console.error("Error fetching tags:", error);
      toast.error(`Failed to load tags: ${error.message || "Unknown error"}`);
    },
  });

  // ============ POSTS QUERIES & MUTATIONS ============
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["all-posts"],
    queryFn: postsApi.getAllPosts,
    onError: (error) => {
      console.error("Error fetching posts:", error);
      toast.error(`Failed to load posts: ${error.message || "Unknown error"}`);
    },
  });

  const createPostMutation = useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-posts"] });
      setShowPostForm(false);
      toast.success("Post created successfully!");
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast.error(error.message || "Failed to create post");
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }) => postsApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-posts"] });
      setShowPostForm(false);
      setEditingPost(null);
      toast.success("Post updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast.error(error.message || "Failed to update post");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.invalidateQueries({ queryKey: ["published-posts"] });
      toast.success("Post deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast.error(error.message || "Failed to delete post");
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
    onError: (error) => {
      console.error("Error fetching resources:", error);
      toast.error(
        `Failed to load resources: ${error.message || "Unknown error"}`
      );
    },
  });

  const createResourceMutation = useMutation({
    mutationFn: resourcesApi.createResource,
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      setShowResourceForm(false);
      toast.success("Resource uploaded successfully!");
    },
    onError: (error) => {
      console.error("Error creating resource:", error);
      toast.error(error.message || "Failed to upload resource");
    },
  });

  const updateResourceMutation = useMutation({
    mutationFn: ({ id, data }) => resourcesApi.updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      setShowResourceForm(false);
      setEditingResource(null);
      toast.success("Resource updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating resource:", error);
      toast.error(error.message || "Failed to update resource");
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: resourcesApi.deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      toast.success("Resource deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting resource:", error);
      toast.error(error.message || "Failed to delete resource");
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

  // ============ HANDLE TAB SWITCH ============
  useEffect(() => {
    // Clear tags when switching to resources tab (resources don't have tags)
    if (activeTab === "resources") {
      setSelectedTags([]);
    }
  }, [activeTab]);

  // ============ CLOSE DROPDOWN ON OUTSIDE CLICK ============
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("tags-dropdown");
      const button = event.target.closest("button");

      if (dropdown && !dropdown.classList.contains("hidden")) {
        // Check if click is outside both dropdown and its toggle button
        if (
          !dropdown.contains(event.target) &&
          (!button || !button.contains(event.target.closest("svg")))
        ) {
          dropdown.classList.add("hidden");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ============ FILTER AND SORT POSTS ============
  const filteredPosts = posts
    ?.filter((post) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          post.title?.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower) ||
          post.content?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory && post.category_id !== selectedCategory) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        if (!post.post_tags || post.post_tags.length === 0) return false;
        const postTagIds = post.post_tags.map((pt) => pt.tags.id);
        const hasMatchingTag = selectedTags.some((tagId) =>
          postTagIds.includes(tagId)
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortBy === "newest") {
        return (
          new Date(b.created_at || b.published_at) -
          new Date(a.created_at || a.published_at)
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.created_at || a.published_at) -
          new Date(b.created_at || b.published_at)
        );
      }
      return 0;
    });

  // ============ FILTER AND SORT RESOURCES ============
  const filteredResources = resources
    ?.filter((resource) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          resource.title?.toLowerCase().includes(searchLower) ||
          resource.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory && resource.category_id !== selectedCategory) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return 0;
    });

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

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${
                    activeTab === "posts" ? "posts" : "resources"
                  }...`}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-all shadow-sm text-sm"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
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
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 cursor-pointer transition-all shadow-sm"
                  >
                    <option value="">All Categories</option>
                    {categories?.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
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

                {/* Tags Filter - Only for Posts */}
                {activeTab === "posts" && tags && tags.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => {
                        const tagContainer =
                          document.getElementById("tags-dropdown");
                        tagContainer.classList.toggle("hidden");
                      }}
                      className="inline-flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500 transition-all shadow-sm"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
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
                      Tags
                      {selectedTags.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-navy-600 text-white text-xs rounded-full">
                          {selectedTags.length}
                        </span>
                      )}
                      <svg
                        className="w-4 h-4 ml-2"
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
                    </button>
                    <div
                      id="tags-dropdown"
                      className="hidden absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px] max-h-[300px] overflow-y-auto"
                    >
                      {tags.map((tag) => (
                        <label
                          key={tag.id}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag.id)}
                            onChange={() => {
                              setSelectedTags((prev) =>
                                prev.includes(tag.id)
                                  ? prev.filter((id) => id !== tag.id)
                                  : [...prev, tag.id]
                              );
                            }}
                            className="w-4 h-4 text-navy-600 border-gray-300 rounded focus:ring-navy-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            {tag.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sort Filter */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 cursor-pointer transition-all shadow-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
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

                {/* Clear Filters Button */}
                {(searchQuery ||
                  selectedCategory ||
                  selectedTags.length > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setSelectedTags([]);
                    }}
                    className="inline-flex items-center px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear Filters
                  </button>
                )}
              </div>
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

                {/* Search Results Info */}
                {searchQuery && filteredPosts && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Showing {filteredPosts.length} of {posts?.length || 0}{" "}
                      posts
                    </p>
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
                {filteredPosts && filteredPosts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {searchQuery
                          ? `Search Results (${filteredPosts.length})`
                          : `Your Posts (${filteredPosts.length})`}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          showActions={true}
                          onEdit={handleEditPost}
                          onDelete={handleDeletePost}
                          onPublishToggle={handlePostPublishToggle}
                          currentUserId={user?.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results from Filters */}
                {(searchQuery || selectedCategory || selectedTags.length > 0) &&
                  filteredPosts &&
                  filteredPosts.length === 0 &&
                  posts &&
                  posts.length > 0 && (
                    <div className="text-center py-16">
                      <div className="max-w-md mx-auto bg-white rounded-lg p-8 border border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg
                            className="w-10 h-10 text-gray-400"
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
                        <p className="text-gray-600 mb-6">
                          {searchQuery &&
                          selectedCategory &&
                          selectedTags.length > 0 ? (
                            <>
                              No posts match your search "{searchQuery}" with
                              the selected category and tags.
                            </>
                          ) : searchQuery && selectedCategory ? (
                            <>
                              No posts match your search "{searchQuery}" in the
                              selected category.
                            </>
                          ) : searchQuery && selectedTags.length > 0 ? (
                            <>
                              No posts match your search "{searchQuery}" with
                              the selected tags.
                            </>
                          ) : selectedCategory && selectedTags.length > 0 ? (
                            <>
                              No posts found in the selected category with the
                              selected tags.
                            </>
                          ) : searchQuery ? (
                            <>No posts match your search "{searchQuery}".</>
                          ) : selectedCategory ? (
                            <>No posts found in the selected category.</>
                          ) : selectedTags.length > 0 ? (
                            <>
                              No posts found with the selected tag
                              {selectedTags.length > 1 ? "s" : ""}.
                            </>
                          ) : (
                            <>Try adjusting your filters to find more posts.</>
                          )}
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("");
                            setSelectedTags([]);
                          }}
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Clear All Filters
                        </button>
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
                ) : filteredResources && filteredResources.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <p className="text-gray-600 font-semibold">
                        {searchQuery
                          ? `Showing ${filteredResources.length} of ${
                              resources?.length || 0
                            } resources`
                          : `${filteredResources.length} resource${
                              filteredResources.length !== 1 ? "s" : ""
                            } total`}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredResources.map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onEdit={handleEditResource}
                          onDelete={handleDeleteResource}
                          isAdmin={true}
                          onPublishToggle={handleResourcePublishToggle}
                          currentUserId={user?.id}
                        />
                      ))}
                    </div>
                  </>
                ) : (searchQuery || selectedCategory) &&
                  filteredResources &&
                  filteredResources.length === 0 &&
                  resources &&
                  resources.length > 0 ? (
                  <div className="text-center py-16">
                    <div className="max-w-md mx-auto bg-white rounded-lg p-8 border border-gray-200">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-10 h-10 text-gray-400"
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
                        No resources found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {searchQuery && selectedCategory ? (
                          <>
                            No resources match your search "{searchQuery}" in
                            the selected category.
                          </>
                        ) : searchQuery ? (
                          <>No resources match your search "{searchQuery}".</>
                        ) : selectedCategory ? (
                          <>No resources found in the selected category.</>
                        ) : (
                          <>
                            Try adjusting your filters to find more resources.
                          </>
                        )}
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("");
                        }}
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
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Clear All Filters
                      </button>
                    </div>
                  </div>
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
