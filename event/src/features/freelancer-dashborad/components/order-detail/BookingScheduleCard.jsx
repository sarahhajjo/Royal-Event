import React from 'react';
import { Box, Typography } from '@mui/material';

// أيقونة تقويم كـ SVG مباشر (بدون الاعتماد على @mui/icons-material)
const CalendarIcon = (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export default function BookingScheduleCard({ bookedDate, shift, createdAtHuman }) {
    return (
        <Box
            sx={{
                bgcolor: '#1a1714',
                borderRadius: '16px',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
            }}
        >
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <Box sx={{ display: 'flex', color: (theme) => theme.palette.primary.main }}>
                        <CalendarIcon width={20} height={20} />
                    </Box>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: (theme) => theme.palette.text.primary }}>
                        Schedule
                    </Typography>
                </Box>

                <Box
                    sx={{
                        position: 'relative',
                        pl: 2.5,
                        ml: 1,
                        borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                left: -21,
                                top: 6,
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: (theme) => theme.palette.primary.main
                            }}
                        />
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
                            {bookedDate}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: (theme) => theme.palette.text.secondary }}>
                            {shift ? `${shift.name} (${shift.start_time} - ${shift.end_time})` : "Event Day"}
                        </Typography>
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                left: -21,
                                top: 6,
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: (theme) => theme.palette.text.secondary
                            }}
                        />
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
                            Created
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: (theme) => theme.palette.text.secondary }}>
                            {createdAtHuman || "منذ فترة"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}