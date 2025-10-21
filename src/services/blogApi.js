import { supabase } from "../lib/supabase";
import { generateSlug } from "../utils/textHelpers";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from "../constants/fileTypes";

// STORAGE API
export const storageApi = {
  // Upload image to Supabase Storage
  async uploadImage(file) {
    const { user } = (await supabase.auth.getUser()).data;
    if (!user) throw new Error("User not authenticated");

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, or WebP)"
      );
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("Image size must be less than 5MB");
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("post-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("post-images").getPublicUrl(data.path);

    return publicUrl;
  },

  // Delete image from Supabase Storage
  async deleteImage(imageUrl) {
    if (!imageUrl) return;

    try {
      // Extract path from URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/post-images\/(.+)/);

      if (pathMatch && pathMatch[1]) {
        const filePath = pathMatch[1];

        const { error } = await supabase.storage
          .from("post-images")
          .remove([filePath]);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      // Don't throw error as this is not critical
    }
  },

  // Upload file for BlockNote editor (images and videos within content)
  async uploadContentFile(file) {
    const { user } = (await supabase.auth.getUser()).data;
    if (!user) throw new Error("User not authenticated");

    // Determine if it's an image or video
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      throw new Error(
        "Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, MPEG, MOV, WebM, OGG)"
      );
    }

    // Validate file size
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      throw new Error("Image size must be less than 5MB");
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      throw new Error("Video size must be less than 100MB");
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileName = `${user.id}/${timestamp}-${randomStr}.${fileExt}`;

    // Choose the appropriate storage bucket
    const bucketName = isImage ? "post-content-images" : "post-content-videos";

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(data.path);

    return publicUrl;
  },

  // Delete content file (image or video) from Supabase Storage
  async deleteContentFile(fileUrl) {
    if (!fileUrl) return;

    try {
      // Extract path from URL
      const url = new URL(fileUrl);
      const imageMatch = url.pathname.match(/\/post-content-images\/(.+)/);
      const videoMatch = url.pathname.match(/\/post-content-videos\/(.+)/);

      if (imageMatch && imageMatch[1]) {
        const filePath = imageMatch[1];
        const { error } = await supabase.storage
          .from("post-content-images")
          .remove([filePath]);

        if (error) throw error;
      } else if (videoMatch && videoMatch[1]) {
        const filePath = videoMatch[1];
        const { error } = await supabase.storage
          .from("post-content-videos")
          .remove([filePath]);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error deleting content file:", error);
      // Don't throw error as this is not critical
    }
  },
};

// POSTS API
export const postsApi = {
  // Get all published posts for homepage
  async getPublishedPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        post_tags (
          tags (
            id,
            name,
            slug
          )
        )
      `
      )
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all posts for admin (including drafts)
  async getAllPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        post_tags (
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

  // Get single post by slug
  async getPostBySlug(slug) {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        post_tags (
          tags (
            id,
            name,
            slug
          )
        )
      `
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  },

  // Get single post by ID
  async getPostById(id) {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        categories (
          id,
          name,
          slug
        ),
        post_tags (
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

  // Create new post
  async createPost(postData) {
    const { user } = (await supabase.auth.getUser()).data;
    if (!user) throw new Error("User not authenticated");

    const slug = generateSlug(postData.title);

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingPost) {
      throw new Error("A post with this title already exists");
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: postData.title,
        slug: slug,
        description: postData.description,
        content: postData.content,
        header_image_url: postData.header_image_url,
        category_id: postData.category_id,
        author_id: user.id,
        published: postData.published || false,
        published_at: postData.published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;

    // Add tags if provided
    if (postData.tags && postData.tags.length > 0) {
      await this.addTagsToPost(data.id, postData.tags);
    }

    return data;
  },

  // Update post
  async updatePost(id, postData) {
    const { user } = (await supabase.auth.getUser()).data;
    if (!user) throw new Error("User not authenticated");

    // Get current post to check ownership
    const { data: currentPost, error: fetchError } = await supabase
      .from("posts")
      .select("author_id, slug")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (currentPost.author_id !== user.id) {
      throw new Error("You can only edit your own posts");
    }

    const updateData = {
      title: postData.title,
      description: postData.description,
      content: postData.content,
      header_image_url: postData.header_image_url,
      category_id: postData.category_id,
      published: postData.published || false,
      updated_at: new Date().toISOString(),
    };

    // Generate new slug if title changed
    if (postData.title !== currentPost.title) {
      const newSlug = generateSlug(postData.title);

      // Check if new slug already exists
      const { data: existingPost } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", newSlug)
        .neq("id", id)
        .maybeSingle();

      if (existingPost) {
        throw new Error("A post with this title already exists");
      }

      updateData.slug = newSlug;
    }

    // Set published_at if publishing for the first time
    if (postData.published && !currentPost.published) {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Update tags if provided
    if (postData.tags !== undefined) {
      await this.removeAllTagsFromPost(id);
      if (postData.tags && postData.tags.length > 0) {
        await this.addTagsToPost(id, postData.tags);
      }
    }

    return data;
  },

  // Delete post
  async deletePost(id) {
    const { user } = (await supabase.auth.getUser()).data;
    if (!user) throw new Error("User not authenticated");

    // Check ownership
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (post.author_id !== user.id) {
      throw new Error("You can only delete your own posts");
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;
    return true;
  },

  // Add tags to post
  async addTagsToPost(postId, tagIds) {
    const tagInserts = tagIds.map((tagId) => ({
      post_id: postId,
      tag_id: tagId,
    }));

    const { error } = await supabase.from("post_tags").insert(tagInserts);

    if (error) throw error;
  },

  // Remove all tags from post
  async removeAllTagsFromPost(postId) {
    const { error } = await supabase
      .from("post_tags")
      .delete()
      .eq("post_id", postId);

    if (error) throw error;
  },
};

// CATEGORIES API
export const categoriesApi = {
  // Get all categories
  async getAll() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  },

  // Create category
  async create(categoryData) {
    const slug = generateSlug(categoryData.name);

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: categoryData.name,
        slug: slug,
        description: categoryData.description,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update category
  async update(id, categoryData) {
    const updateData = {
      name: categoryData.name,
      description: categoryData.description,
    };

    // Generate new slug if name changed
    if (categoryData.name) {
      updateData.slug = generateSlug(categoryData.name);
    }

    const { data, error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete category
  async delete(id) {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;
    return true;
  },
};

// TAGS API
export const tagsApi = {
  // Get all tags
  async getAll() {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  },

  // Create tag
  async create(tagData) {
    const slug = generateSlug(tagData.name);

    const { data, error } = await supabase
      .from("tags")
      .insert({
        name: tagData.name,
        slug: slug,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update tag
  async update(id, tagData) {
    const updateData = {
      name: tagData.name,
    };

    // Generate new slug if name changed
    if (tagData.name) {
      updateData.slug = generateSlug(tagData.name);
    }

    const { data, error } = await supabase
      .from("tags")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete tag
  async delete(id) {
    const { error } = await supabase.from("tags").delete().eq("id", id);

    if (error) throw error;
    return true;
  },
};
