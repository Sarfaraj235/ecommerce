import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Card, CardHeader, Typography, Box } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import { adminApi } from '../services/adminApi';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value || 0));

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadOverview = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await adminApi.getDashboardOverview();
        if (!cancelled) setOverview(data || {});
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || err?.message || 'Unable to load dashboard overview.');
          setOverview({});
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOverview();
    return () => {
      cancelled = true;
    };
  }, []);

  const revenueSeries = useMemo(() => {
    const list = Array.isArray(overview?.revenueSeries) ? overview.revenueSeries : [];
    const max = Math.max(...list.map((item) => Number(item?.value || 0)), 1);

    return list.map((item) => ({
      label: item?.label || '-',
      value: Number(item?.value || 0),
      width: `${Math.max((Number(item?.value || 0) / max) * 100, 2)}%`,
    }));
  }, [overview]);

  return (
    <div className='p-10'>
      <Typography variant='h4' sx={{ pb: 5 }}>Dashboard Overview</Typography>
      {loading && <Typography variant='body2' sx={{ pb: 2, color: 'text.secondary' }}>Loading overview...</Typography>}
      {error && <Typography variant='body2' sx={{ pb: 2, color: 'error.main' }}>{error}</Typography>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: 2 }}>
              <CurrencyRupeeIcon color='primary' />
            </Box>
            <Box>
              <Typography variant='h6'>Total Revenue</Typography>
              <Typography variant='h5'>INR {formatCurrency(overview?.totalRevenue)}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#f3e5f5', p: 1, borderRadius: 2 }}>
              <ShoppingBagIcon sx={{ color: '#9c27b0' }} />
            </Box>
            <Box>
              <Typography variant='h6'>Total Orders</Typography>
              <Typography variant='h5'>{Number(overview?.totalOrders || 0)}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#e8f5e9', p: 1, borderRadius: 2 }}>
              <PeopleIcon color='success' />
            </Box>
            <Box>
              <Typography variant='h6'>Total Customers</Typography>
              <Typography variant='h5'>{Number(overview?.totalUsers || 0)}</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#fff3e0', p: 1, borderRadius: 2 }}>
              <InventoryIcon sx={{ color: '#ef6c00' }} />
            </Box>
            <Box>
              <Typography variant='h6'>Total Products</Typography>
              <Typography variant='h5'>{Number(overview?.totalProducts || 0)}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 5, p: 3 }}>
        <CardHeader
          title='Revenue (Last 7 Days)'
          subheader={`Today: INR ${formatCurrency(overview?.todayRevenue)} | This Month: INR ${formatCurrency(overview?.monthRevenue)}`}
        />

        <Box sx={{ display: 'grid', gap: 2 }}>
          {revenueSeries.map((item) => (
            <Box key={item.label}>
              <Typography variant='body2' sx={{ mb: 0.5 }}>
                {item.label} - INR {formatCurrency(item.value)}
              </Typography>
              <Box sx={{ height: 10, borderRadius: 1, bgcolor: '#eceff1', overflow: 'hidden' }}>
                <Box
                  sx={{
                    height: '100%',
                    width: item.width,
                    bgcolor: '#9155FD',
                  }}
                />
              </Box>
            </Box>
          ))}

          {!loading && revenueSeries.length === 0 && (
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              No revenue trend data available.
            </Typography>
          )}
        </Box>
      </Card>
    </div>
  );
};

export default AdminDashboard;
