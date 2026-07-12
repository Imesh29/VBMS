import { validationResult } from "express-validator";
import * as authService from "../services/authService.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return errorResponse(
        res,
        400,
        "Validation failed",
        validationErrors.array(),
      );
    }

    const { fullName, email, password, department } = req.body;

    const user = await authService.registerUser({
      fullName,
      email,
      password,
      department,
    });

    return successResponse(res, 201, "User registered successfully", user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return errorResponse(
        res,
        400,
        "Validation failed",
        validationErrors.array(),
      );
    }

    const { email, password } = req.body;

    const result = await authService.loginUser({
      email,
      password,
    });

    return successResponse(res, 200, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await authService.getUserProfile(req.user.id);

    return successResponse(res, 200, "Profile retrieved successfully", profile);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
