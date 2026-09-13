import api from "./axios";

import type {
  Booking,
  BookingListResponse,
  CreateBookingPayload,
} from "../types/booking";

export interface GetBookingsParams {
  status?: string;

  vehicle?: string;

  date?: string;

  page?: number;

  limit?: number;

  sort?:
    | "created_at"
    | "departure_date"
    | "return_date"
    | "status"
    | "booking_reference";

  order?: "ASC" | "DESC";
}

/**
 * Logged-in Staff user's bookings.
 */
export const getMyBookings = async (
  params: GetBookingsParams = {},
): Promise<BookingListResponse> => {
  const response = await api.get("/bookings", {
    params,
  });

  return response.data.data;
};

/**
 * Get one booking.
 */
export const getBooking = async (id: string): Promise<Booking> => {
  const response = await api.get(`/bookings/${id}`);

  return response.data.data;
};

/**
 * Create booking.
 */
export const createBooking = async (
  payload: CreateBookingPayload,
): Promise<Booking> => {
  const response = await api.post("/bookings", payload);

  return response.data.data;
};

/**
 * Update booking.
 */
export const updateBooking = async (
  id: string,
  payload: CreateBookingPayload,
): Promise<Booking> => {
  const response = await api.put(`/bookings/${id}`, payload);

  return response.data.data;
};

/**
 * Delete booking.
 */
export const deleteBooking = async (id: string): Promise<void> => {
  await api.delete(`/bookings/${id}`);
};
