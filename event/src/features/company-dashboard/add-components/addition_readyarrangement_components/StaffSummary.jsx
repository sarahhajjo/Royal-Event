import React from 'react';
import { Box, Typography, Avatar, IconButton, useTheme } from '@mui/material'; // إضافة useTheme
import CancelIcon from '@mui/icons-material/Cancel';
import { useSelector, useDispatch } from 'react-redux';
import { removeStaff } from '../addition_slices/arrangementSlice';

const StaffSummary = () => {
    const selected = useSelector(state => state.arrangement.selectedStaff);
    const dispatch = useDispatch();
    const theme = useTheme(); // استخدام الثيم
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{
            p: 3,
            bgcolor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)', // استخدام خلفية الـ Paper
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            mb: 3
        }}>
            <Typography variant="caption" sx={{
                color: theme.palette.primary.main, // اللون الذهبي من الثيم
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
                        border: `1px solid ${theme.palette.primary.main}`, // إطار ذهبي
                        borderRadius: 2,
                        bgcolor: theme.palette.background.default // خلفية المربع
                    }}>
                        <Avatar src={s.image} sx={{ width: 40, height: 40, mr: 1.5 }} />
                        <Box sx={{ mr: 2 }}>
                            <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                                {s.name}
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: theme.palette.primary.main,
                                textTransform: 'uppercase',
                                display: 'block',
                                fontSize: '0.65rem'
                            }}>
                                {s.role}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => dispatch(removeStaff(s.id))} size="small">
                            <CancelIcon sx={{ color: theme.palette.text.secondary, fontSize: '1.2rem' }} />
                        </IconButton>
                    </Box>
                ))}

                {selected.length < 3 && (
                    <Box sx={{
                        border: `1px dashed ${theme.palette.divider}`,
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 180
                    }}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.disabled, fontStyle: 'italic' }}>
                            No other staff selected
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default StaffSummary;