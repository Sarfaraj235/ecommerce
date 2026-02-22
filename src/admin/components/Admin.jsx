import React from "react";
import {
  Avatar,
  Box,
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminDashboard from "./AdminDashboard";
import CreateProductForm from "./CreateProductForm";
import ProductsTable from "./ProductsTable";
import OrdersTable from "./OrdersTable";
import CustomersTable from "./Customers";
import { logout } from "../../state/auth/Action";

const menu = [
  { name: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { name: "Products", path: "/admin/products", icon: <InventoryIcon /> },
  { name: "Customers", path: "/admin/customers", icon: <PeopleIcon /> },
  { name: "Orders", path: "/admin/orders", icon: <ShoppingBagIcon /> },
  { name: "Add Product", path: "/admin/product/create", icon: <AddIcon /> },
];

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.name || user?.email?.split("@")?.[0] || "Admin";

  const roleLabel = String(user?.role || "ADMIN").toUpperCase().replace("ROLE_", "");
  const avatarLetter = String(user?.firstName || user?.name || user?.email || "A")
    .charAt(0)
    .toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const drawer = (
    <Box
      sx={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <List>
        {menu.map((item) => (
          <ListItem key={item.name} disablePadding onClick={() => navigate(item.path)}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/account/profile")}>
            <ListItemIcon>
              <Avatar sx={{ width: 30, height: 30, bgcolor: "#1d4ed8", fontSize: 14 }}>
                {avatarLetter}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={fullName}
              secondary={
                <Box sx={{ mt: 0.25 }}>
                  <Typography variant="caption" display="block" sx={{ lineHeight: 1.2 }}>
                    {roleLabel}
                  </Typography>
                  {user?.email && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ lineHeight: 1.2, whiteSpace: "normal", wordBreak: "break-all" }}
                    >
                      {user.email}
                    </Typography>
                  )}
                </Box>
              }
              secondaryTypographyProps={{ component: "div" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className="flex h-[100vh]">
      <CssBaseline />
      <div className="w-[15%] border border-r-gray-300 h-full fixed top-0">
        {drawer}
      </div>

      <div className="w-[85%] ml-[15%]">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="product/create" element={<CreateProductForm />} />
          <Route path="products" element={<ProductsTable />} />
          <Route path="orders" element={<OrdersTable />} />
          <Route path="customers" element={<CustomersTable />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;

