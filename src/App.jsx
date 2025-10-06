import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <About />
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
