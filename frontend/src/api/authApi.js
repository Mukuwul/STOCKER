import apiClient from "./config";

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (name, email, password, role = "customer") => {
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },
};
