# Resources Feature - Setup Guide

## 📋 Prerequisites

- ✅ Supabase project set up
- ✅ Categories table exists (from blog setup)
- ✅ Tags table exists (from blog setup)
- ✅ Authentication working

---

## 🚀 Step-by-Step Setup

### STEP 1: Database Setup (3 minutes)

1. **Open Supabase Dashboard**

   - Go to your Supabase project
   - Click **"SQL Editor"** in the left sidebar

2. **Run the SQL Script**

   - Click **"New Query"**
   - Open the file `resources-setup.sql`
   - Copy **ALL** the contents
   - Paste into the SQL editor
   - Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)

3. **Verify Success**
   - You should see messages like:
     ```
     ✅ Resources table created successfully!
     ✅ Resource tags table created successfully!
     ```
   - Go to **Table Editor** → You should see `resources` and `resource_tags` tables

---

### STEP 2: Storage Bucket Setup (3 minutes)

#### A. Create the Bucket

1. **Go to Storage**

   - In Supabase Dashboard, click **"Storage"** in the left sidebar
   - Click **"Create a new bucket"**

2. **Configure Bucket**
   - **Name:** `resource-files` (exactly this name!)
   - **Public bucket:** ✅ **Turn ON** (very important!)
   - Click **"Create bucket"**

#### B. Set Up Storage Policies

1. **Click on the bucket** `resource-files`
2. Click **"Policies"** tab
3. Click **"New Policy"**

**Add these 4 policies one by one:**

---

**POLICY 1: Public Read Access**

- Click **"New Policy"**
- Choose **"For full customization"** → **"Create policy"**
- **Policy name:** `Public Access`
- **Allowed operation:** `SELECT` only
- **Policy definition:**
  ```sql
  bucket_id = 'resource-files'
  ```
- Click **"Review"** → **"Save policy"**

---

**POLICY 2: Authenticated Upload**

- Click **"New Policy"**
- Choose **"For full customization"** → **"Create policy"**
- **Policy name:** `Authenticated users can upload`
- **Allowed operation:** `INSERT` only
- **Policy definition:**
  ```sql
  bucket_id = 'resource-files' AND auth.role() = 'authenticated'
  ```
- Click **"Review"** → **"Save policy"**

---

**POLICY 3: Update Own Files**

- Click **"New Policy"**
- Choose **"For full customization"** → **"Create policy"**
- **Policy name:** `Users can update own files`
- **Allowed operation:** `UPDATE` only
- **Policy definition:**
  ```sql
  bucket_id = 'resource-files' AND auth.uid()::text = (storage.foldername(name))[1]
  ```
- Click **"Review"** → **"Save policy"**

---

**POLICY 4: Delete Own Files**

- Click **"New Policy"**
- Choose **"For full customization"** → **"Create policy"**
- **Policy name:** `Users can delete own files`
- **Allowed operation:** `DELETE` only
- **Policy definition:**
  ```sql
  bucket_id = 'resource-files' AND auth.uid()::text = (storage.foldername(name))[1]
  ```
- Click **"Review"** → **"Save policy"**

---

### STEP 3: Verify Setup (1 minute)

1. **Check Database**

   - Go to **Table Editor**
   - Confirm you see:
     - ✅ `resources` table
     - ✅ `resource_tags` table

2. **Check Storage**
   - Go to **Storage**
   - Confirm you see:
     - ✅ `resource-files` bucket (with public badge)
     - ✅ 4 policies active

---

### STEP 4: Test the Feature (2 minutes)

1. **Start your app**

   ```bash
   npm run dev
   ```

2. **Navigate to Resources**

   - Open browser to `http://localhost:5173/resources`
   - You should see the Resources page

3. **Test Upload (as admin)**

   - Log in to your admin account
   - Click **"Upload New Resource"**
   - Select a PDF or document file
   - **Watch the progress bar** (should go 0% → 100%)
   - Fill in title and description
   - Click **"Create Resource"**
   - You should see success message!

4. **Test Public View**
   - Log out (or open incognito window)
   - Go to `/resources`
   - You should see your uploaded resource
   - Click **"Download"** to test

---

## ✅ Verification Checklist

Go through this checklist to make sure everything works:

### Database

- [ ] `resources` table exists
- [ ] `resource_tags` table exists
- [ ] Can see tables in Table Editor
- [ ] RLS is enabled on both tables

### Storage

- [ ] `resource-files` bucket exists
- [ ] Bucket is set to **Public**
- [ ] 4 policies are active:
  - [ ] Public Access (SELECT)
  - [ ] Authenticated users can upload (INSERT)
  - [ ] Users can update own files (UPDATE)
  - [ ] Users can delete own files (DELETE)

