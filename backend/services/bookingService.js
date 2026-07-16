import { v4 as uuidv4 } from "uuid";

import * as bookingRepository from "../repositories/bookingRepository.js";
import * as vehicleRepository from "../repositories/vehicleRepository.js";
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

  return await bookingRepository.createBooking(booking);
};
