import * as deanRepository from "../repositories/deanRepository.js";
import * as notificationService from "./notificationService.js";
import createError from "../utils/createError.js";

export const getPendingBookings = async () => {
  return await deanRepository.getPendingBookings();
};

export const approveBooking = async (bookingId) => {
  const booking = await deanRepository.findBookingById(bookingId);

  if (!booking) {
    throw createError("Booking not found.", 404);
  }

  if (booking.status !== "PENDING") {
    throw createError(
      `Only pending bookings can be approved. Current status: ${booking.status}.`,
      409,
    );
  }

  const approvedBooking = await deanRepository.approveBooking(bookingId);

  try {
    await notificationService.createForUser({
      userId: booking.user_id,
      bookingId: booking.id,
      type: "BOOKING_APPROVED",
      title: "Booking approved by Dean",
      message: `Your booking ${booking.booking_reference} has been approved by the Dean and is waiting for Admin confirmation.`,
    });
  } catch (notificationError) {
    console.error("Approval notification delivery failed:", notificationError);
  }

  return approvedBooking;
};
