import { v4 as uuidv4 } from "uuid";

import * as bookingRepository from "../repositories/bookingRepository.js";
import * as vehicleRepository from "../repositories/vehicleRepository.js";
import * as userRepository from "../repositories/userRepository.js";
import * as notificationService from "./notificationService.js";
import * as emailService from "./emailService.js";
import createError from "../utils/createError.js";

// Generate booking reference

const generateBookingReference = () => {
  return `BK-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;
};

/**
 * Create Booking
 */
export const createBooking = async (userId, bookingData) => {
  // Check vehicle exists
  const vehicle = await vehicleRepository.findVehicleById(
    bookingData.vehicleId,
  );

  if (!vehicle) {
    throw createError("Vehicle not found.", 404);
  }

  const conflictingBookings = await bookingRepository.findConflictingBookings(
    bookingData.vehicleId,
    bookingData.departureDate,
    bookingData.returnDate,
  );

  if (conflictingBookings.length > 0) {
    throw createError(
      "This vehicle is already booked for the selected date and time.",
      409,
    );
  }

  // Check vehicle availability
  if (vehicle.status !== "AVAILABLE") {
    throw createError("Vehicle is not available for booking.", 409);
  }

  // Validate dates
  const departureDate = new Date(bookingData.departureDate);
  const returnDate = new Date(bookingData.returnDate);

  if (departureDate >= returnDate) {
    throw createError("Return date must be later than departure date.", 400);
  }

  const booking = {
    bookingReference: generateBookingReference(),
    userId,
    vehicleId: bookingData.vehicleId,
    purpose: bookingData.purpose,
    destination: bookingData.destination,
    departureDate: bookingData.departureDate,
    returnDate: bookingData.returnDate,
    passengerCount: bookingData.passengerCount,
    remarks: bookingData.remarks || null,
    status: "PENDING",
  };

  const createdBooking = await bookingRepository.createBooking(booking);

  // Notification delivery should not make a valid booking fail.
  try {
    const requester = await userRepository.findUserById(userId);
    const deans = await userRepository.findActiveUsersByRole("DEAN");

    await notificationService.createForUser({
      userId,
      bookingId: createdBooking.id,
      type: "BOOKING_CREATED",
      title: "Booking request submitted",
      message: `Your booking ${createdBooking.booking_reference} was submitted and is waiting for Dean approval.`,
    });

    if (deans.length > 0) {
      await notificationService.createForUsers({
        userIds: deans.map((dean) => dean.id),
        bookingId: createdBooking.id,
        type: "BOOKING_PENDING_DEAN",
        title: "New booking request",
        message: `${requester?.full_name || "A staff member"} submitted booking ${createdBooking.booking_reference} for ${createdBooking.destination}.`,
      });

      await Promise.allSettled(
        deans.map((dean) =>
          emailService.sendNewBookingToDean({
            dean,
            requester,
            booking: createdBooking,
            vehicle,
          }),
        ),
      );
    }
  } catch (notificationError) {
    console.error("Booking notification/email delivery failed:", notificationError);
  }

  return createdBooking;
};

/**
 * Get Booking By Id
 */
export const getBookingById = async (bookingId, userId) => {
  const booking = await bookingRepository.findBookingById(bookingId);

  if (!booking) {
    throw createError("Booking not found.", 404);
  }

  // User can only view own booking
  if (booking.user_id !== userId) {
    throw createError("You are not authorized to access this booking.", 403);
  }

  return booking;
};

/**
 * Get bookings of the logged-in user with filtering,
 * pagination and sorting.
 */
export const getMyBookings = async (userId, filters = {}) => {
  if (!userId) {
    throw createError(400, "User ID is required.");
  }

  const {
    status,
    vehicle,
    date,
    page = 1,
    limit = 10,
    sort = "created_at",
    order = "DESC",
  } = filters;

  return await bookingRepository.findBookingsByUser(userId, {
    status,
    vehicle,
    date,
    page: Number(page),
    limit: Number(limit),
    sort,
    order,
  });
};

/**
 * Get all bookings with filtering,
 * pagination and sorting.
 */
export const getAllBookings = async (filters = {}) => {
  const {
    status,
    vehicle,
    date,
    page = 1,
    limit = 10,
    sort = "created_at",
    order = "DESC",
  } = filters;

  return await bookingRepository.findAllBookings({
    status,
    vehicle,
    date,
    page: Number(page),
    limit: Number(limit),
    sort,
    order,
  });
};

/**
 * Update Booking
 */
export const updateBooking = async (bookingId, userId, bookingData) => {
  const booking = await bookingRepository.findBookingById(bookingId);

  if (!booking) {
    throw createError("Booking not found.", 404);
  }

  if (booking.user_id !== userId) {
    throw createError("You are not authorized to update this booking.", 403);
  }

  if (booking.status !== "PENDING") {
    throw createError("Only pending bookings can be updated.", 409);
  }

  const vehicle = await vehicleRepository.findVehicleById(
    bookingData.vehicleId,
  );

  if (!vehicle) {
    throw createError("Vehicle not found.", 404);
  }

  const conflictingBookings = await bookingRepository.findConflictingBookings(
    bookingData.vehicleId,
    bookingData.departureDate,
    bookingData.returnDate,
    bookingId,
  );

  if (conflictingBookings.length > 0) {
    throw createError(
      "This vehicle is already booked for the selected date and time.",
      409,
    );
  }

  if (vehicle.status !== "AVAILABLE") {
    throw createError("Vehicle is not available.", 409);
  }

  const departureDate = new Date(bookingData.departureDate);
  const returnDate = new Date(bookingData.returnDate);

  if (departureDate >= returnDate) {
    throw createError("Return date must be later than departure date.", 400);
  }

  const updatedBooking = await bookingRepository.updateBooking(bookingId, bookingData);

  // Protect against a race where the Dean approves the request while
  // the staff member is submitting an edit. The repository only updates
  // rows that are still PENDING.
  if (!updatedBooking) {
    throw createError(
      "This booking is no longer pending and cannot be updated.",
      409,
    );
  }

  return updatedBooking;
};

/**
 * Delete Booking
 */
export const deleteBooking = async (bookingId, userId) => {
  const booking = await bookingRepository.findBookingById(bookingId);

  if (!booking) {
    throw createError("Booking not found.", 404);
  }

  if (booking.user_id !== userId) {
    throw createError("You are not authorized to delete this booking.", 403);
  }

  if (booking.status !== "PENDING") {
    throw createError("Only pending bookings can be deleted.", 409);
  }

  await bookingRepository.deleteBooking(bookingId);

  return {
    message: "Booking deleted successfully.",
  };
};
