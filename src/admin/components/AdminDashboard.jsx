import React from 'react';
import { Grid, Card, CardHeader, Typography, Box } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';

// Mock data for the sales chart
const data = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
];

const AdminDashboard = () => {
    return (
        <div className='p-10'>
            <Typography variant='h4' sx={{ pb: 5 }}>Dashboard Overview</Typography>
            
            {/* Statistical Cards */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: 2 }}>
                            <CurrencyRupeeIcon color="primary" />
                        </Box>
                        <Box>
                            <Typography variant='h6'>Total Revenue</Typography>
                            <Typography variant='h5'>₹45,231</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ bgcolor: '#f3e5f5', p: 1, borderRadius: 2 }}>
                            <ShoppingBagIcon sx={{ color: '#9c27b0' }} />
                        </Box>
                        <Box>
                            <Typography variant='h6'>Total Orders</Typography>
                            <Typography variant='h5'>124</Typography>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ bgcolor: '#e8f5e9', p: 1, borderRadius: 2 }}>
                            <PeopleIcon color="success" />
                        </Box>
                        <Box>
                            <Typography variant='h6'>Total Customers</Typography>
                            <Typography variant='h5'>85</Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Sales Chart Section */}
            <Card sx={{ mt: 5, p: 3 }}>
                <CardHeader title="Weekly Sales Performance" />
                <Box sx={{ display: 'grid', gap: 2 }}>
                    {data.map((item) => (
                        <Box key={item.name}>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>{item.name}</Typography>
                            <Box sx={{ height: 10, borderRadius: 1, bgcolor: '#eceff1', overflow: 'hidden' }}>
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: `${Math.min((item.sales / 5000) * 100, 100)}%`,
                                        bgcolor: '#9155FD',
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Card>
        </div>
    );
};

export default AdminDashboard;
