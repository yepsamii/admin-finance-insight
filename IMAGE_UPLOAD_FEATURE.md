# Header Image Upload Feature

## Overview

The blog post form now supports **two methods** for adding header images:

1. **URL Input** - Paste a direct link to an image hosted elsewhere
2. **File Upload** - Upload images directly to Supabase Storage

## Features Implemented

### 1. Storage API (`src/services/blogApi.js`)

Added `storageApi` with two methods:

#### `uploadImage(file)`
- Uploads images to Supabase Storage
- Organizes files by user ID
- Generates unique filenames
- Returns the public URL

#### `deleteImage(imageUrl)`
- Extracts file path from URL
- Deletes image from storage
- Gracefully handles errors

### 2. Enhanced Post Form (`src/components/PostForm.jsx`)

#### UI Components

**Toggle Switch**
- Switch between "URL" and "Upload" modes
- Clean, modern design with active state indicators

**URL Mode**
- Text input for pasting image URLs
- Link icon for visual clarity
- Instant preview

**Upload Mode**
- Drag-and-drop file upload area
- File type restrictions (JPEG, PNG, GIF, WebP)
- Maximum file size: 5MB
- Upload progress indicator
- Visual feedback during upload

**Image Preview**
- Shows the selected/uploaded image
- Hover-to-show delete button
- Fallback for broken images

#### Validation

- ✅ File type validation (client-side)
- ✅ File size validation (5MB max)
- ✅ Error messages for invalid uploads
- ✅ Progress tracking

#### State Management

New state variables:
```javascript
const [imageInputMode, setImageInputMode] = useState("url");
const [uploadingImage, setUploadingImage] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
```

## User Experience

### Uploading an Image

1. Create or edit a blog post
2. Scroll to "Cover Image" section
3. Click **Upload** tab
4. Click the upload area or drag a file
5. Wait for upload to complete (progress shown)
6. Image URL is automatically set
7. Preview appears below

### Using a URL

1. Create or edit a blog post
2. Scroll to "Cover Image" section
3. Ensure **URL** tab is selected
4. Paste the image URL
5. Preview appears automatically

### Removing an Image

1. Hover over the image preview
2. Click the red trash icon that appears
3. Image is removed (but not deleted from storage)

## Technical Details

### File Organization

Images are stored with this structure:
```
post-images/
  └── {user_id}/
      └── {timestamp}-{random}.{ext}
```

Example:
```
post-images/
  └── 550e8400-e29b-41d4-a716-446655440000/
      └── 1697875200000-x9k2m.jpg
```

### Filename Generation

```javascript
const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
```

This ensures:
- No filename conflicts
- Easy user-based organization
- Traceable uploads

### Security

**Client-side validation:**
- File type checking
- File size limit
- User authentication check

**Server-side (Supabase):**
- RLS policies restrict uploads to authenticated users
- Users can only delete their own files
- Public read access for image display

## Setup Required

Before using this feature, you must:

1. **Create a storage bucket** named `post-images`
2. **Set it to public** for read access
3. **Configure RLS policies** for secure uploads

See `STORAGE_SETUP.md` for detailed instructions.

## Error Handling

### Upload Errors

**Invalid file type:**
```
"Please upload a valid image file (JPEG, PNG, GIF, or WebP)"
```

**File too large:**
```
"Image size must be less than 5MB"
```

**Upload failed:**
```
"Failed to upload image"
```

### Display Errors

If an image fails to load, a placeholder is shown:
```
https://via.placeholder.com/800x450?text=Image+Not+Found
```

## Code Changes Summary

### Modified Files

1. **src/services/blogApi.js**
   - Added `storageApi` export
   - Added `uploadImage()` method
   - Added `deleteImage()` method

2. **src/components/PostForm.jsx**
   - Added `storageApi` import
   - Added image mode toggle
   - Added file upload handler
   - Added progress tracking
   - Enhanced image preview section

### New Files

1. **STORAGE_SETUP.md** - Setup guide for Supabase Storage
2. **IMAGE_UPLOAD_FEATURE.md** - This file

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ File input with accept attribute
- ✅ Drag and drop (where supported)
- ✅ Progress indicators
- ✅ Hover states

## Future Enhancements

Potential improvements:
- [ ] Image cropping/editing
- [ ] Multiple image support
- [ ] Image compression before upload
- [ ] Automatic thumbnail generation
- [ ] Gallery view of uploaded images
- [ ] Bulk delete unused images
- [ ] Image optimization for web

## Performance Considerations

### Upload Speed
- Depends on file size and internet connection
- Progress bar provides feedback
- 5MB limit prevents excessively large uploads

### Storage Optimization
- Consider implementing cleanup for unused images
- Monitor storage usage on Supabase dashboard
- Implement image compression if needed

## Testing Checklist

- [ ] Upload a valid image (JPEG)
- [ ] Upload a PNG image
- [ ] Try uploading a file > 5MB (should fail)
- [ ] Try uploading a non-image file (should fail)
- [ ] Switch between URL and Upload modes
- [ ] Remove an uploaded image
- [ ] Paste a URL and verify preview
- [ ] Create a post with uploaded image
- [ ] Edit a post and change image
- [ ] Verify image displays on published post

---

**Feature Status**: ✅ Complete and ready to use (after Supabase Storage setup)

