import { useState, useEffect } from "react";
import { categoriesApi, tagsApi } from "../services/blogApi";

const PostForm = ({ post = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    header_image_url: "",
    category_id: "",
    tags: [],
    published: false,
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          categoriesApi.getAll(),
          tagsApi.getAll(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        description: post.description || "",
        content: post.content || "",
        header_image_url: post.header_image_url || "",
        category_id: post.category_id || "",
        tags: post.post_tags ? post.post_tags.map((pt) => pt.tags.id) : [],
        published: post.published || false,
      });
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleTagChange = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Article Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input-field ${errors.title ? "input-error" : ""}`}
          placeholder="Enter a compelling title for your post"
        />
        {errors.title && (
          <div className="mt-2 flex items-center text-sm text-red-600">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.title}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Short Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="textarea-field"
          placeholder="A brief summary that will appear in previews and social shares"
        />
        <p className="mt-2 text-xs text-gray-500">
          {formData.description.length} / 200 characters
        </p>
      </div>

      {/* Header Image URL */}
      <div>
        <label
          htmlFor="header_image_url"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Cover Image URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <input
            type="url"
            id="header_image_url"
            name="header_image_url"
            value={formData.header_image_url}
            onChange={handleChange}
            className="input-field pl-12"
            placeholder="https://images.example.com/cover.jpg"
          />
        </div>
        {formData.header_image_url && (
          <div className="mt-4 rounded-xl overflow-hidden border-2 border-gray-200">
            <img
              src={formData.header_image_url}
              alt="Preview"
              className="w-full aspect-video object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x450?text=Image+Not+Found";
              }}
            />
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category_id"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Category
        </label>
        <div className="relative">
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="input-field appearance-none pr-10"
          >
            <option value="">Choose a category...</option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
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
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Tags{" "}
          <span className="text-gray-500 font-normal">
            ({formData.tags.length} selected)
          </span>
        </label>
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 max-h-40 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.tags.includes(tag.id)
                    ? "bg-blue-100 ring-2 ring-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.tags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`text-sm font-medium ${
                    formData.tags.includes(tag.id)
                      ? "text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  {tag.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Article Content *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={16}
          className={`textarea-field font-mono text-sm ${
            errors.content ? "input-error" : ""
          }`}
          placeholder="Write your article content here... Use markdown for formatting."
        />
        {errors.content ? (
          <div className="mt-2 flex items-center text-sm text-red-600">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.content}
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              {formData.content.split(/\s+/).length} words ·{" "}
              {Math.ceil(formData.content.split(/\s+/).length / 200)} min read
            </span>
            <span>Markdown supported</span>
          </div>
        )}
      </div>

      {/* Published */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
          />
          <div className="flex-1">
            <label
              htmlFor="published"
              className="block text-base font-semibold text-gray-900 mb-1 cursor-pointer"
            >
              Publish this article
            </label>
            <p className="text-sm text-gray-600">
              {formData.published
                ? "This article will be visible to all visitors on the blog."
                : "This article will be saved as a draft and won't be publicly visible."}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-8 border-t-2 border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {isLoading ? (
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
                {post ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                )}
              </svg>
              {post ? "Update Article" : "Create Article"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
