# 🚀 Image Upload Feature - Setup Checklist

Follow these steps to enable the image upload feature for your blog.

## ✅ Step-by-Step Setup

### Step 1: Create Supabase Storage Bucket

1. Open your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **New bucket** button
5. Enter bucket details:
   ```
   Name: post-images
   Public: ✅ (checked)
   ```
6. Click **Create bucket**

### Step 2: Configure Storage Policies

**Option A: Using SQL Editor (Recommended)**

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Paste and run the following SQL:

```sql
-- Note: RLS is already enabled on storage.objects in Supabase
-- Just create the policies below

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

**Option B: Using Dashboard UI**

See `STORAGE_SETUP.md` for detailed instructions on using the dashboard UI.

### Step 3: Test the Feature

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Log in to your application

3. Navigate to create a new post

4. Try the **URL** mode:

   - Paste an image URL
   - Verify preview appears

5. Try the **Upload** mode:
   - Click the upload area
   - Select an image (< 5MB)
   - Wait for upload to complete
   - Verify image preview appears

### Step 4: Verify Policies

Test these scenarios to ensure security:

- ✅ Can upload when logged in
- ✅ Cannot upload when logged out
- ✅ Uploaded images are publicly viewable
- ✅ Can delete own images
- ✅ Cannot delete other users' images

## 🎨 What's Changed

### New Features

1. **Toggle between URL and Upload**

   - Switch modes with a single click
   - Clean, intuitive interface

2. **File Upload**

   - Drag and drop support
   - Visual upload progress
   - File validation
   - Error handling

3. **Image Management**
   - Preview before publishing
   - Easy removal with hover button
   - Automatic URL generation

### Modified Files

```
src/
├── components/
│   └── PostForm.jsx           ← Enhanced with upload feature
└── services/
    └── blogApi.js             ← Added storageApi
```

### New Documentation

```
STORAGE_SETUP.md              ← Detailed storage setup guide
IMAGE_UPLOAD_FEATURE.md       ← Feature documentation
SETUP_CHECKLIST.md           ← This file
```

## 📋 Validation Rules

**File Types Allowed:**

- JPEG/JPG
- PNG
- GIF
- WebP

**File Size Limit:**

- Maximum: 5MB

**Authentication:**

- Must be logged in to upload
- Anyone can view images (public bucket)

## 🔍 Troubleshooting

### "Unauthorized" error on upload

**Solution:** Ensure storage policies are created correctly

### Upload succeeds but image doesn't display

**Solution:** Check that bucket is set to "Public"

### Cannot find storage bucket

**Solution:** Verify bucket name is exactly `post-images`

### Large files fail to upload

**Solution:** Files must be under 5MB. Consider compressing the image.

## 🎯 Quick Test

Run this test to verify everything works:

1. **Log in** to your app
2. **Create new post**
3. Click **Upload** tab in Cover Image section
4. **Upload a small image** (< 1MB)
5. **Verify** upload completes successfully
6. **Save** the post
7. **Check** that image displays on the post

If all steps work, you're good to go! ✅

## 📊 Storage Monitoring

Keep an eye on your storage usage:

1. Go to **Storage** in Supabase Dashboard
2. Click on `post-images` bucket
3. View storage statistics

**Free Tier Limits:**

- 1GB storage
- 2GB bandwidth/month

## 🚨 Important Notes

1. **Bucket must be public** for images to display on the blog
2. **RLS policies** control who can upload/delete
3. **Client-side validation** prevents invalid files
4. **Server-side policies** enforce security
5. **Images are organized** by user ID

## ✅ Final Checklist

Before going live, verify:

- [ ] Storage bucket created and set to public
- [ ] All 4 RLS policies created
- [ ] URL mode works
- [ ] Upload mode works
- [ ] File validation works (try invalid file)
- [ ] Size validation works (try > 5MB file)
- [ ] Progress indicator shows during upload
- [ ] Image preview appears after upload
- [ ] Delete button removes image
- [ ] Can create post with uploaded image
- [ ] Image displays on published post

## 📚 Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
- See `STORAGE_SETUP.md` for detailed setup
- See `IMAGE_UPLOAD_FEATURE.md` for feature details

---

**Status**: Ready to set up! Follow the steps above and you'll be uploading images in minutes. 🎉
