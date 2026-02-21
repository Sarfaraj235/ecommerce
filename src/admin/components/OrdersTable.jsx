import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import { adminApi } from "../services/adminApi";

const statusActions = [
  { label: "Confirm", action: "confirmed" },
  { label: "Ship", action: "ship" },
  { label: "Deliver", action: "deliver" },
  { label: "Cancel", action: "cancel" },
];

const statusColor = (status = "") => {
  const normalized = String(status).toUpperCase();
  if (normalized === "DELIVERED") return "bg-green-500";
  if (normalized === "CANCELLED") return "bg-red-500";
  if (normalized === "SHIPPED") return "bg-indigo-500";
  return "bg-blue-500";
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId, action) => {
    setError("");
    try {
      const updated = await adminApi.updateOrderStatus(orderId, action);
      setOrders((prev) => prev.map((item) => (item.id === orderId ? updated : item)));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update order");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setError("");
    try {
      await adminApi.deleteOrder(orderId);
      setOrders((prev) => prev.filter((item) => item.id !== orderId));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete order");
    }
  };

  return (
    <div className="p-4 sm:p-5 md:p-6">
      <Card className="mt-2">
        <CardHeader title="Recent Orders" />
        {error && <Alert severity="error" sx={{ mx: 2 }}>{error}</Alert>}
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell align="left">Price</TableCell>
                <TableCell align="left">Items</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Update</TableCell>
                <TableCell align="left">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">Loading...</TableCell>
                </TableRow>
              )}
              {!loading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No orders found</TableCell>
                </TableRow>
              )}
              {orders.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.orderId || item.id}</TableCell>
                  <TableCell align="left">Rs {item.totalPrice}</TableCell>
                  <TableCell align="left">{item.totalItem}</TableCell>
                  <TableCell align="left">
                    <span className={`px-4 py-1 rounded-full text-white ${statusColor(item.orderStatus || item.status)}`}>
                      {item.orderStatus || item.status}
                    </span>
                  </TableCell>
                  <TableCell align="left">
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {statusActions.map((statusAction) => (
                        <Button
                          key={statusAction.action}
                          size="small"
                          variant="text"
                          onClick={() => handleStatusUpdate(item.id, statusAction.action)}
                        >
                          {statusAction.label}
                        </Button>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell align="left">
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteOrder(item.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

export default OrdersTable;
