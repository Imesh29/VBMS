import * as deanRepository from "../repositories/deanRepository.js";
import createError from "../utils/createError.js";

/**
 * Get all pending bookings
 */
export const getPendingBookings = async () => {
  return await deanRepository.getPendingBookings();
};

/**
 * Approve a booking
 */
export const approveBooking = async (bookingId) => {
  // Check booking exists
  const booking = await deanRepository.findBookingById(bookingId);

  if (!booking) {
    throw createError("Booking not found.", 404);
  }

  // Only pending bookings can be approved
  if (booking.status !== "PENDING") {
    throw createError(
      `Only pending bookings can be approved. Current status: ${booking.status}.`,
      409,
    );
  }

  // Approve booking
  const approvedBooking = await deanRepository.approveBooking(bookingId);

  return approvedBooking;
};
