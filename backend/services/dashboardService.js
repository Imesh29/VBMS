import * as dashboardRepository from "../repositories/dashboardRepository.js";
import createError from "../utils/createError.js";

/**
 * Get dashboard statistics for the logged-in user
 */
export const getUserDashboard = async (userId) => {
  if (!userId) {
    throw createError("User ID is required.", 400);
  }

  return await dashboardRepository.getUserDashboard(userId);
};

/**
 * Get dashboard statistics for the Dean
 */
export const getDeanDashboard = async () => {
  return await dashboardRepository.getDeanDashboard();
};

/**
 * Get dashboard statistics for the Admin
 */
export const getAdminDashboard = async () => {
  return await dashboardRepository.getAdminDashboard();
};
