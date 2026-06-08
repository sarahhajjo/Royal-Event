import React from 'react';
import { Box, Typography, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SelectedProductsSummary = ({ products, onClearAll, onRemoveItem }) => {
    const theme = useTheme();

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            {/* الرأس: العنوان و Clear All */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: theme.palette.primary.main, fontWeight: 'bold', letterSpacing: '0.05rem', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                    Selected Products Summary
                </Typography>
                <Typography onClick={onClearAll} sx={{ color: '#E57373', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    CLEAR ALL
                </Typography>
            </Box>
            {/* الجدول */}
            <TableContainer component={Paper} sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ '& th': { color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '0.75rem', borderBottom: `1px solid ${theme.palette.divider}` } }}>
                            <TableCell>PRODUCT</TableCell>
                            <TableCell>VARIANT</TableCell>
                            <TableCell>QTY</TableCell>
                            <TableCell align="right">ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((item) => (
                            <TableRow key={item.id}>
                                {/* الصورة والاسم */}
                                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ width: 45, height: 45, borderRadius: 1, overflow: 'hidden' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Box>
                                    <Typography sx={{ color: theme.palette.text.primary }}>{item.name}</Typography>
                                </TableCell>

                                {/* اللون (VARIANT) */}
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: item.variantColor }} />
                                        <Typography sx={{ color: theme.palette.text.primary }}>
                                            {item.variantName}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {/* الكمية (QTY) */}
                                <TableCell sx={{ color: theme.palette.text.primary }}>
                                    {item.qty}
                                </TableCell>

                                <TableCell align="right">
                                    <IconButton onClick={() => onRemoveItem(item.id)} sx={{ color: '#E57373' }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SelectedProductsSummary;