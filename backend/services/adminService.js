import * as adminRepository from "../repositories/adminRepository.js";
import createError from "../utils/createError.js";

/**
 * Get all approved bookings
 */
export const getApprovedBookings = async () => {
  return await adminRepository.getApprovedBookings();
};

/**
 * Confirm a booking
 */
export const confirmBooking = async (bookingId) => {
  // Check booking exists
  const booking = await adminRepository.findBookingById(bookingId);

  if (!booking) {
    throw createError("Booking not found.", 404);
  }

  // Only approved bookings can be confirmed
  if (booking.status !== "APPROVED") {
    throw createError(
      `Only approved bookings can be confirmed. Current status: ${booking.status}.`,
      409,
    );
  }

  return await adminRepository.confirmBooking(bookingId);
};
