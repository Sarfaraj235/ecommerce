import React from "react";
import {
  Avatar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
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
import MenuIcon from "@mui/icons-material/Menu";
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
  const [mobileOpen, setMobileOpen] = React.useState(false);

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

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawerContent = (
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
          <ListItem key={item.name} disablePadding onClick={() => handleNavigate(item.path)}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigate("/account/profile")}>
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
    <div className="min-h-screen bg-gray-50">
      <CssBaseline />

      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-3 py-2 md:hidden">
        <div className="flex items-center gap-2">
          <IconButton onClick={() => setMobileOpen(true)} size="small" aria-label="open admin menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Admin Panel
          </Typography>
        </div>
        <Tooltip title={fullName}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: "#1d4ed8", fontSize: 14 }}>
            {avatarLetter}
          </Avatar>
        </Tooltip>
      </header>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: "block", lg: "none" }, "& .MuiDrawer-paper": { width: 280 } }}
      >
        {drawerContent}
      </Drawer>

      <div className="mx-auto flex w-full max-w-[1600px]">
        <aside className="hidden h-screen w-[280px] shrink-0 border-r border-gray-300 bg-white lg:block">
          {drawerContent}
        </aside>

        <main className="min-w-0 flex-1">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="product/create" element={<CreateProductForm />} />
            <Route path="products" element={<ProductsTable />} />
            <Route path="orders" element={<OrdersTable />} />
            <Route path="customers" element={<CustomersTable />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admin;
