import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading, isAdmin } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always reset the button and navigate, even on error
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }
  };

  const authLinks = user
    ? [
        { path: "/", label: "Blog", icon: "home" },
        { path: "/resources", label: "Resources", icon: "resources" },
        ...(isAdmin
          ? [{ path: "/dashboard", label: "Dashboard", icon: "dashboard" }]
          : []),
      ]
    : [
        { path: "/", label: "Blog", icon: "home" },
        { path: "/resources", label: "Resources", icon: "resources" },
        { path: "/login", label: "Login", icon: "login" },
      ];

  const IconComponent = ({ name, className = "w-5 h-5" }) => {
    const icons = {
      home: (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      resources: (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      dashboard: (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z"
          />
        </svg>
      ),
      settings: (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      login: (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
      ),
    };
    return icons[name] || null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Modern Navigation */}
      <nav className="bg-navy-950 border-b border-navy-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 group"
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  Finance
                </span>
                <span className="text-sm font-bold text-white uppercase tracking-wider -mt-1">
                  Insights
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {authLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-all duration-200 border-b-2 pb-1 ${
                    location.pathname === link.path
                      ? "text-white border-white"
                      : "text-gray-300 border-transparent hover:text-white hover:border-gray-500"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* User Menu & Mobile Toggle */}
            <div className="flex items-center space-x-3">
              {/* User Info - Desktop */}
              {!loading && user && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-right">
                      <div className="font-semibold text-white">
                        {profile?.full_name || "User"}
                      </div>
                      {profile?.role === "admin" && (
                        <div className="text-xs text-gray-400">Admin</div>
                      )}
                    </div>
                    <div className="w-9 h-9 bg-white/10 text-white flex items-center justify-center rounded-full font-semibold text-sm border-2 border-white/20">
                      {profile?.full_name?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Logging out...</span>
                      </div>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded hover:bg-white/10 transition-all duration-200 text-white"
              >
                {mobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-navy-900 animate-fade-in">
              <div className="space-y-1">
                {authLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded font-medium transition-all duration-200 ${
                      location.pathname === link.path
                        ? "bg-white/10 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <IconComponent name={link.icon} />
                    <span>{link.label}</span>
                  </Link>
                ))}

                {/* User Section - Mobile */}
                {!loading && user && (
                  <div className="pt-4 mt-4 border-t border-navy-900">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded mb-2 border border-white/10">
                      <div className="w-10 h-10 bg-white/10 text-white flex items-center justify-center rounded-full font-semibold border-2 border-white/20">
                        {profile?.full_name?.charAt(0).toUpperCase() ||
                          user.email?.charAt(0).toUpperCase() ||
                          "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {profile?.full_name || "User"}
                        </div>
                        {profile?.role === "admin" && (
                          <div className="text-xs text-gray-400">Admin</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isLoggingOut}
                      className="w-full px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Modern Footer */}
      <footer className="bg-navy-950 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div>
              <div className="flex flex-col mb-4">
                <span className="text-lg font-bold uppercase tracking-wider">
                  Finance
                </span>
                <span className="text-lg font-bold uppercase tracking-wider -mt-1">
                  Insights
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted source for expert insights on finance, accounting,
                tax, and market trends, designed for professionals and students.
              </p>
              <div className="flex items-center space-x-3 mt-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-navy-800 hover:bg-navy-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-navy-800 hover:bg-navy-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-navy-800 hover:bg-navy-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3 className="font-bold mb-4 text-white">Explore</h3>
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
                {authLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/about"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Resources (Empty for now) */}
            <div>
              <h3 className="font-bold mb-4 text-white">Resources</h3>
              <div className="space-y-2">
                <Link
                  to="/resources"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Resources
                </Link>
                <Link
                  to="/"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Blog
                </Link>
              </div>
            </div>

            {/* Stay Updated */}
            <div>
              <h3 className="font-bold mb-4 text-white">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest finance and accounting insights delivered to your
                inbox.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="flex-1 px-4 py-2 bg-navy-900 border border-navy-800 rounded-l focus:outline-none focus:border-white/30 text-white placeholder-gray-500 text-sm"
                />
                <button className="px-6 py-2 bg-white text-navy-950 rounded-r font-semibold hover:bg-gray-100 transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-navy-900 text-center text-gray-400 text-sm">
            <p>
              © {new Date().getFullYear()} Finance Insights. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
