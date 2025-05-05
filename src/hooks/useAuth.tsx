// hooks/useAuth.tsx
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/lib/api";

type AuthContextType = {
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        api.auth.login(),
        `username=${username}&password=${password}`,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      
      localStorage.setItem("token", response.data.access_token);
      setToken(response.data.access_token);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(api.auth.register(), {
        username,
        email,
        password
      });

      if (response.status === 200) {
        // Automatically log in after successful registration
        return await login(username, password);
      }
      return false;
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error(
        axios.isAxiosError(error) 
          ? error.response?.data?.detail || "Registration failed"
          : "Registration failed"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);