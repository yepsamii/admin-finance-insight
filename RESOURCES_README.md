# Resources Feature

A complete file upload and management system for your Finance Insights application.

## 📚 What You Get

- **Public resources page** at `/resources`
- **File uploads** with progress indicators (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, MD, ZIP)
- **Search and filter** functionality
- **Categories and tags** support
- **Download tracking**
- **Admin management** interface

## 🚀 Quick Start

### 1. Run Database Setup

```sql
-- Open Supabase SQL Editor
-- Copy and run: resources-setup.sql
```

### 2. Create Storage Bucket

```
Supabase Dashboard → Storage
→ Create bucket "resource-files" (Public)
→ Add 4 policies (see setup guide)
```

### 3. Test It

```bash
npm run dev
# Go to /resources
# Upload a file!
```

## 📖 Full Setup Guide

👉 **See [RESOURCES_SETUP_GUIDE.md](./RESOURCES_SETUP_GUIDE.md)** for complete step-by-step instructions

## 📁 Files

### Setup Files

- `RESOURCES_SETUP_GUIDE.md` - Complete setup instructions
- `resources-setup.sql` - Database schema (run this in Supabase)

### Code Files

- `src/services/resourcesApi.js` - API service layer
- `src/components/ResourceCard.jsx` - Resource display card
- `src/components/ResourceForm.jsx` - Upload/edit form
- `src/pages/Resources.jsx` - Public resources page

## ⚡ Key Features

### Upload Flow

1. Select file → File uploads **immediately** to storage
2. See **progress bar** (0-100%)
3. File **preview** appears
4. Fill out title, description, category, tags
5. Click submit → Done!

### User Experience

- ✅ Real-time upload progress
- ✅ File preview before submission
- ✅ Search resources
- ✅ Filter by category
- ✅ Download tracking
- ✅ Responsive design

### Security

- ✅ File type validation
- ✅ Size limits (50MB)
- ✅ Row Level Security (RLS)
- ✅ User-based access control
- ✅ Organized storage by user ID

## 🎯 Supported Files

- 📄 PDF
- 📝 Word (DOC, DOCX)
- 📊 Excel (XLS, XLSX)
- 📽️ PowerPoint (PPT, PPTX)
- 📃 Text (TXT, MD)
- 📦 ZIP

Max size: **50MB**

## 🐛 Troubleshooting

### Common Issues

**"Cannot upload files"**

- Ensure `resource-files` bucket exists and is **Public**
- Check all 4 storage policies are set

**"Table does not exist"**

- Run `resources-setup.sql` in Supabase SQL Editor

**"403 Forbidden"**

- Make sure you're logged in
- Verify storage policies are correct

**Need help?** Check the [Full Setup Guide](./RESOURCES_SETUP_GUIDE.md) for detailed troubleshooting.

## ✨ That's It!

Once set up, you'll have a fully functional resource management system with:

- Beautiful UI
- Smooth uploads with progress tracking
- Search and filters
- Public access for downloads
- Admin controls for management

**Ready to start?** Follow [RESOURCES_SETUP_GUIDE.md](./RESOURCES_SETUP_GUIDE.md)!

---

**Questions?** All answers are in the setup guide! 📖
