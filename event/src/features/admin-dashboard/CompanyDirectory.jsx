import React from 'react';
import { Box, Paper, Typography, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// بيانات وهمية (Mock Data) للشكل فقط
const mockUsers = [
    { id: 1, name: "Julian Thorne", role: "CHIEF OPERATIONS", email: "j.thorne@aurelian.com", phone: "+1 (212) 555-0198" },
    { id: 2, name: "Marcus Vane", role: "FOUNDING PARTNER", email: "m.vane@aurelian.com", phone: "+1 (212) 555-0102" },
    { id: 3, name: "Elena Rossi", role: "ASSET STRATEGIST", email: "e.rossi@aurelian.com", phone: "+1 (212) 555-0344" },
];

const CompanyDirectory = () => {
    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            bgcolor: '#FDFBF7', // خلفية بيضاء ثابتة
            color: '#2B211E',   // نص غامق ثابت
            fontFamily: "'Playfair Display', serif"
        }}>

            {/* 1. الجانب الأيسر (Sidebar) */}
            <Box sx={{
                width: '260px',
                p: 4,
                borderRight: '1px solid #e0dcd5',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#FDFBF7'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 4, color: '#2B211E' }}>
                    Aurelian Reserve
                </Typography>
                <Typography sx={{ mb: 2, color: '#b38c45', fontWeight: 'bold' }}>Company Directory</Typography>
                <Typography sx={{ mb: 2, color: '#7A6F5E' }}>Overview</Typography>
                <Typography sx={{ mb: 2, color: '#7A6F5E' }}>Pending Approvals</Typography>

                <Box sx={{ mt: 'auto' }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#2B211E' }}>Admin Executive</Typography>
                    <Typography variant="caption" sx={{ color: '#7A6F5E' }}>MASTER PRIVILEGES</Typography>
                </Box>
            </Box>

            {/* 2. الجانب الأيمن (Content) */}
            <Paper sx={{
                flexGrow: 1,
                p: 6,
                bgcolor: '#FDFBF7', // خلفية بيضاء ثابتة
                boxShadow: 'none',
                color: '#2B211E'
            }}>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 'medium', color: '#2B211E' }}>
                    Company Directory
                </Typography>
                <Typography sx={{ mb: 4, color: '#5A5043', maxWidth: '500px' }}>
                    A curated index of privileged personnel and stakeholders within the Aurelian network.
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ '& th': { borderBottom: '1px solid #e0dcd5', color: '#7A6F5E', fontSize: '10px', letterSpacing: '1px' } }}>
                                <TableCell>PORTRAIT</TableCell>
                                <TableCell>IDENTITY</TableCell>
                                <TableCell>CORRESPONDENCE</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockUsers.map((user) => (
                                <TableRow key={user.id} sx={{ '& td': { borderBottom: '1px solid #e0dcd5', py: 3 } }}>
                                    <TableCell><Avatar sx={{ width: 50, height: 50, bgcolor: '#b38c45' }} /></TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#2B211E' }}>{user.name}</Typography>
                                        <Typography sx={{ fontSize: '10px', letterSpacing: '1px', color: '#7A6F5E' }}>{user.role}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ color: '#2B211E' }}>{user.email}</Typography>
                                        <Typography variant="body2" sx={{ color: '#5A5043' }}>{user.phone}</Typography>
                                        <IconButton size="small" sx={{ float: 'right', color: '#7A6F5E' }}><InfoOutlinedIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default CompanyDirectory;