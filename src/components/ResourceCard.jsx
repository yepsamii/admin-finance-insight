import { useState } from "react";
import toast from "react-hot-toast";
import { getFileIcon, resourcesApi } from "../services/resourcesApi";

const ResourceCard = ({
  resource,
  onEdit,
  onDelete,
  isAdmin = false,
  onPublishToggle,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);
  const [currentPublishedState, setCurrentPublishedState] = useState(
    resource.published
  );

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setIsDeleting(true);
      try {
        await onDelete(resource.id);
        toast.success("Resource deleted successfully!");
      } catch (error) {
        console.error("Error deleting resource:", error);
        toast.error(error.message || "Failed to delete resource");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handlePublishToggle = async () => {
    setIsTogglingPublish(true);
    try {
      await resourcesApi.updateResource(resource.id, {
        ...resource,
        published: !currentPublishedState,
      });
      setCurrentPublishedState(!currentPublishedState);
      toast.success(
        !currentPublishedState
          ? "Resource published successfully!"
          : "Resource unpublished successfully!"
      );
      // Notify parent component if callback provided
      if (onPublishToggle) {
        onPublishToggle(resource.id, !currentPublishedState);
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error(error.message || "Failed to update publish status");
    } finally {
      setIsTogglingPublish(false);
    }
  };

  const handleDownload = () => {
    // Open the file in a new tab
    window.open(resource.file_url, "_blank");
  };

  const fileIcon = getFileIcon(resource.file_type);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 relative">
      {/* Draft Badge */}
      {!currentPublishedState && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded border border-yellow-200">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Draft
          </span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-5">
        {/* File Icon */}
        <div className="flex items-center justify-center w-14 h-14 mb-4 text-4xl">
          {fileIcon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {resource.title}
        </h3>
        {/* Description */}
        {resource.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-medium text-sm"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Download PDF</span>
          </button>

          {isAdmin && (
            <button
              onClick={handlePublishToggle}
              disabled={isTogglingPublish}
              className={`p-2 rounded transition-colors ${
                currentPublishedState
                  ? "text-green-600 hover:bg-green-50"
                  : "text-gray-600 hover:bg-gray-100"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={
                currentPublishedState
                  ? "Published - Click to unpublish"
                  : "Draft - Click to publish"
              }
            >
              {isTogglingPublish ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              ) : currentPublishedState ? (
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
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
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              )}
            </button>
          )}

          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(resource)}
              className="px-3 py-2 bg-navy-100 text-navy-700 rounded hover:bg-navy-200 transition-colors font-medium text-sm"
            >
              Edit
            </button>
          )}

          {isAdmin && onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isDeleting ? "..." : "Delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
