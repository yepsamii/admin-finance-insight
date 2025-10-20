# 🚀 Quick Start Guide

## Get Your Blog Running in 5 Minutes!

### 1️⃣ Set Up Supabase (2 minutes)

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project (or use existing)
3. Go to **SQL Editor**
4. Open `SUPABASE_SETUP.md` and copy-paste the SQL commands:
   - First: Create tables
   - Second: Enable RLS
   - Third: Create policies
   - Fourth: Add functions
   - Fifth: Insert sample data

### 2️⃣ Configure Environment (1 minute)

1. Copy `env.example` to `.env`:

   ```bash
   cp env.example .env
   ```

2. Get your credentials from Supabase:

   - Go to **Settings** → **API**
   - Copy **Project URL** → Paste as `VITE_SUPABASE_URL`
   - Copy **anon public** key → Paste as `VITE_SUPABASE_ANON_KEY`

3. Edit `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3️⃣ Run the App (2 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser!

### 4️⃣ First Login

1. Click **Login** in the navigation
2. Sign in with Google
3. You'll be redirected to the homepage

### 5️⃣ Create Your First Post

1. Go to **Dashboard** in the navigation
2. Click **New Post** button
3. Fill in:
   - Title: "My First Blog Post"
   - Description: "This is my first post!"
   - Content: Write something awesome
   - Category: Select one
   - Tags: Check a few
   - ✅ Check "Publish this post"
4. Click **Create Post**

### 6️⃣ View Your Blog

1. Go back to **Blog** in the navigation
2. See your published post!
3. Click on it to read the full content

---

## 🎨 Customize Your Blog

### Change Blog Name

Edit `src/components/Layout.jsx` line 50:

```jsx
<span className="text-xl font-bold text-gray-900">Your Blog Name Here</span>
```

### Add Categories

1. Go to **Settings** → **Categories** tab
2. Add your own categories

### Add Tags

1. Go to **Settings** → **Tags** tab
2. Add your own tags

---

## 📁 Key Pages

- **`/`** - Homepage (all published posts)
- **`/dashboard`** - Admin panel (manage posts)
- **`/settings`** - Manage categories & tags
- **`/login`** - Sign in with Google
- **`/post/:slug`** - Individual post page

---

## ✨ Features

- ✅ Create, edit, delete posts
- ✅ Publish or save as draft
- ✅ Categories and tags
- ✅ Header images
- ✅ SEO-friendly URLs
- ✅ Responsive design
- ✅ Google authentication
- ✅ Protected admin area

---

## 🆘 Troubleshooting

### Can't see posts on homepage?

- Make sure you checked "Publish this post" when creating
- Only published posts appear on the homepage
- Drafts are only visible in the Dashboard

### Authentication errors?

- Check your `.env` file has correct Supabase credentials
- Make sure Google OAuth is enabled in Supabase Auth settings

### Database errors?

- Verify all SQL commands from `SUPABASE_SETUP.md` were run
- Check RLS policies are enabled
- Make sure your Supabase project is active

---

## 📚 Full Documentation

For detailed information, see:

- `SUPABASE_SETUP.md` - Complete database setup
- `BLOG_SETUP_GUIDE.md` - Detailed setup guide
- `IMPLEMENTATION_SUMMARY.md` - Full feature list
- `DOCUMENTATION.md` - Technical documentation

---

**That's it! You're ready to blog!** 🎉
