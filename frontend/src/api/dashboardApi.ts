import api from "./axios";

import type {
  AdminDashboardData,
  DeanDashboardData,
  UserDashboardData,
} from "../types/dashboard";

/**
 * Get dashboard data for a normal user.
 * GET /api/dashboard/user
 */
export const getUserDashboard = async (): Promise<UserDashboardData> => {
  const response = await api.get("/dashboard/user");

  return response.data.data;
};

/**
 * Get dashboard data for a Dean.
 * GET /api/dashboard/dean
 */
export const getDeanDashboard = async (): Promise<DeanDashboardData> => {
  const response = await api.get("/dashboard/dean");

  return response.data.data;
};

/**
 * Get dashboard data for an Admin.
 * GET /api/dashboard/admin
 */
export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
  const response = await api.get("/dashboard/admin");

  return response.data.data;
};
