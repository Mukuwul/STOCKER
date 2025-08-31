import apiClient from "./config";

export const orderApi = {
  placeOrder: async (products) => {
    const response = await apiClient.post("/orders", { products });
    return response.data;
  },

  getMyOrders: async () => {
    const response = await apiClient.get("/orders/my-orders");
    return response.data;
  },

  getAllOrders: async () => {
    const response = await apiClient.get("/orders/all");
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await apiClient.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};