### Application

- [ ] Resources page loads at `/resources`
- [ ] Navigation shows "Resources" link
- [ ] Can upload a file (when logged in)
- [ ] See upload progress bar
- [ ] File preview shows after upload
- [ ] Can fill out form and submit
- [ ] Resource appears in the list
- [ ] Can download the file
- [ ] Search works
- [ ] Category filter works

---

## 🐛 Troubleshooting

### "Table does not exist" error

**Solution:** Run the `resources-setup.sql` script again

### "Bucket does not exist" error

**Solution:** Create the `resource-files` bucket in Storage (make sure it's PUBLIC)

### Cannot upload files / 403 Forbidden

**Solutions:**

1. Make sure bucket is set to **Public**
2. Check all 4 storage policies are created
3. Verify you're logged in as admin
4. Check browser console for detailed error

### Files upload but cannot download

**Solution:** Make sure bucket is set to **Public** and "Public Access" SELECT policy exists

### Upload progress stuck at 0%

**Solution:** Check browser console for errors, verify storage policies

### "Row Level Security" error

**Solution:** The SQL script should have enabled RLS. Run it again.

---

## 📁 File Structure

After setup, your database will have:

```
resources table:
├── id (UUID, primary key)
├── title (required)
├── description (optional)
├── file_url (URL from storage)
├── file_name (original filename)
├── file_type (MIME type)
├── file_size (in bytes)
├── category_id (FK to categories)
├── uploaded_by (FK to auth.users)
├── downloads (counter)
├── published (boolean)
├── created_at
└── updated_at

resource_tags table:
├── resource_id (FK to resources)
└── tag_id (FK to tags)

Storage:
resource-files/
  ├── {user-id-1}/
  │   ├── timestamp-random.pdf
  │   └── timestamp-random.docx
  └── {user-id-2}/
      └── ...
```

---

## 🎯 Supported File Types

- 📄 PDF (`.pdf`)
- 📝 Word (`.doc`, `.docx`)
- 📊 Excel (`.xls`, `.xlsx`)
- 📽️ PowerPoint (`.ppt`, `.pptx`)
- 📃 Text (`.txt`)
- 📃 Markdown (`.md`)
- 📦 ZIP (`.zip`)

**Max file size:** 50MB

---

## 🔐 Security Features

- ✅ File type validation
- ✅ File size limits (50MB)
- ✅ User authentication required for uploads
- ✅ RLS policies prevent unauthorized access
- ✅ Users can only edit/delete their own resources
- ✅ Files organized by user ID in storage

---

## 🎨 Features

### For Everyone (Public)

- Browse published resources
- Search by title/description
- Filter by category
- Download files
- See download counts

### For Admins (Logged In)

- Upload new resources with progress indicator
- Edit existing resources
- Delete resources
- Publish/unpublish resources
- Manage categories and tags

---

## 📝 Usage Flow

### Upload a Resource

1. **Log in** as admin
2. Go to `/resources`
3. Click **"Upload New Resource"**
4. **Select file** → File uploads immediately (see progress bar)
5. **Wait for upload** → See file preview when done
6. **Fill form:**
   - Title (required)
   - Description (optional)
   - Category (optional)
   - Tags (optional)
   - Publish toggle
7. Click **"Create Resource"**
8. Done! ✅

### Public User Flow

1. Visit `/resources`
2. Browse resources
3. Use search or filters
4. Click **"Download"** on any resource
5. File opens/downloads

---

## 🚨 Important Notes

1. **Bucket MUST be Public** - If not, downloads won't work
2. **Exact bucket name** - Must be `resource-files` (not `resources` or anything else)
3. **Storage policies are critical** - All 4 must be set up correctly
4. **File uploads immediately** - When user selects a file, it uploads to storage before they fill out the form
5. **Cannot edit file** - Can only replace it by removing and uploading new one

---

## 🎉 You're Done!

If you've completed all steps and the checklist, your Resources feature is ready to use!

**Next steps:**

1. Add some categories (Dashboard → manage categories)
2. Add some tags (Dashboard → manage tags)
3. Upload your first resources!
4. Share the `/resources` page with your users

---

## 📞 Need Help?

If something isn't working:

1. **Check browser console** (F12) for error messages
2. **Verify all steps** completed in order
3. **Check Supabase logs** (Dashboard → Logs)
4. **Re-run SQL script** if database issues
5. **Recreate storage bucket** if storage issues

---

**That's it! Your Resources feature is now live!** 🚀
