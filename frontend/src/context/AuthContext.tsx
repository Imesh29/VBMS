import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getProfile,
  login as loginApi,
  logout as logoutApi,
  type AuthUser,
} from "../api/authApi";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<AuthUser>;

  logout: () => Promise<void>;
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

  const [isLoading, setIsLoading] = useState(true);

  /**
   * Restore authentication when application starts.
   */
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfile();

        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Login.
   */
  const login = async (email: string, password: string) => {
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

  /**
   * Logout.
   */
  const logout = async () => {
    try {
      if (token) {
        await logoutApi();
      }
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);
    }
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Authentication hook.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
