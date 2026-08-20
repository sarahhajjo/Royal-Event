import React from 'react';
import { Box, Typography, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';
const SelectedProductsSummary = ({ products, onClearAll, onRemoveItem }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: GOLD, fontWeight: 'bold', letterSpacing: '0.05rem', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                    Selected Products Summary
                </Typography>
                <Typography onClick={onClearAll} sx={{ color: '#E57373', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    CLEAR ALL
                </Typography>
            </Box>
            <TableContainer component={Paper} sx={{
                background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
                border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
                borderRadius: 2,
                backdropFilter: 'blur(8px)',
                boxShadow: 'none'
            }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ '& th': { color: GOLD, fontWeight: 'bold', fontSize: '0.75rem', borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` } }}>
                            <TableCell>PRODUCT</TableCell>
                            <TableCell>VARIANT</TableCell>
                            <TableCell>QTY</TableCell>
                            <TableCell align="right">ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2, borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` }}>
                                    <Box sx={{ width: 45, height: 45, borderRadius: 1, overflow: 'hidden' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Box>
                                    <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT }}>{item.name}</Typography>
                                </TableCell>

                                <TableCell sx={{ borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: item.variantColor }} />
                                        <Typography sx={{ color: isDark ? '#ffffff' : BROWN_TEXT }}>
                                            {item.variantName}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                <TableCell sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` }}>
                                    {item.qty}
                                </TableCell>

                                <TableCell align="right" sx={{ borderBottom: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` }}>
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