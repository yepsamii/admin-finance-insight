import { supabase } from "../lib/supabase";

// Helper function to get file extension
const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

// Helper function to format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Helper function to get file icon
export const getFileIcon = (fileType) => {
  if (fileType.includes("pdf")) return "📄";
  if (fileType.includes("word") || fileType.includes("doc")) return "📝";
  if (fileType.includes("excel") || fileType.includes("spreadsheet"))
    return "📊";
  if (fileType.includes("powerpoint") || fileType.includes("presentation"))
    return "📽️";
  if (fileType.includes("text") || fileType.includes("markdown")) return "📃";
  if (fileType.includes("zip") || fileType.includes("archive")) return "📦";
  return "📎";
};

// STORAGE API for Resources
export const resourceStorageApi = {
  // Upload resource file to Supabase Storage
  async uploadFile(file) {
    const { user } = (await supabase.auth.getUser()).data;
    if (!user) throw new Error("User not authenticated");

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "text/markdown",
      "application/zip",
      "application/x-zip-compressed",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, MD, ZIP"
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 50MB");
    }

    // Generate unique filename
    const fileExt = getFileExtension(file.name);
    const fileName = `${user.id}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("resource-files")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("resource-files").getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };
  },

  // Delete resource file from Supabase Storage
  async deleteFile(fileUrl) {
    if (!fileUrl) return;

    try {
      // Extract path from URL
      const url = new URL(fileUrl);
      const pathMatch = url.pathname.match(/\/resource-files\/(.+)/);

      if (pathMatch && pathMatch[1]) {
        const filePath = pathMatch[1];

        const { error } = await supabase.storage
          .from("resource-files")
          .remove([filePath]);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      // Don't throw error as this is not critical
    }
  },
};

// RESOURCES API
export const resourcesApi = {
  // Get all published resources (public access)
  async getPublishedResources() {
    const { data, error } = await supabase
      .from("resources")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        resource_tags (
          tags (
            id,
            name,
            slug
          )
        )
      `
      )
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all resources for admin (including unpublished)
  async getAllResources() {
    const { data, error } = await supabase
      .from("resources")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        resource_tags (
          tags (
            id,
            name,
            slug
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get single resource by ID
  async getResourceById(id) {
    const { data, error } = await supabase
      .from("resources")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        resource_tags (
          tags (
            id,
            name,
            slug
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new resource
  async createResource(resourceData) {
    const { user } = (await supabase.auth.getUser()).data;
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("resources")
      .insert({
        title: resourceData.title,
        description: resourceData.description,
        file_url: resourceData.file_url,
        file_name: resourceData.file_name,
        file_type: resourceData.file_type,
        file_size: resourceData.file_size,
        category_id: resourceData.category_id,
        uploaded_by: user.id,
        published: resourceData.published || true,
      })
      .select()
      .single();

    if (error) throw error;

    // Add tags if provided
    if (resourceData.tags && resourceData.tags.length > 0) {
      await this.addTagsToResource(data.id, resourceData.tags);
    }

    return data;
  },

  // Update resource
  async updateResource(id, resourceData) {
    const { user } = (await supabase.auth.getUser()).data;
    if (!user) throw new Error("User not authenticated");

    // Get current resource to check ownership
    const { data: currentResource, error: fetchError } = await supabase
      .from("resources")
      .select("uploaded_by")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (currentResource.uploaded_by !== user.id) {
      throw new Error("You can only edit your own resources");
    }

    const updateData = {
      title: resourceData.title,
      description: resourceData.description,
      category_id: resourceData.category_id,
      published: resourceData.published,
      updated_at: new Date().toISOString(),
    };

    // Only update file info if a new file was uploaded
    if (resourceData.file_url) {
      updateData.file_url = resourceData.file_url;
      updateData.file_name = resourceData.file_name;
      updateData.file_type = resourceData.file_type;
      updateData.file_size = resourceData.file_size;
    }

    const { data, error } = await supabase
      .from("resources")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Update tags if provided
    if (resourceData.tags !== undefined) {
      await this.removeAllTagsFromResource(id);
      if (resourceData.tags && resourceData.tags.length > 0) {
        await this.addTagsToResource(id, resourceData.tags);
      }
    }

    return data;
  },

  // Delete resource
  async deleteResource(id) {
    const { user } = (await supabase.auth.getUser()).data;
    if (!user) throw new Error("User not authenticated");

    // Get resource to check ownership and file URL
    const { data: resource, error: fetchError } = await supabase
      .from("resources")
      .select("uploaded_by, file_url")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (resource.uploaded_by !== user.id) {
      throw new Error("You can only delete your own resources");
    }

    // Delete the file from storage
    await resourceStorageApi.deleteFile(resource.file_url);

    // Delete the database record
    const { error } = await supabase.from("resources").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  // Increment download count
  async incrementDownloads(id) {
    const { error } = await supabase.rpc("increment_resource_downloads", {
      resource_id: id,
    });

    // If the function doesn't exist, update manually
    if (error) {
      const { data: resource } = await supabase
        .from("resources")
        .select("downloads")
        .eq("id", id)
        .single();

      if (resource) {
        await supabase
          .from("resources")
          .update({ downloads: (resource.downloads || 0) + 1 })
          .eq("id", id);
      }
    }
  },

  // Add tags to resource
  async addTagsToResource(resourceId, tagIds) {
    const tagInserts = tagIds.map((tagId) => ({
      resource_id: resourceId,
      tag_id: tagId,
    }));

    const { error } = await supabase.from("resource_tags").insert(tagInserts);

    if (error) throw error;
  },

  // Remove all tags from resource
  async removeAllTagsFromResource(resourceId) {
    const { error } = await supabase
      .from("resource_tags")
      .delete()
      .eq("resource_id", resourceId);

    if (error) throw error;
  },

  // Get resources by category
  async getResourcesByCategory(categoryId) {
    const { data, error } = await supabase
      .from("resources")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        resource_tags (
          tags (
            id,
            name,
            slug
          )
        )
      `
      )
      .eq("category_id", categoryId)
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Search resources
  async searchResources(query) {
    const { data, error } = await supabase
      .from("resources")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        resource_tags (
          tags (
            id,
            name,
            slug
          )
        )
      `
      )
      .eq("published", true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};
