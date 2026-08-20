import React from 'react';
import { Box, Typography, Avatar, IconButton, useTheme } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSelector, useDispatch } from 'react-redux';
import { removeStaff } from '../addition_slices/arrangementSlice';
import {
    GOLD, BROWN_TEXT, MUTED_TEXT,
    LIGHT_CARD, LIGHT_INPUT, LIGHT_BORDER,
    DARK_CARD_BACKGROUND, DARK_CARD_BORDER, DARK_CARD_SHADOW,
    DARK_CARD_HOVER_SHADOW, DARK_SURFACE_BG, DARK_SURFACE_BORDER
} from '../../../../utils/colorConstants';
const StaffSummary = () => {
    const selected = useSelector(state => state.arrangement.selectedStaff);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{
            p: 3,
            background: isDark ? DARK_SURFACE_BG : LIGHT_INPUT,
            border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}`,
            borderRadius: 3,
            mb: 3,
            backdropFilter: 'blur(8px)'
        }}>
            <Typography variant="caption" sx={{
                color: GOLD,
                fontWeight: 'bold',
                letterSpacing: '0.05rem',
                display: 'block',
                mb: 2
            }}>
                SELECTED STAFF SUMMARY
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {selected.map(s => (
                    <Box key={s.id} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1.5,
                        pr: 1,
                        border: `1px solid ${GOLD}`,
                        borderRadius: 2,
                        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255, 255, 255, 0.6)'
                    }}>
                        <Avatar src={s.image} sx={{ width: 40, height: 40, mr: 1.5, border: isDark ? DARK_CARD_BORDER : `1px solid ${LIGHT_BORDER}` }} />
                        <Box sx={{ mr: 2 }}>
                            <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : BROWN_TEXT, fontWeight: 'bold' }}>
                                {s.name}
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: GOLD,
                                textTransform: 'uppercase',
                                display: 'block',
                                fontSize: '0.65rem'
                            }}>
                                {s.role}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => dispatch(removeStaff(s.id))} size="small" sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' } }}>
                            <CancelIcon sx={{ color: isDark ? 'rgba(255,255,255,0.6)' : MUTED_TEXT, fontSize: '1.2rem' }} />
                        </IconButton>
                    </Box>
                ))}

                {selected.length < 3 && (
                    <Box sx={{
                        border: `1px dashed ${isDark ? 'rgba(255,255,255,0.12)' : LIGHT_BORDER}`,
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 180
                    }}>
                        <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : MUTED_TEXT, fontStyle: 'italic' }}>
                            No other staff selected
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default StaffSummary;