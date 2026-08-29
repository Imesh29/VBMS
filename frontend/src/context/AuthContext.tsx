import { createContext, useContext, useState, type ReactNode } from "react";

import {
  login as loginApi,
  logout as logoutApi,
  updateProfile as updateProfileApi,
  type AuthUser,
  type UpdateProfileRequest,
} from "../api/authApi";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<AuthUser>;

  logout: () => Promise<void>;

  updateProfile: (payload: UpdateProfileRequest) => Promise<AuthUser>;

  clearSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  /*
   * We are not making an API request during startup.
   * Authentication is restored directly from localStorage.
   */
  const isLoading = false;

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const result = await loginApi({
      email,
      password,
    });

    localStorage.setItem("token", result.token);

    localStorage.setItem("user", JSON.stringify(result.user));

    setToken(result.token);
    setUser(result.user);

    return result.user;
  };

  const logout = async () => {
    try {
      if (token) {
        await logoutApi();
      }
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      clearSession();
    }
  };

  const updateProfile = async (
    payload: UpdateProfileRequest,
  ): Promise<AuthUser> => {
    const updated = await updateProfileApi(payload);

    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);

    return updated;
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        logout,
        updateProfile,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
