# React Boilerplate

A modern React boilerplate with all the essential tools and libraries pre-configured for building scalable web applications.

## 🚀 Technologies

- **React** - JavaScript library for building user interfaces
- **Vite** - Next generation frontend tooling for fast development
- **React Router DOM** - Declarative routing for React applications
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Axios** - Promise-based HTTP client with interceptors
- **TanStack Query** - Powerful data synchronization for React
- **React Helmet Async** - Document head management for React

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd react-boilerplate

# Install dependencies
npm install

# Start development server
npm run dev
```

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
├── pages/              # Page components
│   ├── Home.jsx       # Landing page
│   ├── About.jsx      # About page with React Helmet example
│   └── Users.jsx      # Users list with API integration
├── services/          # API and external services
│   └── api.js        # Axios instance with interceptors
├── App.jsx           # Main app component with providers
├── main.jsx          # Application entry point
└── index.css         # Tailwind CSS directives
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

## 🎯 Features

- ⚡ Lightning fast HMR with Vite
- 🔀 Client-side routing with React Router
- 🎨 Utility-first styling with Tailwind CSS
- 📡 API integration with Axios interceptors
- 🔄 Efficient data fetching with TanStack Query
- 🔍 SEO optimization with React Helmet
- 📱 Responsive design out of the box
- 🏗️ Production-ready build configuration

## 📝 Example Pages

### Home Page (`/`)
- Overview of included technologies
- Navigation to other pages
- Responsive grid layout

### About Page (`/about`)
- Demonstrates React Helmet for SEO
- Features list with checkmarks
- Getting started instructions

### Users Page (`/users`)
- TanStack Query integration
- Axios API calls to JSONPlaceholder
- Loading and error states
- Responsive user cards grid

## 🚦 Getting Started

1. **Modify API Base URL**: Update the base URL in `src/services/api.js` to point to your backend API

2. **Add Your Pages**: Create new page components in `src/pages/` and add routes in `App.jsx`

3. **Customize Styles**: Modify Tailwind configuration in `tailwind.config.js` for your brand colors and design system

4. **Set Up Authentication**: The axios interceptor is ready for JWT tokens - just implement your auth logic

5. **Add Environment Variables**: Create a `.env` file for your API endpoints and configuration

## 🤝 Contributing

Feel free to submit issues and pull requests.

## 📄 License

MIT