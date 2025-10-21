import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, tagsApi } from "../services/blogApi";

const CategoryTagSidebar = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("categories");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTag, setEditingTag] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });
  const [tagForm, setTagForm] = useState({ name: "" });

  // Queries
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  });

  // Category Mutations
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

  // Tag Mutations
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

  // Category Handlers
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

  const handleCancelCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "" });
  };

  // Tag Handlers
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

  const handleCancelTag = () => {
    setEditingTag(null);
    setTagForm({ name: "" });
  };

  return (
    <div className="w-full bg-white overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-5 flex-shrink-0">
        <h2 className="text-xl font-bold text-white">Manage Content</h2>
        <p className="text-blue-100 text-sm mt-1">Categories & Tags</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6 flex-shrink-0">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
            activeTab === "categories"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Categories ({categories?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
            activeTab === "tags"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Tags ({tags?.length || 0})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            {/* Form */}
            <div className="bg-blue-50 rounded p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <form
                onSubmit={handleCategorySubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g., Finance"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    placeholder="Brief description (optional)"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={
                      createCategoryMutation.isPending ||
                      updateCategoryMutation.isPending
                    }
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingCategory ? "Update" : "Add"}
                  </button>
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={handleCancelCategory}
                      className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-all duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                All Categories
              </h3>
              {categoriesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : categories && categories.length > 0 ? (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white border border-gray-200 rounded p-4 hover:border-blue-400 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {category.name}
                          </h4>
                          {category.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 ml-3">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-all duration-200"
                            title="Edit"
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
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-all duration-200"
                            title="Delete"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  <p className="text-gray-500 font-medium">No categories yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create your first category above
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags Tab */}
        {activeTab === "tags" && (
          <div className="space-y-6">
            {/* Form */}
            <div className="bg-purple-50 rounded p-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editingTag ? "Edit Tag" : "Add New Tag"}
              </h3>
              <form
                onSubmit={handleTagSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={tagForm.name}
                    onChange={(e) => setTagForm({ name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="e.g., Tax Planning"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={
                      createTagMutation.isPending || updateTagMutation.isPending
                    }
                    className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingTag ? "Update" : "Add"}
                  </button>
                  {editingTag && (
                    <button
                      type="button"
                      onClick={handleCancelTag}
                      className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-all duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">All Tags</h3>
              {tagsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : tags && tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded hover:border-purple-400 transition-all duration-200 group"
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        #{tag.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditTag(tag)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-all duration-200"
                          title="Edit"
                        >
                          <svg
                            className="w-3.5 h-3.5"
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
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-all duration-200"
                          title="Delete"
                        >
                          <svg
                            className="w-3.5 h-3.5"
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
                <div className="text-center py-12 bg-gray-50 rounded border border-gray-200">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mx-auto mb-4">
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
                    Create your first tag above
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTagSidebar;
