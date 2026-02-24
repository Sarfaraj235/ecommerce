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

  getCustomers: async () => {
    const { data } = await api.get("/api/admin/users");
    return Array.isArray(data)
      ? data
      : Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data?.users)
          ? data.users
          : [];
  },

  updateCustomerRole: async (userId, role) => {
    const { data } = await api.put(`/api/admin/users/${userId}/role`, null, {
      params: { role },
    });
    return data;
  },

  deleteCustomer: async (userId) => {
    const { data } = await api.delete(`/api/admin/users/${userId}`);
    return data;
  },

  getDashboardOverview: async () => {
    const { data } = await api.get("/api/admin/dashboard/overview");
    return data || {};
  },
};
