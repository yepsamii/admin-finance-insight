import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { signUp, signIn, signInWithGoogle } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleEmailAuth = async () => {
    // Validation
    if (!formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill in all fields!" });
      return;
    }

    if (isSignUp) {
      if (!formData.fullName) {
        setMessage({ type: "error", text: "Please enter your full name!" });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match!" });
        return;
      }

      if (formData.password.length < 6) {
        setMessage({
          type: "error",
          text: "Password must be at least 6 characters!",
        });
        return;
      }
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (isSignUp) {
        // Sign Up
        const { data, error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName
        );
        console.log("sign up ------>>", data);
        if (error) throw error;

        setMessage({
          type: "success",
          text: "Sign up successful! Redirecting to dashboard...",
        });

        // Redirect to dashboard after 1 second
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        // Sign In
        const { data, error } = await signIn(formData.email, formData.password);
        console.log("sign in ------>>", data);

        if (error) throw error;

        setMessage({
          type: "success",
          text: "Sign in successful! Redirecting...",
        });

        // Redirect to dashboard after 1 second
        setTimeout(() => navigate("/dashboard"), 1000);
      }

      // Clear form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { error } = await signInWithGoogle();

      if (error) throw error;

      // Google OAuth will redirect automatically
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      console.error("Google auth error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? "Sign up to get started" : "Sign in to your account"}
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === "error"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? "Loading..." : "Continue with Google"}
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="space-y-4">
          {isSignUp && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          {isSignUp && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>
          )}

          {!isSignUp && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                Forgot password?
              </button>
            </div>
          )}

          <button
            onClick={handleEmailAuth}
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage({ type: "", text: "" });
              setFormData({
                email: "",
                password: "",
                confirmPassword: "",
                fullName: "",
              });
            }}
            disabled={loading}
            className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
