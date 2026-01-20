import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../../types/User";
import axios from "axios";
import { api } from "../api/utils";

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/api/auth/me");
        console.log("fetch me response:", response);
        setUser(response.data);
      } catch (err) {
        console.error("fetch me error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const logout = async () => {
    await api.post("api/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within Auth provider");
  }
  return ctx;
};
