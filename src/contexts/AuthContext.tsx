import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("access"));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refreshToken"));
  const navigate = useNavigate();

  const isAuthenticated = !!accessToken;

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000//api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      const data = await response.json();
      
      if (data.success) {
        setAccessToken(data.data.access);
        localStorage.setItem("access", data.access);
        return data.data.access;
      }
      return null;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  useEffect(() => {
    if (refreshToken) {
      const interval = setInterval(() => {
        refreshAccessToken();
      }, 4 * 60 * 1000); // Refresh every 4 minutes
      return () => clearInterval(interval);
    }
  }, [refreshToken]);

  const login = async (email: string, password: string) => {
    try {
      
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data) {
        setAccessToken(data.access);
        setRefreshToken(data.refresh);
        localStorage.setItem("access", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Account created successfully!");
        await login(email, password);
      } else {
        toast.error("Failed to create account");
      }
    } catch (error) {
      toast.error("An error occurred during signup");
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};