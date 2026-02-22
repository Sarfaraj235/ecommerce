import React from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Avatar, Card, CardHeader 
} from '@mui/material';

const Customers = () => {
    // Mock customer data - this would normally be fetched from your backend
    const customers = [
        { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com", imageUrl: "" },
        { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", imageUrl: "" },
        { id: 3, firstName: "Sarfaraz", lastName: "Ahmed", email: "sarfaraz@example.com", imageUrl: "" },
    ];

    return (
        <div className='p-5'>
            <Card className='mt-2'>
                <CardHeader title="All Customers" />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="customer table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Avatar</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="center">User ID</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.map((user) => (
                                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Avatar src={user.imageUrl} sx={{ bgcolor: "#9155FD" }}>
                                            {user.firstName[0]}
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell align="center">{user.id}</TableCell>
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
