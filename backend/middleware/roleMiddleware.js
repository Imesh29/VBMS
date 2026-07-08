import { errorResponse } from "../utils/response.js";

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, "Authentication is required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        "You do not have permission to access this resource",
      );
    }

    next();
  };
};

export default authorize;
