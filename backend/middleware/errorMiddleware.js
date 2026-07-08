import { errorResponse } from "../utils/response.js";

export const notFoundHandler = (req, res) => {
  return errorResponse(
    res,
    404,
    `Route not found: ${req.method} ${req.originalUrl}`,
  );
};

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error.code === "23505") {
    return errorResponse(res, 409, "A record with this value already exists");
  }

  if (error.code === "22P02") {
    return errorResponse(res, 400, "Invalid data format");
  }

  const statusCode = error.statusCode || 500;

  const message = statusCode === 500 ? "Internal server error" : error.message;

  return errorResponse(res, statusCode, message);
};
