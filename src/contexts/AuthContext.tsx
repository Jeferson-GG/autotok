import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("autotok_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple mock validation (accept any email with password 'password')
    // In a real local app, we could store a hashed password in localStorage
    if (password === "password" || password === "123456") {
      const newUser = { id: "1", email };
      localStorage.setItem("autotok_user", JSON.stringify(newUser));
      setUser(newUser);
      toast.success("Login realizado com sucesso!");
    } else {
      toast.error("Senha inválida.");
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("autotok_user");
    setUser(null);
    toast.success("Logout realizado.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
