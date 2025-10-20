import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "../services/resourcesApi";
import { categoriesApi } from "../services/blogApi";
import ResourceCard from "../components/ResourceCard";
import ResourceForm from "../components/ResourceForm";
import { useAuth } from "../contexts/AuthContext";

const Resources = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch resources
  const {
    data: resources,
    isLoading: resourcesLoading,
    error: resourcesError,
  } = useQuery({
    queryKey: ["resources", user?.id],
    queryFn: () =>
      user
        ? resourcesApi.getAllResources()
        : resourcesApi.getPublishedResources(),
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: resourcesApi.createResource,
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      setShowForm(false);
      alert("Resource uploaded successfully!");
    },
    onError: (error) => {
      alert(error.message || "Failed to upload resource");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => resourcesApi.updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      setShowForm(false);
      setEditingResource(null);
      alert("Resource updated successfully!");
    },
    onError: (error) => {
      alert(error.message || "Failed to update resource");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: resourcesApi.deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries(["resources"]);
      alert("Resource deleted successfully!");
    },
    onError: (error) => {
      alert(error.message || "Failed to delete resource");
    },
  });

  const handleSubmit = async (resourceData) => {
    if (editingResource) {
      await updateMutation.mutateAsync({
        id: editingResource.id,
        data: resourceData,
      });
    } else {
      await createMutation.mutateAsync(resourceData);
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingResource(null);
  };

  // Filter resources
  const filteredResources = resources?.filter((resource) => {
    const matchesCategory =
      !selectedCategory || resource.category_id === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Resources | Finance Insights</title>
        <meta
          name="description"
          content="Download helpful resources including PDFs, documents, and guides"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                📚 Resources Library
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Download helpful resources, guides, and documents to support
                your financial journey
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Admin Actions */}
          {user && !showForm && (
            <div className="mb-8">
              <button
                onClick={() => setShowForm(true)}
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

          {/* Upload/Edit Form */}
          {showForm && (
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingResource ? "Edit Resource" : "Upload New Resource"}
              </h2>
              <ResourceForm
                resource={editingResource}
                onSubmit={handleSubmit}
                onCancel={handleCancelForm}
              />
            </div>
          )}

          {/* Filters and Search */}
          <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Resources
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or description..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-3"
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
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory) && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-2 hover:text-blue-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    Category:{" "}
                    {categories?.find((c) => c.id === selectedCategory)?.name}
                    <button
                      onClick={() => setSelectedCategory("")}
                      className="ml-2 hover:text-purple-900"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

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
          ) : filteredResources && filteredResources.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredResources.length} resource
                {filteredResources.length !== 1 ? "s" : ""}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onEdit={user ? handleEdit : null}
                    onDelete={user ? handleDelete : null}
                    isAdmin={!!user}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No resources found
              </h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory
                  ? "Try adjusting your filters"
                  : "Check back later for new resources"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Resources;
