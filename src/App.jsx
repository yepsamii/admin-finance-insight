import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import PostPage from "./pages/PostPage";
import Resources from "./pages/Resources";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

// Create a client with proper error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1, // Only retry once instead of 3 times
      retryDelay: 1000, // Wait 1 second before retrying
      networkMode: "online", // Only fetch when online
      // Add timeout to prevent hanging queries
      gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime)
      // Add error handling
      onError: (error) => {
        console.error("Query error:", error);
      },
    },
    mutations: {
      retry: 0, // Don't retry mutations
      networkMode: "online",
      // Add error handling
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            fontSize: "14px",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <HelmetProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route
                    path="/"
                    element={<Blog />}
                  />
                  <Route
                    path="/post/:slug"
                    element={<PostPage />}
                  />
                  <Route
                    path="/resources"
                    element={<Resources />}
                  />
                  <Route
                    path="/login"
                    element={<AuthPage />}
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to="/"
                        replace
                      />
                    }
                  />
                </Routes>
              </Layout>
            </Router>
          </HelmetProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
