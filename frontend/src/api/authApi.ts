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

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  department?: string;
}

/**
 * Register a new staff account.
 * Public registration always creates a USER (Staff/Lecturer) role.
 * Does not return a token — the user must sign in afterward.
 */
export const register = async (payload: RegisterRequest): Promise<AuthUser> => {
  const response = await api.post("/auth/register", payload);

  return response.data.data;
};

/**
 * Login user.
 */
export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", credentials);

  return response.data.data;
};

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  department?: string;
  password?: string;
}

/**
 * Get current user's profile.
 */
export const getProfile = async (): Promise<AuthUser> => {
  const response = await api.get("/auth/profile");

  return response.data.data;
};

/**
 * Update the logged-in user's own profile.
 */
export const updateProfile = async (
  payload: UpdateProfileRequest,
): Promise<AuthUser> => {
  const response = await api.put("/auth/profile", payload);

  return response.data.data;
};

/**
 * Logout user.
 */
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
