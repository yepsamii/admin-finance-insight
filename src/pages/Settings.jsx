import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { categoriesApi, tagsApi } from "../services/blogApi";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTag, setEditingTag] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [tagForm, setTagForm] = useState({ name: "" });
  
  const queryClient = useQueryClient();

  // Fetch categories and tags
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  });

  // Category mutations
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

  // Tag mutations
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

  // Category handlers
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: categoryForm });
    } else {
      createCategoryMutation.mutate(categoryForm);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description || "" });
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure? This will affect posts using this category.")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "" });
  };

  // Tag handlers
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
    if (window.confirm("Are you sure? This will remove the tag from all posts.")) {
      deleteTagMutation.mutate(id);
    }
  };

  const handleCancelTagEdit = () => {
    setEditingTag(null);
    setTagForm({ name: "" });
  };

  return (
    <>
      <Helmet>
        <title>Settings - My Personal Blog</title>
        <meta name="description" content="Manage categories and tags for your blog" />
      </Helmet>

      <div className="min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your blog categories and tags</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("categories")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "categories"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setActiveTab("tags")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "tags"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Tags
              </button>
            </nav>
          </div>

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Category Form */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={
                        createCategoryMutation.isPending || updateCategoryMutation.isPending
                      }
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {editingCategory ? "Update" : "Create"}
                    </button>
                    {editingCategory && (
                      <button
                        type="button"
                        onClick={handleCancelCategoryEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Categories List */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
                {categoriesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : categories && categories.length > 0 ? (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-500">{category.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No categories yet</p>
                )}
              </div>
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === "tags" && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Tag Form */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingTag ? "Edit Tag" : "Add New Tag"}
                </h2>
                <form onSubmit={handleTagSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tag Name *
                    </label>
                    <input
                      type="text"
                      value={tagForm.name}
                      onChange={(e) => setTagForm({ name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., javascript, tutorial, tips"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={createTagMutation.isPending || updateTagMutation.isPending}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {editingTag ? "Update" : "Create"}
                    </button>
                    {editingTag && (
                      <button
                        type="button"
                        onClick={handleCancelTagEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Tags List */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
                {tagsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : tags && tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-full group hover:bg-gray-200"
                      >
                        <span className="text-sm font-medium text-gray-700">#{tag.name}</span>
                        <button
                          onClick={() => handleEditTag(tag)}
                          className="text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No tags yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;

