import * as authRepository from "../repositories/authRepository.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  return error;
};

export const registerUser = async ({
  fullName,
  email,
  password,
  department,
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await authRepository.findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw createError("A user with this email already exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await authRepository.createUser({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: hashedPassword,

    // Public registration always creates a normal USER.
    role: "USER",

    department: department ? department.trim() : null,
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await authRepository.findUserByEmail(normalizedEmail);

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const passwordMatches = await comparePassword(password, user.password);

  if (!passwordMatches) {
    throw createError("Invalid email or password", 401);
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
  };
};

export const getUserProfile = async (userId) => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw createError("User not found", 404);
  }

  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    department: user.department,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

export const updateProfile = async (
  userId,
  { fullName, email, department, password },
) => {
  const existingUser = await authRepository.findUserById(userId);

  if (!existingUser) {
    throw createError("User not found", 404);
  }

  const fields = {};

  if (fullName !== undefined) {
    fields.full_name = fullName.trim();
  }

  if (email !== undefined) {
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail !== existingUser.email) {
      const emailOwner = await authRepository.findUserByEmail(normalizedEmail);

      if (emailOwner && emailOwner.id !== userId) {
        throw createError("A user with this email already exists", 409);
      }
    }

    fields.email = normalizedEmail;
  }

  if (department !== undefined) {
    fields.department = department ? department.trim() : null;
  }

  if (password) {
    fields.password = await hashPassword(password);
  }

  if (Object.keys(fields).length === 0) {
    return {
      id: existingUser.id,
      fullName: existingUser.full_name,
      email: existingUser.email,
      role: existingUser.role,
      department: existingUser.department,
    };
  }

  const updated = await authRepository.updateUser(userId, fields);

  return {
    id: updated.id,
    fullName: updated.full_name,
    email: updated.email,
    role: updated.role,
    department: updated.department,
  };
};

export const logoutUser = async () => {
  return {
    message: "Logout successful",
  };
};
