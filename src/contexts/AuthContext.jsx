import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase, withTimeout } from "../lib/supabase";

const AuthContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchingProfile = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let isActive = true;

    // Check active session with timeout
    const initAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await withTimeout(
          supabase.auth.getSession(),
          10000 // 10 second timeout
        );

        if (!isActive || !mounted.current) return;

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError);
          setLoading(false);
          return;
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (isActive && mounted.current) {
          setError(err);
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isActive || !mounted.current) return;

      console.log("Auth state changed:", event);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setError(null);
        setLoading(false);
      }
    });

    return () => {
      isActive = false;
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    // Prevent concurrent profile fetches
    if (fetchingProfile.current) {
      console.log("Profile fetch already in progress, skipping...");
      return;
    }

    fetchingProfile.current = true;

    try {
      const profilePromise = supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      const { data, error: profileError } = await withTimeout(
        profilePromise,
        10000
      );

      if (!mounted.current) return;

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
        // Don't throw error if profile doesn't exist yet - might be a new user
        if (profileError.code === "PGRST116") {
          console.log("Profile not found - might be a new user");
          setProfile(null);
        } else {
          setError(profileError);
          setProfile(null);
        }
      } else {
        setProfile(data);
        setError(null);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      if (mounted.current) {
        setError(err);
        setProfile(null);
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
        fetchingProfile.current = false;
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const { data, error } = await withTimeout(
        supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}`,
            skipBrowserRedirect: false,
          },
        }),
        10000
      );
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      setError(error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      // Clear state immediately for responsive UI
      setUser(null);
      setProfile(null);
      setError(null);

      // Try to sign out from Supabase (with timeout)
      try {
        await withTimeout(supabase.auth.signOut(), 3000);
      } catch (err) {
        console.error("Signout timeout:", err);
        // Ignore timeout errors, state is already cleared
      }

      return { error: null };
    } catch (error) {
      console.error("Error signing out:", error);
      // Ensure state is cleared even on error
      setUser(null);
      setProfile(null);
      setError(null);
      return { error };
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      const updatePromise = supabase
        .from("users")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      const { data, error } = await withTimeout(updatePromise, 10000);

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error("Update profile error:", error);
      setError(error);
      return { data: null, error };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signInWithGoogle,
    signOut,
    updateProfile,
    clearError,
    isAdmin: profile?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
