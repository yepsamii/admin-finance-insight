import { useState, useEffect } from "react";
import { categoriesApi, tagsApi, storageApi } from "../services/blogApi";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "../constants/fileTypes";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

// Create schema without audio and file blocks (outside component to avoid recreation)
// eslint-disable-next-line no-unused-vars
const { audio, file, ...allowedBlockSpecs } = defaultBlockSpecs;

const customSchema = BlockNoteSchema.create({
  blockSpecs: allowedBlockSpecs,
});

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
  const [imageInputMode, setImageInputMode] = useState("url"); // 'url' or 'upload'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize BlockNote editor with custom upload handler and schema
  const editor = useCreateBlockNote({
    schema: customSchema,
    uploadFile: async (file) => {
      try {
        // Upload file to Supabase storage
        const url = await storageApi.uploadContentFile(file);
        return url;
      } catch (error) {
        console.error("Error uploading file in BlockNote:", error);
        throw error;
      }
    },
  });

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

      // Update editor content if post exists
      if (post.content) {
        try {
          const blocks = JSON.parse(post.content);
          editor.replaceBlocks(editor.document, blocks);
        } catch (error) {
          // If content is not valid JSON, treat it as plain text
          console.error("Error parsing content:", error);
          editor.replaceBlocks(editor.document, [
            {
              type: "paragraph",
              content: post.content,
            },
          ]);
        }
      }
    }
  }, [post, editor]);

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

  const handleEditorChange = () => {
    const blocks = editor.document;
    setFormData((prev) => ({
      ...prev,
      content: JSON.stringify(blocks),
    }));

    // Clear content error when user starts typing
    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: "",
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        header_image_url:
          "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
      }));
      return;
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        header_image_url: "Image size must be less than 5MB",
      }));
      return;
    }

    try {
      setUploadingImage(true);
      setUploadProgress(0);
      setErrors((prev) => ({ ...prev, header_image_url: "" }));

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

      const imageUrl = await storageApi.uploadImage(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setFormData((prev) => ({
        ...prev,
        header_image_url: imageUrl,
      }));

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors((prev) => ({
        ...prev,
        header_image_url: error.message || "Failed to upload image",
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      header_image_url: "",
    }));
    // Reset file input if in upload mode
    const fileInput = document.getElementById("image_file");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    // Check if editor has content (more than just empty blocks)
    const blocks = editor.document;
    const hasContent = blocks.some((block) => {
      if (block.content) {
        if (Array.isArray(block.content)) {
          return block.content.some((c) => c.text && c.text.trim());
        }
        return block.content.trim && block.content.trim();
      }
      return false;
    });

    if (!hasContent) {
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

      {/* Header Image */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-900">
            Cover Image
          </label>
          <div className="flex items-center space-x-2 bg-gray-100 rounded p-1">
            <button
              type="button"
              onClick={() => setImageInputMode("url")}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all duration-200 ${
                imageInputMode === "url"
                  ? "bg-white text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              URL
            </button>
            <button
              type="button"
              onClick={() => setImageInputMode("upload")}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all duration-200 ${
                imageInputMode === "upload"
                  ? "bg-white text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Upload
            </button>
          </div>
        </div>

        {imageInputMode === "url" ? (
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
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
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
        ) : (
          <div>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image_file"
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded cursor-pointer transition-all duration-200 ${
                  uploadingImage
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploadingImage ? (
                    <>
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-sm text-gray-600 font-medium">
                        Uploading... {uploadProgress}%
                      </p>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-700 font-semibold">
                        <span className="text-blue-600">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF or WebP (MAX. 5MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="image_file"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </label>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {errors.header_image_url && (
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
            {errors.header_image_url}
          </div>
        )}

        {formData.header_image_url && (
          <div className="mt-4 relative rounded overflow-hidden border-2 border-gray-200 group">
            <img
              src={formData.header_image_url}
              alt="Preview"
              className="w-full aspect-video object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x450?text=Image+Not+Found";
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
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
        <div className="bg-gray-50 border border-gray-200 rounded p-4 max-h-40 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-all duration-200 ${
                  formData.tags.includes(tag.id)
                    ? "bg-blue-100 border border-blue-300"
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
        <div
          className={`border rounded overflow-hidden ${
            errors.content ? "border-red-500" : "border-gray-300"
          }`}
        >
          <BlockNoteView
            editor={editor}
            onChange={handleEditorChange}
            theme="light"
          />
        </div>
        {errors.content && (
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
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-8 py-3 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
