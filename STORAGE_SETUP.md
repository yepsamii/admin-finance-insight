# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for uploading and managing post header images.

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `post-images`
   - **Public bucket**: ✅ Check this (so images are publicly accessible)
   - Click **Create bucket**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies to control access.

### Option A: Using Supabase Dashboard

1. In the Storage section, click on the `post-images` bucket
2. Go to the **Policies** tab
3. Add the following policies:

#### Policy 1: Public Read Access

- **Policy name**: `Public read access`
- **Allowed operation**: SELECT
- **Policy definition**:
  ```sql
  true
  ```
- **Description**: Allow anyone to view images

#### Policy 2: Authenticated Upload

- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: INSERT
- **Policy definition**:
  ```sql
  auth.role() = 'authenticated'
  ```
- **Description**: Only authenticated users can upload images

#### Policy 3: User Delete Own Files

- **Policy name**: `Users can delete their own images`
- **Allowed operation**: DELETE
- **Policy definition**:
  ```sql
  (bucket_id = 'post-images'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)
  ```
- **Description**: Users can only delete images in their own folder

### Option B: Using SQL Editor

Alternatively, you can run this SQL in the **SQL Editor**:

```sql
-- Note: RLS is already enabled on storage.objects by default in Supabase
-- You only need to create the policies below

-- Policy for public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- Policy for authenticated upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-images' AND
  auth.role() = 'authenticated'
);

-- Policy for users to delete their own files
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for users to update their own files
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'post-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Step 3: Test the Setup

1. Log in to your application
2. Create or edit a blog post
3. Click on the **Upload** tab in the Cover Image section
4. Try uploading an image (max 5MB)
5. The image should upload successfully and display in the preview

## File Organization

Images are organized by user ID:

```
post-images/
  └── {user_id}/
      ├── {timestamp}-{random}.jpg
      ├── {timestamp}-{random}.png
      └── ...
```

This structure:

- Keeps user files organized
- Makes it easy to implement deletion policies
- Prevents filename conflicts

## Supported Image Formats

- JPEG/JPG
- PNG
- GIF
- WebP

**Maximum file size**: 5MB

## Security Features

1. ✅ Only authenticated users can upload
2. ✅ Users can only delete their own images
3. ✅ File type validation (client-side)
4. ✅ File size validation (5MB max)
5. ✅ Public read access for displaying images on the blog

## Troubleshooting

### Upload fails with "Unauthorized" error

- Make sure you're logged in
- Check that the storage policies are correctly set up
- Verify that the bucket is named exactly `post-images`

### Images don't display

- Ensure the bucket is set to **public**
- Check browser console for CORS errors
- Verify the image URL is correct

### Cannot delete images

- Ensure the delete policy is set up correctly
- Check that the user owns the image (it's in their folder)

## Storage Limits

Supabase free tier includes:

- **1GB** of storage
- **2GB** of bandwidth per month

For production use, consider:

- Upgrading to a paid plan
- Implementing image optimization
- Using a CDN for better performance

## Next Steps

- Consider adding image compression before upload
- Implement automatic cleanup of unused images
- Add support for multiple images per post
- Implement image cropping/editing features

---

**Setup Complete!** Your blog now supports both URL-based and uploaded header images. 🎉
