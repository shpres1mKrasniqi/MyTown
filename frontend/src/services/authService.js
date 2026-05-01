import api from "../api/axios";

export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
