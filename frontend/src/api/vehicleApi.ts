import api from "./axios";

export const getVehicles = async () => {
  const response = await api.get("/vehicles");
  return response.data;
};