import api from "./axios";

import type {
  Vehicle,
  VehicleListResponse,
  VehiclePayload,
} from "../types/vehicle";

export interface GetVehiclesParams {
  search?: string;
  page?: number;
  limit?: number;
  sort?: "vehicle_number" | "vehicle_name" | "vehicle_type" | "status" | "created_at";
  order?: "ASC" | "DESC";
}

/**
 * Get all vehicles (Admin only).
 * Supports search, pagination and sorting.
 * GET /api/vehicles
 */
export const getVehicles = async (
  params?: GetVehiclesParams,
): Promise<VehicleListResponse> => {
  const response = await api.get("/vehicles", { params });
  return response.data.data;
};

/**
 * Get vehicles currently available for booking (any authenticated role).
 * GET /api/vehicles/available
 */
export const getAvailableVehicles = async (): Promise<Vehicle[]> => {
  const response = await api.get("/vehicles/available");
  return response.data.data;
};

/**
 * Get a single vehicle by id (Admin only).
 * GET /api/vehicles/:id
 */
export const getVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data.data;
};

/**
 * Create a new vehicle (Admin only).
 * POST /api/vehicles
 */
export const createVehicle = async (
  payload: VehiclePayload,
): Promise<Vehicle> => {
  const response = await api.post("/vehicles", payload);
  return response.data.data;
};

/**
 * Update an existing vehicle (Admin only).
 * PUT /api/vehicles/:id
 */
export const updateVehicle = async (
  id: string,
  payload: VehiclePayload,
): Promise<Vehicle> => {
  const response = await api.put(`/vehicles/${id}`, payload);
  return response.data.data;
};

/**
 * Delete a vehicle (Admin only).
 * DELETE /api/vehicles/:id
 */
export const deleteVehicle = async (id: string): Promise<void> => {
  await api.delete(`/vehicles/${id}`);
};
