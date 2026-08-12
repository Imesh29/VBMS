import api from "./axios";

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
 * Get bookings for the logged-in user (USER role only).
 * Supports filtering, pagination and sorting.
 * GET /api/bookings
 */
export const getBookings = async (params?: GetBookingsParams) => {
  const response = await api.get("/bookings", { params });
  return response.data;
};

export const getBooking = async (id: number) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const createBooking = async (data: any) => {
  const response = await api.post("/bookings", data);
  return response.data;
};

export const updateBooking = async (id: number, data: any) => {
  const response = await api.put(`/bookings/${id}`, data);
  return response.data;
};

export const deleteBooking = async (id: number) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};
