import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Card,
  CardHeader,
  Alert,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { adminApi } from "../services/adminApi";

const pickFirstName = (user) =>
  user?.firstName ||
  user?.firstname ||
  user?.first_name ||
  user?.name?.split(" ")?.[0] ||
  "";

const pickLastName = (user) =>
  user?.lastName ||
  user?.lastname ||
  user?.last_name ||
  user?.name?.split(" ")?.slice(1).join(" ") ||
  "";

const pickEmail = (user) => user?.email || user?.username || user?.login || "";

const pickId = (user) => user?.id || user?._id || user?.userId || "-";
const pickRole = (user) => String(user?.role || "USER").toUpperCase().replace("ROLE_", "");

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const rows = useMemo(
    () =>
      customers.map((user) => ({
        id: pickId(user),
        firstName: pickFirstName(user),
        lastName: pickLastName(user),
        email: pickEmail(user),
        role: pickRole(user),
        imageUrl: user?.imageUrl || user?.avatar || "",
      })),
    [customers]
  );

  const handleRoleChange = async (userId, role) => {
    setError("");
    try {
      const updated = await adminApi.updateCustomerRole(userId, role);
      setCustomers((prev) =>
        prev.map((item) => (String(pickId(item)) === String(userId) ? { ...item, ...updated } : item))
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    setError("");
    try {
      await adminApi.deleteCustomer(userId);
      setCustomers((prev) => prev.filter((item) => String(pickId(item)) !== String(userId)));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete user");
    }
  };

  return (
    <div className="p-5">
      <Card className="mt-2">
        <CardHeader title="All Customers" />
        {error && <Alert severity="error" sx={{ mx: 2 }}>{error}</Alert>}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="customer table">
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">User ID</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading...</TableCell>
                </TableRow>
              )}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">No customers found</TableCell>
                </TableRow>
              )}
              {rows.map((user) => (
                <TableRow key={String(user.id)} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>
                    <Avatar src={user.imageUrl} sx={{ bgcolor: "#9155FD" }}>
                      {(user.firstName || user.email || "U").charAt(0).toUpperCase()}
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.firstName || "-"}</TableCell>
                  <TableCell>{user.lastName || "-"}</TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell align="center">
                    <FormControl size="small" sx={{ minWidth: 110 }}>
                      <Select
                        value={user.role || "USER"}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <MenuItem value="USER">USER</MenuItem>
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">{user.id}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
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

export default Customers;
