import * as userRepository from "../repositories/userRepository.js";
import { hashPassword } from "../utils/hash.js";
import createError from "../utils/createError.js";

/**
 * Get all users
 */
export const getAllUsers = async ({ search } = {}) => {
  const users = await userRepository.getAllUsers({
    search: search?.trim() || null,
  });

  return users.map((user) => ({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    department: user.department,
    is_active: user.is_active,
    bookings_count: Number(user.bookings_count ?? 0),
    created_at: user.created_at,
    updated_at: user.updated_at,
  }));
};

/**
 * Create a new user
 */
export const createUser = async ({
  fullName,
  email,
  password,
  role,
  department,
  isActive = true,
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await userRepository.findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw createError("A user with this email already exists.", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepository.createUser({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
    department: department ? department.trim() : null,
    isActive,
  });

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    department: user.department,
    is_active: user.is_active,
    bookings_count: 0,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

/**
 * Update existing user
 */
export const updateUser = async (
  userId,
  { fullName, email, role, department, isActive, password },
) => {
  const existingUser = await userRepository.findUserById(userId);

  if (!existingUser) {
    throw createError("User not found.", 404);
  }

  const fields = {};

  if (fullName !== undefined) {
    fields.full_name = fullName.trim();
  }

  if (email !== undefined) {
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail !== existingUser.email) {
      const emailOwner = await userRepository.findUserByEmail(normalizedEmail);

      if (emailOwner && emailOwner.id !== userId) {
        throw createError("A user with this email already exists.", 409);
      }
    }

    fields.email = normalizedEmail;
  }

  if (role !== undefined) {
    fields.role = role;
  }

  if (department !== undefined) {
    fields.department = department?.trim() || null;
  }

  if (isActive !== undefined) {
    fields.is_active = isActive;
  }

  if (password) {
    fields.password = await hashPassword(password);
  }

  if (Object.keys(fields).length === 0) {
    return {
      id: existingUser.id,
      full_name: existingUser.full_name,
      email: existingUser.email,
      role: existingUser.role,
      department: existingUser.department,
      is_active: existingUser.is_active,
      bookings_count: Number(existingUser.bookings_count ?? 0),
      created_at: existingUser.created_at,
      updated_at: existingUser.updated_at,
    };
  }

  const updatedUser = await userRepository.updateUser(userId, fields);

  return {
    id: updatedUser.id,
    full_name: updatedUser.full_name,
    email: updatedUser.email,
    role: updatedUser.role,
    department: updatedUser.department,
    is_active: updatedUser.is_active,
    bookings_count: Number(updatedUser.bookings_count ?? 0),
    created_at: updatedUser.created_at,
    updated_at: updatedUser.updated_at,
  };
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  const existingUser = await userRepository.findUserById(userId);

  if (!existingUser) {
    throw createError("User not found.", 404);
  }

  await userRepository.deleteUser(userId);

  return {
    message: "User deleted successfully.",
  };
};
