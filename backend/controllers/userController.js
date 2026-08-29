import { validationResult } from "express-validator";

import * as userService from "../services/userService.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * GET /api/users
 * List all users (Admin only). Supports ?search=
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;

    const users = await userService.getAllUsers({ search });

    return successResponse(res, 200, "Users retrieved successfully.", users);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users
 * Create a new user (Admin only).
 */
export const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed.", errors.array());
    }

    const { fullName, email, password, role, department, isActive } = req.body;

    const user = await userService.createUser({
      fullName,
      email,
      password,
      role,
      department,
      isActive,
    });

    return successResponse(res, 201, "User created successfully.", user);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Update an existing user (Admin only).
 */
export const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed.", errors.array());
    }

    const { id } = req.params;
    const { fullName, email, role, department, isActive, password } = req.body;

    const user = await userService.updateUser(id, {
      fullName,
      email,
      role,
      department,
      isActive,
      password,
    });

    return successResponse(res, 200, "User updated successfully.", user);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Delete a user (Admin only).
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await userService.deleteUser(id);

    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};
