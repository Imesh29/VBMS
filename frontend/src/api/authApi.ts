import api from "./axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "DEAN" | "ADMIN";
  department?: string | null;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

/**
 * Login user.
 */
export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", credentials);

  return response.data.data;
};

/**
 * Get current user's profile.
 */
export const getProfile = async (): Promise<AuthUser> => {
  const response = await api.get("/auth/profile");

  return response.data.data;
};

/**
 * Logout user.
 */
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
