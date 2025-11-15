import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import type { AuthContextType, User } from "../types/types";

const API_BASE = import.meta.env.VITE_API_URL;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isBrowser = typeof window !== "undefined";

  const [user, setUser] = useState<User | null>(() => {
    if (!isBrowser) return null;
    const saved = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (!isBrowser) return;
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user, isBrowser]);

  const signin = async (email: string, password: string): Promise<User> => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    localStorage.setItem("token", res.data.token); 
    // localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    return res.data.user;
  };

  const signup = async (name: string, email: string, password: string): Promise<User> => {
    const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
    localStorage.setItem("token", res.data.token); 
    // localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    return res.data.user;
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
