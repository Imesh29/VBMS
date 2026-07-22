import * as adminRepository from "../repositories/adminRepository.js";
import createError from "../utils/createError.js";

/**
 * Get all approved bookings
 */
export const getApprovedBookings = async () => {
  return await adminRepository.getApprovedBookings();
};
