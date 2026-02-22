import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Card,
  CardHeader,
  Alert,
} from "@mui/material";
import { adminApi } from "../services/adminApi";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    setError("");
    try {
      await adminApi.deleteProduct(productId);
      setProducts((prev) => prev.filter((item) => item.id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete product");
    }
  };

  return (
    <div className="p-5">
      <Card className="mt-2">
        <CardHeader title="All Products" />
        {error && <Alert severity="error" sx={{ mx: 2 }}>{error}</Alert>}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell align="left">Category</TableCell>
                <TableCell align="left">Price</TableCell>
                <TableCell align="left">Quantity</TableCell>
                <TableCell align="left">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">Loading...</TableCell>
                </TableRow>
              )}
              {!loading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No products found</TableCell>
                </TableRow>
              )}
              {products.map((item) => (
                <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell><Avatar src={item.imageUrl} /></TableCell>
                  <TableCell component="th" scope="row">{item.title}</TableCell>
                  <TableCell align="left">{item.category?.name || "-"}</TableCell>
                  <TableCell align="left">Rs {item.price}</TableCell>
                  <TableCell align="left">{item.quantity}</TableCell>
                  <TableCell align="left">
                    <Button variant="outlined" color="error" onClick={() => handleDeleteProduct(item.id)}>
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

export default ProductsTable;
