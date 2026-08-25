export type UserRole = "USER" | "DEAN" | "ADMIN";

/**
 * Row shape returned by GET /api/users (Admin only).
 */
export interface ManagedUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  department: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  bookings_count: number;
}

export interface UserStats {
  staff: number;
  deans: number;
  admins: number;
}

/**
 * Payload shape for POST /api/users.
 */
export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  isActive: boolean;
}

/**
 * Payload shape for PUT /api/users/:id.
 * All fields optional — only send what changed.
 */
export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  role?: UserRole;
  department?: string;
  isActive?: boolean;
  password?: string;
}
