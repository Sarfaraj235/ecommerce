import React from 'react';
import { Card, Typography, Button, styled } from '@mui/material';

// Custom styled component for the illustration image
const TriangleImg = styled('img')({
    right: 0,
    bottom: 0,
    height: 170,
    position: 'absolute'
});

const TrophyImg = styled('img')({
    right: 36,
    bottom: 20,
    height: 98,
    position: 'absolute'
});

const Achievement = () => {
    return (
        <Card sx={{ position: "relative", bgcolor: "#242B2E", color: "white" }}>
            <div className='p-4'>
                <Typography variant='h6' sx={{ letterSpacing: ".25px" }}>
                    Shop With Zosh
                </Typography>
                <Typography variant='body2' sx={{ mt: 1 }}>
                    Congratulations 🥳
                </Typography>
                
                <Typography variant='h5' sx={{ my: 2.5, color: "gold" }}>
                    420.8k
                </Typography>

                <Button size='small' variant='contained' sx={{ bgcolor: "#9155FD" }}>
                    View Sales
                </Button>

                {/* Decorative Images (Commonly used in Zosh's templates) */}
                <TriangleImg src='' alt='triangle background' />
                <TrophyImg src='https://cdn-icons-png.flaticon.com' alt='trophy' />
            </div>
        </Card>
    );
};

export default Achievement;
