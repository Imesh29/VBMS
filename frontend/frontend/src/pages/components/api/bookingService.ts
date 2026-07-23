import api from "./axios";

export const getBookings = async () => {
  const response = await api.get("/bookings");
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