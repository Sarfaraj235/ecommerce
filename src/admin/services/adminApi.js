import { api } from "../../state/config/ApiConfig";

export const adminApi = {
  getProducts: async () => {
    const { data } = await api.get("/api/admin/products/all");
    return Array.isArray(data) ? data : [];
  },

  createProduct: async (payload) => {
    const { data } = await api.post("/api/admin/products/", payload);
    return data;
  },

  deleteProduct: async (productId) => {
    const { data } = await api.delete(`/api/admin/products/${productId}/delete`);
    return data;
  },

  getOrders: async () => {
    const { data } = await api.get("/api/admin/orders/");
    return Array.isArray(data) ? data : [];
  },

  updateOrderStatus: async (orderId, action) => {
    const { data } = await api.put(`/api/admin/orders/${orderId}/${action}`);
    return data;
  },

  deleteOrder: async (orderId) => {
    const { data } = await api.delete(`/api/admin/orders/${orderId}/delete`);
    return data;
  },
};

