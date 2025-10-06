import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      // Navigate immediately after signout
      navigate("/");
      localStorage.clear();
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const authLinks = user
    ? [
        { path: "/", label: "Home" },
        { path: "/dashboard", label: "Dashboard" },
      ]
    : [
        { path: "/", label: "Home" },
        { path: "/about", label: "About" },
        { path: "/login", label: "Login" },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center font-bold">
                  R
                </div>
                <span className="text-xl font-bold text-gray-900">
                  React Boilerplate
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              {/* Navigation Links */}
              <div className="flex space-x-1">
                {authLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 transition-colors rounded ${
                      location.pathname === link.path
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* User Menu */}
              {!loading && user && (
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  {/* User Info */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full font-medium text-sm">
                      {profile?.full_name?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    <div className="hidden sm:block text-sm">
                      <div className="font-medium text-gray-900">
                        {profile?.full_name || "User"}
                      </div>
                      {profile?.role === "admin" && (
                        <div className="text-xs text-blue-600">Admin</div>
                      )}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="mt-auto py-8 px-4 text-center text-gray-600">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm">Built with React & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
