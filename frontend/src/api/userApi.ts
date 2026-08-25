import api from "./axios";

import type {
  ManagedUser,
  CreateUserPayload,
  UpdateUserPayload,
} from "../types/user";

/**
 * Get all users (Admin only). Supports ?search=
 */
export const getUsers = async (search?: string): Promise<ManagedUser[]> => {
  const response = await api.get("/users", { params: { search } });
  return response.data.data;
};

/**
 * Create a new user (Admin only).
 */
export const createUser = async (
  payload: CreateUserPayload,
): Promise<ManagedUser> => {
  const response = await api.post("/users", payload);
  return response.data.data;
};

/**
 * Update an existing user (Admin only).
 */
export const updateUser = async (
  id: string,
  payload: UpdateUserPayload,
): Promise<ManagedUser> => {
  const response = await api.put(`/users/${id}`, payload);
  return response.data.data;
};

/**
 * Delete a user (Admin only).
 */
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
