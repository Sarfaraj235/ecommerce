import React from 'react'
import { AccountCircle, SettingsCell, AttachMoney, MoreVert, TrendingUp } from '@mui/icons-material'
import { Card, CardHeader, CardContent, IconButton, Typography, Grid, Box, Avatar } from '@mui/material'

const salesData = [
    {
        stats: '245k',
        title: 'Sales',
        color: 'primary',
        icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
        stats: '12.5k',
        title: 'Customers',
        color: 'success',
        icon: <AccountCircle sx={{ fontSize: '1.75rem' }} />
    },
    {
        stats: '1.54k',
        title: 'Products',
        color: 'warning',
        icon: <SettingsCell sx={{ fontSize: '1.75rem' }} />
    },
    {
        stats: '88k',
        title: 'Revenue',
        color: 'info',
        icon: <AttachMoney sx={{ fontSize: '1.75rem' }} />
    }
]

const renderStats = () => {
    return salesData.map((item, index) => (
        <Grid item xs={12} sm={3} key={index}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                    variant='rounded'
                    sx={{
                        mr: 3,
                        width: 44,
                        height: 44,
                        boxShadow: 3,
                        color: 'common.white',
                        backgroundColor: `${item.color}.main`
                    }}
                >
                    {item.icon}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='caption'>{item.title}</Typography>
                    <Typography variant='h6'>{item.stats}</Typography>
                </Box>
            </Box>
        </Grid>
    ))
}

const MonthlyOverview = () => {
    return (
        <Card sx={{ bgcolor: "#242B2E", color: "white" }}>
            <CardHeader
                title='Monthly Overview'
                action={
                    <IconButton size='small' sx={{ color: 'white' }}>
                        <MoreVert />
                    </IconButton>
                }
                subheader={
                    <Typography variant='body2' sx={{ color: 'white' }}>
                        <Box component='span' sx={{ fontWeight: 600, color: 'white' }}>
                            Total 48.5% growth
                        </Box> {" "}
                        😎 this month
                    </Typography>
                }
                titleTypographyProps={{
                    sx: {
                        mb: 2.5,
                        lineHeight: '2rem !important',
                        letterSpacing: '0.15px !important'
                    }
                }}
            />
            <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
                <Grid container spacing={[5, 0]}>
                    {renderStats()}
                </Grid>
            </CardContent>
        </Card>
    )
}

export default MonthlyOverview
