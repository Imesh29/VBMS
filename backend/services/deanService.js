import * as deanRepository from "../repositories/deanRepository.js";
import createError from "../utils/createError.js";

/**
 * Get all pending bookings
 */
export const getPendingBookings = async () => {
  return await deanRepository.getPendingBookings();
};
