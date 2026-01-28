import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../../types/User";
import { api, extractAxiosErrorMessage, LoginInput } from "../api/utils";

type AuthContextType = {
  user: User | null;
  initialFetchLoading: boolean;
  authLoading: boolean;
  error: string | null;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialFetchLoading, setInitialFetchLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setInitialFetchLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (input: LoginInput) => {
    setAuthLoading(true);
    setError(null);

    try {
      const res = await api.post("/api/auth/login", input);
      const user = res.data.user;
      setUser(user);
      return user;
    } catch (err) {
      const message = extractAxiosErrorMessage(err);
      setError(message || "Login failed.");
      throw err; // allow component-level handling if needed
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await api.post("/api/auth/logout");
      setUser(null);
    } catch (err) {
      console.error(err);
      const message = extractAxiosErrorMessage(err);
      setError(message || "Error logging out");
    }
    setAuthLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initialFetchLoading,
        authLoading,
        error,
        login,
        logout,
      }}
    >
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
