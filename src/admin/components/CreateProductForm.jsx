import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Alert } from '@mui/material';
import { adminApi } from '../services/adminApi';

const CreateProductForm = () => {
    const [productData, setProductData] = useState({
        title: "",
        description: "",
        brand: "",
        color: "",
        imageUrl: "",
        price: "",
        discountedPrice: "",
        discountPercent: "",
        quantity: "",
        topLevelCategory: "",
        secondLevelCategory: "",
        thirdLevelCategory: "",
        sizeCsv: "M,L,XL",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevState) => {
            const next = { ...prevState, [name]: value };

            if (name === "price" || name === "discountedPrice") {
                const price = Number(next.price);
                const discounted = Number(next.discountedPrice);

                if (Number.isFinite(price) && price > 0 && Number.isFinite(discounted)) {
                    const raw = ((price - discounted) / price) * 100;
                    const clamped = Math.max(0, Math.min(100, raw));
                    next.discountPercent = String(Math.round(clamped));
                } else {
                    next.discountPercent = "";
                }
            }

            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const toSafeNumber = (value, fallback = 0) => {
                const parsed = Number(value);
                return Number.isFinite(parsed) ? parsed : fallback;
            };

            const sizes = productData.sizeCsv
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((name) => ({ name, quantity: 0 }));

            const payload = {
                title: productData.title.trim(),
                description: productData.description.trim(),
                brand: productData.brand.trim(),
                color: productData.color.trim(),
                imageUrl: productData.imageUrl.trim(),
                price: toSafeNumber(productData.price, 0),
                discountedPrice: toSafeNumber(productData.discountedPrice, 0),
                discountPercent: toSafeNumber(productData.discountPercent, 0),
                quantity: toSafeNumber(productData.quantity, 0),
                topLevelCategory: productData.topLevelCategory.trim(),
                secondLevelCategory: productData.secondLevelCategory.trim(),
                thirdLevelCategory: productData.thirdLevelCategory.trim(),
                size: sizes,
            };

            await adminApi.createProduct(payload);
            setSuccess("Product created successfully.");
            setProductData({
                title: "",
                description: "",
                brand: "",
                color: "",
                imageUrl: "",
                price: "",
                discountedPrice: "",
                discountPercent: "",
                quantity: "",
                topLevelCategory: "",
                secondLevelCategory: "",
                thirdLevelCategory: "",
                sizeCsv: "M,L,XL",
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-4 sm:p-6 md:p-8 lg:p-10'>
            <Typography variant='h4' sx={{ textAlign: "center", pb: { xs: 3, md: 6 }, fontSize: { xs: "1.9rem", md: "2.125rem" } }} className='text-gray-700'>Add New Product</Typography>
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Image URL" name="imageUrl" value={productData.imageUrl} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Title" name="title" value={productData.title} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Top Category (e.g. men)" name="topLevelCategory" value={productData.topLevelCategory} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Second Category (e.g. clothing)" name="secondLevelCategory" value={productData.secondLevelCategory} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Third Category (e.g. mens_kurta)" name="thirdLevelCategory" value={productData.thirdLevelCategory} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Brand" name="brand" value={productData.brand} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Price" name="price" type="number" value={productData.price} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Discounted Price" name="discountedPrice" type="number" value={productData.discountedPrice} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Discount Percent (Auto)" name="discountPercent" type="number" value={productData.discountPercent} InputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Quantity" name="quantity" type="number" value={productData.quantity} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Color" name="color" value={productData.color} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Sizes (comma separated)" name="sizeCsv" value={productData.sizeCsv} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Description" name="description" multiline rows={4} value={productData.description} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12}>
                        <Button disabled={loading} variant='contained' size='large' sx={{ p: 1.8 }} className='bg-[#9155FD]' type='submit' fullWidth>
                            {loading ? "Saving..." : "Add Product"}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default CreateProductForm;
