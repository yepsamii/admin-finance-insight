import { useState, useEffect } from "react";
import { categoriesApi, tagsApi } from "../services/blogApi";
import { resourceStorageApi, formatFileSize } from "../services/resourcesApi";

const ResourceForm = ({ resource, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    tags: [],
    published: true,
    file_url: "",
    file_name: "",
    file_type: "",
    file_size: null,
  });

  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load categories and tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          categoriesApi.getAll(),
          tagsApi.getAll(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);

        // If editing, populate form with existing data
        if (resource) {
          setFormData({
            title: resource.title || "",
            description: resource.description || "",
            category_id: resource.category_id || "",
            tags: resource.resource_tags?.map((rt) => rt.tags.id) || [],
            published: resource.published ?? true,
            file_url: resource.file_url || "",
            file_name: resource.file_name || "",
            file_type: resource.file_type || "",
            file_size: resource.file_size || null,
          });
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load categories and tags");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [resource]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagToggle = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError("");
    setUploadingFile(true);
    setUploadProgress(0);

    try {
      // Simulate progress (Supabase doesn't provide upload progress natively)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file to storage
      const fileData = await resourceStorageApi.uploadFile(selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Store file info in form data
      setFormData((prev) => ({
        ...prev,
        file_url: fileData.url,
        file_name: fileData.fileName,
        file_type: fileData.fileType,
        file_size: fileData.fileSize,
      }));

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(err.message || "Failed to upload file");
      setUploadProgress(0);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      file_url: "",
      file_name: "",
      file_type: "",
      file_size: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.file_url) {
      setError("Please upload a file");
      return;
    }

    try {
      const resourceData = {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id || null,
        tags: formData.tags,
        published: formData.published,
        file_url: formData.file_url,
        file_name: formData.file_name,
        file_type: formData.file_type,
        file_size: formData.file_size,
      };

      await onSubmit(resourceData);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message || "Failed to save resource");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {formData.file_url ? "Uploaded File" : "Upload File *"}
        </label>

        {/* Show uploaded file info */}
        {formData.file_url ? (
          <div className="border border-gray-300 rounded p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">
                  {formData.file_type?.includes("pdf")
                    ? "📄"
                    : formData.file_type?.includes("word") ||
                      formData.file_type?.includes("doc")
                    ? "📝"
                    : formData.file_type?.includes("excel") ||
                      formData.file_type?.includes("spreadsheet")
                    ? "📊"
                    : formData.file_type?.includes("powerpoint") ||
                      formData.file_type?.includes("presentation")
                    ? "📽️"
                    : "📎"}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {formData.file_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(formData.file_size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* Upload input */
          <div>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.zip"
              disabled={uploadingFile}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-l file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Upload Progress */}
            {uploadingFile && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, MD,
              ZIP (Max 50MB)
            </p>
          </div>
        )}
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Enter resource title"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          placeholder="Describe what this resource contains..."
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category_id"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Category
        </label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          <option value="">Select a category (optional)</option>
          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  formData.tags.includes(tag.id)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={uploadingFile || !formData.file_url}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resource ? "Update Resource" : "Create Resource"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={uploadingFile}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ResourceForm;
