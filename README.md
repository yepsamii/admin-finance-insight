# Personal Blog Platform

A modern, full-featured personal blog platform with admin panel built with React, Supabase, and Tailwind CSS. Create, manage, and publish your blog posts with ease!

## ✨ Features

- 📝 **Full Blog Management** - Create, edit, delete, and publish blog posts
- 🏷️ **Categories & Tags** - Organize posts with global categories and individual tags
- 🖼️ **Header Images** - Add beautiful header images to posts
- 🔐 **Authentication** - Secure Google OAuth authentication via Supabase
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- 🎨 **Modern UI** - Clean, professional design with Tailwind CSS
- ⚡ **Fast & Optimized** - Built with Vite and TanStack Query for optimal performance
- 🔒 **Secure** - Row Level Security policies ensure data protection

## 🚀 Technologies

- **React 18.3** - Modern UI library
- **Vite 7.1** - Lightning-fast build tool
- **Supabase** - Backend as a Service (Auth + Database)
- **TanStack Query** - Powerful data synchronization
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **React Helmet Async** - SEO optimization

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- A Supabase account ([Sign up free](https://supabase.com))

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Set up Supabase database**

   - Follow instructions in `SUPABASE_SETUP.md`
   - Run all SQL commands in your Supabase SQL Editor

3. **Configure environment**

```bash
cp env.example .env
# Edit .env with your Supabase credentials
```

4. **Start the app**

```bash
npm run dev
```

**📖 For detailed setup, see [QUICK_START.md](QUICK_START.md)**

## 🛠️ Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout.jsx     # Main layout with navigation
│   ├── ProtectedRoute.jsx # Route protection
│   ├── PostCard.jsx   # Post display component
│   ├── PostForm.jsx   # Post creation/editing form
│   └── PostDetail.jsx # Individual post view
├── contexts/          # React Context providers
│   └── AuthContext.jsx # Authentication state
├── lib/               # External service configs
│   └── supabase.js   # Supabase client
├── pages/             # Page components
│   ├── Home.jsx      # Blog homepage
│   ├── Dashboard.jsx # Admin dashboard
│   ├── Settings.jsx  # Category/Tag management
│   ├── PostPage.jsx  # Individual post page
│   └── AuthPage.jsx  # Login page
├── services/          # API services
│   └── blogApi.js    # Blog CRUD operations
├── App.jsx           # Main app with routing
└── main.jsx          # Application entry point
```

## 🔧 Configuration

### Axios

The Axios instance is pre-configured with:

- Base URL pointing to JSONPlaceholder API (for demo)
- Request/Response interceptors for auth tokens
- Error handling for 401 responses

### TanStack Query

QueryClient is configured with:

- 60-second stale time
- Disabled refetch on window focus
- Ready for custom query options

### Tailwind CSS

- Full Tailwind CSS setup with PostCSS
- Configured for all JSX/TSX files
- Ready for customization in `tailwind.config.js`

## 🎯 Key Pages

### Public Pages

- **`/`** - Homepage displaying all published posts
- **`/post/:slug`** - Individual post with full content
- **`/login`** - Google OAuth authentication

### Protected Pages (Require Login)

- **`/dashboard`** - Admin panel to manage all posts
- **`/settings`** - Manage categories and tags

## 📝 Usage

### Creating a Post

1. Login with Google
2. Go to **Dashboard**
3. Click **New Post**
4. Fill in title, description, content
5. Add header image URL (optional)
6. Select category and tags
7. Check "Publish" to make it live
8. Click **Create Post**

### Managing Categories & Tags

1. Go to **Settings**
2. Use **Categories** tab to manage categories
3. Use **Tags** tab to manage tags
4. Create, edit, or delete as needed

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Complete database setup guide
- **[BLOG_SETUP_GUIDE.md](BLOG_SETUP_GUIDE.md)** - Detailed setup instructions
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Full feature list and technical details
- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Original project documentation

## 🎨 Customization

### Change Blog Name

Edit `src/components/Layout.jsx`:

```jsx
<span className="text-xl font-bold text-gray-900">Your Blog Name</span>
```

### Modify Colors

Edit `tailwind.config.js` to customize your color scheme.

### Add Features

The codebase is well-structured and documented, making it easy to add:

- Comments system
- Search functionality
- Image upload
- RSS feed
- Social sharing
- Analytics

## 🛠️ Tech Stack Details

### Frontend

- React 18 with Hooks
- Vite for blazing-fast development
- TanStack Query for server state management
- React Router for navigation
- Tailwind CSS for styling

### Backend

- Supabase PostgreSQL database
- Supabase Authentication (Google OAuth)
- Row Level Security policies
- Automatic timestamps and triggers

### Development

- ESLint for code quality
- Hot Module Replacement
- Environment variable support

## 📄 License

MIT

---

**Built with ❤️ using React and Supabase**
