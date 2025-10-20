# Finance Insights - Admin Portal

A modern, full-featured blog and resource management platform built with React, Supabase, and Tailwind CSS.

## 🚀 Features

### Blog Management

- ✍️ **Rich Content Editor** - Create and edit blog posts with markdown support
- 🖼️ **Image Uploads** - Direct upload to Supabase Storage with validation
- 🏷️ **Categories & Tags** - Organize content with flexible taxonomy
- 📝 **Draft System** - Save drafts before publishing
- 🔍 **SEO Optimized** - Dynamic meta tags and helmet integration
- 📱 **Fully Responsive** - Beautiful UI on all devices

### Resource Library

- 📚 **File Management** - Upload and manage PDF, DOC, XLS, PPT, and more
- 📊 **Download Tracking** - Monitor resource downloads
- 🔎 **Search & Filter** - Find resources by category and keywords
- 🎯 **Smart Organization** - Categorize with tags and descriptions

### Admin Features

- 🔐 **Google OAuth** - Secure authentication with Supabase
- 👥 **Role-Based Access** - Admin-only protected routes
- 📈 **Dashboard Stats** - View published posts, drafts, and resources
- ⚙️ **Settings Panel** - Manage categories, tags, and content

### Developer Experience

- ⚡ **Vite** - Lightning-fast development
- 🎨 **Tailwind CSS** - Modern utility-first styling
- 🔄 **React Query** - Powerful data fetching and caching
- 🏗️ **Clean Architecture** - Organized, maintainable codebase

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up free](https://supabase.com))
- Google OAuth credentials (optional, for authentication)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd admin-finance-insight
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### 4. Set Up Supabase

#### Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT NOT NULL,
  header_image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES users(id) NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post_Tags junction table
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Resources table
CREATE TABLE resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  downloads INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource_Tags junction table
CREATE TABLE resource_tags (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX idx_posts_published ON posts(published, published_at DESC);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_uploaded_by ON resources(uploaded_by);

-- Function to increment downloads
CREATE OR REPLACE FUNCTION increment_resource_downloads(resource_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE resources
  SET downloads = downloads + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql;
```

#### Row Level Security (RLS) Policies

Enable RLS and add policies:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Tags policies (public read, admin write)
CREATE POLICY "Anyone can view tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON tags FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Posts policies
CREATE POLICY "Anyone can view published posts" ON posts FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all posts" ON posts FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can create posts" ON posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Authors can update own posts" ON posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Authors can delete own posts" ON posts FOR DELETE USING (author_id = auth.uid());

-- Post_Tags policies
CREATE POLICY "Anyone can view post tags" ON post_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage post tags" ON post_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Resources policies
CREATE POLICY "Anyone can view published resources" ON resources FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all resources" ON resources FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can create resources" ON resources FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Uploaders can update own resources" ON resources FOR UPDATE USING (uploaded_by = auth.uid());
CREATE POLICY "Uploaders can delete own resources" ON resources FOR DELETE USING (uploaded_by = auth.uid());

-- Resource_Tags policies
CREATE POLICY "Anyone can view resource tags" ON resource_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage resource tags" ON resource_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

#### Storage Buckets

Create two storage buckets in Supabase Storage:

1. **post-images** (for blog post images)

   - Public bucket
   - Allowed MIME types: `image/jpeg, image/jpg, image/png, image/gif, image/webp`
   - Max file size: 5MB

2. **resource-files** (for downloadable resources)
   - Public bucket
   - Allowed MIME types: Various document types
   - Max file size: 50MB

Storage RLS policies:

```sql
-- Post images policies
CREATE POLICY "Anyone can view post images" ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own post images" ON storage.objects FOR UPDATE
  USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own post images" ON storage.objects FOR DELETE
  USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Resource files policies
CREATE POLICY "Anyone can view resource files" ON storage.objects FOR SELECT
  USING (bucket_id = 'resource-files');

CREATE POLICY "Authenticated users can upload resource files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resource-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own resource files" ON storage.objects FOR UPDATE
  USING (bucket_id = 'resource-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own resource files" ON storage.objects FOR DELETE
  USING (bucket_id = 'resource-files' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 5. Set Up Google OAuth (Optional)

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Follow Supabase's guide to set up Google OAuth credentials
4. Add authorized redirect URIs

### 6. Create Admin User

After first login with Google OAuth, manually set your user role to 'admin' in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Visit `http://localhost:5173` to see your application.

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/         # Reusable React components
│   ├── Layout.jsx     # Main layout with navigation
│   ├── PostCard.jsx   # Blog post card
│   ├── PostDetail.jsx # Single post view
│   ├── PostForm.jsx   # Post creation/editing form
│   ├── ProtectedRoute.jsx  # Auth route guard
│   ├── ResourceCard.jsx    # Resource card
│   └── ResourceForm.jsx    # Resource upload form
├── constants/         # App constants
│   ├── fileTypes.js   # File type definitions
│   └── messages.js    # User messages
├── contexts/          # React contexts
│   └── AuthContext.jsx # Authentication context
├── lib/              # Third-party integrations
│   └── supabase.js   # Supabase client
├── pages/            # Page components
│   ├── AuthPage.jsx  # Login page
│   ├── Dashboard.jsx # Admin dashboard
│   ├── Home.jsx      # Public homepage
│   ├── PostPage.jsx  # Single post page
│   ├── Resources.jsx # Resources library
│   └── Settings.jsx  # Admin settings
├── services/         # API services
│   ├── blogApi.js    # Blog-related APIs
│   └── resourcesApi.js # Resource-related APIs
├── utils/            # Utility functions
│   ├── dateFormatter.js # Date utilities
│   ├── fileHelpers.js  # File utilities
│   └── textHelpers.js  # Text utilities
├── App.jsx           # Main app component
├── main.jsx          # App entry point
└── index.css         # Global styles
```

## 🎨 Features in Detail

### Blog System

- Create, edit, and delete blog posts
- Upload header images with automatic validation
- Organize posts with categories and tags
- Draft and publish workflow
- SEO-friendly URLs with slugs
- Reading time calculation
- Responsive card layouts

### Resource Management

- Upload various file types (PDF, DOC, XLS, PPT, etc.)
- Automatic file validation and size limits
- Download tracking
- Search and filter functionality
- Category-based organization
- File size and type display

### Authentication & Security

- Google OAuth integration
- Protected admin routes
- Row-level security in database
- Role-based access control
- Secure file uploads

## 🔧 Configuration

### Environment Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Tailwind Configuration

The project uses Tailwind CSS v4 with custom configurations in `index.css` including:

- Custom color palette
- Reusable component classes
- Animation utilities
- Responsive breakpoints

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React, Supabase, and Tailwind CSS
