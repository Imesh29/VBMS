import * as dashboardService from "../services/dashboardService.js";

import { successResponse } from "../utils/response.js";

/**
 * Get dashboard statistics for the logged-in user
 * GET /api/dashboard/user
 */
export const getUserDashboard = async (req, res, next) => {
  try {
    const dashboard = await dashboardService.getUserDashboard(req.user.id);

    return successResponse(
      res,
      200,
      "User dashboard retrieved successfully.",
      dashboard,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard statistics for the Dean
 * GET /api/dashboard/dean
 */
export const getDeanDashboard = async (req, res, next) => {
  try {
    const dashboard = await dashboardService.getDeanDashboard();

    return successResponse(
      res,
      200,
      "Dean dashboard retrieved successfully.",
      dashboard,
    );
  } catch (error) {
    next(error);
  }
};
