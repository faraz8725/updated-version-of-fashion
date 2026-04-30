import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../services/authService.js";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("hf_token");
    const stored = localStorage.getItem("hf_user");
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("hf_user");
      }
      // Verify token is still valid
      getProfile()
        .then((profile) => {
          setUser(profile);
          localStorage.setItem("hf_user", JSON.stringify(profile));
        })
        .catch(() => {
          localStorage.removeItem("hf_token");
          localStorage.removeItem("hf_user");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const saveSession = ({ token, user: u }) => {
    localStorage.setItem("hf_token", token);
    localStorage.setItem("hf_user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("hf_token");
    localStorage.removeItem("hf_user");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, saveSession, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};
