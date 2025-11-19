import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { resourcesApi } from "../services/resourcesApi";
import { categoriesApi } from "../services/blogApi";
import ResourceCard from "../components/ResourceCard";

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch only published resources (public view)
  const {
    data: resources,
    isLoading: resourcesLoading,
    error: resourcesError,
  } = useQuery({
    queryKey: ["resources"],
    queryFn: resourcesApi.getPublishedResources,
    onError: (error) => {
      console.error("Error fetching resources:", error);
      toast.error(
        `Failed to load resources: ${error.message || "Unknown error"}`
      );
    },
  });

  // Fetch categories
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

  // Show toast on error
  useEffect(() => {
    if (resourcesError) {
      toast.error(
        `Error loading resources: ${resourcesError.message || "Unknown error"}`
      );
    }
  }, [resourcesError]);

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

      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Resource Library
            </h1>
            <p className="text-gray-600">
              Download helpful guides, worksheets, and reference materials
            </p>
          </div>
          {/* Filters and Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded px-4 py-2.5 pr-10 text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all duration-200 shadow-sm"
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

            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded px-4 py-2.5 pr-10 text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all duration-200 shadow-sm">
                <option value="">Newest</option>
                <option value="">Oldest</option>
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

            {/* Search */}
            <div className="relative flex-1 max-w-md ml-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Resources"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-sm"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-3.5"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onEdit={null}
                  onDelete={null}
                  isAdmin={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
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
