import { verifyToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

const authenticate = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return errorResponse(res, 401, "Authentication token is required");
    }

    const parts = authorizationHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
      return errorResponse(res, 401, "Invalid authorization format");
    }

    const token = parts[1];

    const decodedUser = verifyToken(token);

    req.user = decodedUser;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, 401, "Authentication token has expired");
    }

    return errorResponse(res, 401, "Invalid authentication token");
  }
};

export default authenticate;
