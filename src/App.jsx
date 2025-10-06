import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Users from "./pages/Users";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <HelmetProvider>
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/login"
                element={<AuthPage />}
              />
              <Route
                path="/about"
                element={<About />}
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              {/* Catch all - redirect to home */}
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
  );
};

export default App;
